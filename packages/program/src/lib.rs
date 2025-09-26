use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

declare_id!("B4NDprogrammmmmmmmmmmmmmmmmmmmmmmmmmmmm");

#[program]
pub mod band4band {
    use super::*;

    pub fn registry_init(ctx: Context<RegistryInit>, treasury: Pubkey) -> Result<()> {
        let registry = &mut ctx.accounts.registry;
        registry.authority = ctx.accounts.authority.key();
        registry.treasury = treasury;
        registry.freshness_window_s = 3600; // 1 hour
        registry.publishers = Vec::new();

        msg!("Registry initialized with authority: {}", ctx.accounts.authority.key());
        Ok(())
    }

    pub fn registry_add_publisher(ctx: Context<RegistryAddPublisher>, publisher: Pubkey) -> Result<()> {
        let registry = &mut ctx.accounts.registry;

        require!(
            registry.authority == ctx.accounts.authority.key(),
            ErrorCode::Unauthorized
        );

        require!(
            !registry.publishers.contains(&publisher),
            ErrorCode::PublisherAlreadyExists
        );

        registry.publishers.push(publisher);
        msg!("Added publisher: {}", publisher);
        Ok(())
    }

    pub fn feed_init(ctx: Context<FeedInit>, league: [u8; 8], game_id: [u8; 32]) -> Result<()> {
        let feed = &mut ctx.accounts.feed;
        feed.league = league;
        feed.game_id = game_id;
        feed.latest_hash = [0; 32];
        feed.latest_ts = 0;
        feed.ipfs_cid = [0; 64];
        feed.publisher = Pubkey::default();
        feed.ring = [FeedUpdate::default(); 16];
        feed.ring_index = 0;

        msg!("Feed initialized for game: {}", String::from_utf8_lossy(&game_id));
        Ok(())
    }

    pub fn feed_submit_update(
        ctx: Context<FeedSubmitUpdate>,
        payload_hash: [u8; 32],
        ipfs_cid: [u8; 64],
        ts: i64,
    ) -> Result<()> {
        let feed = &mut ctx.accounts.feed;
        let registry = &ctx.accounts.registry;
        let clock = Clock::get()?;

        // Verify publisher is authorized
        require!(
            registry.publishers.contains(&ctx.accounts.publisher.key()),
            ErrorCode::UnauthorizedPublisher
        );

        // Verify freshness
        let time_diff = (clock.unix_timestamp - ts).abs();
        require!(
            time_diff <= registry.freshness_window_s,
            ErrorCode::StaleData
        );

        // Update feed
        feed.latest_hash = payload_hash;
        feed.latest_ts = ts;
        feed.ipfs_cid = ipfs_cid;
        feed.publisher = ctx.accounts.publisher.key();

        // Add to ring buffer
        let ring_index = feed.ring_index as usize;
        feed.ring[ring_index] = FeedUpdate { ts, hash: payload_hash };
        feed.ring_index = (feed.ring_index + 1) % 16;

        msg!("Feed updated with hash: {:?}", payload_hash);
        Ok(())
    }

    pub fn market_init(
        ctx: Context<MarketInit>,
        game_id: [u8; 32],
        market_kind: u8,
        close_time: i64,
        treasury: Pubkey,
    ) -> Result<()> {
        let market = &mut ctx.accounts.market;
        market.state = MarketState::Open;
        market.outcome = MarketOutcome::Pending;
        market.game_id = game_id;
        market.market_kind = market_kind;
        market.close_time = close_time;
        market.settlement_feed = ctx.accounts.settlement_feed.key();
        market.treasury = treasury;
        market.total_home_stake = 0;
        market.total_away_stake = 0;

        msg!("Market initialized for game: {}", String::from_utf8_lossy(&game_id));
        Ok(())
    }

    pub fn market_place_position(
        ctx: Context<MarketPlacePosition>,
        side: u8,
        stake_lamports: u64,
    ) -> Result<()> {
        let market = &mut ctx.accounts.market;
        let position = &mut ctx.accounts.position;
        let clock = Clock::get()?;

        // Verify market is open and not past close time
        require!(
            market.state == MarketState::Open,
            ErrorCode::MarketNotOpen
        );

        require!(
            clock.unix_timestamp < market.close_time,
            ErrorCode::MarketClosed
        );

        // Verify valid side
        require!(
            side == 1 || side == 2,
            ErrorCode::InvalidSide
        );

        require!(
            stake_lamports >= 1_000_000, // 0.001 SOL minimum
            ErrorCode::InsufficientStake
        );

        // Transfer SOL to market escrow
        transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.user.to_account_info(),
                    to: ctx.accounts.market.to_account_info(),
                },
            ),
            stake_lamports,
        )?;

        // Update position
        if position.stake_lamports == 0 {
            // New position
            position.side = side;
            position.stake_lamports = stake_lamports;
        } else {
            // Adding to existing position
            require!(
                position.side == side,
                ErrorCode::PositionSideMismatch
            );
            position.stake_lamports += stake_lamports;
        }

        position.claimed = false;

        // Update market totals
        if side == 1 {
            market.total_home_stake += stake_lamports;
        } else {
            market.total_away_stake += stake_lamports;
        }

        msg!("Position placed: {} lamports on side {}", stake_lamports, side);
        Ok(())
    }

    pub fn market_lock(ctx: Context<MarketLock>) -> Result<()> {
        let market = &mut ctx.accounts.market;

        require!(
            market.state == MarketState::Open,
            ErrorCode::MarketNotOpen
        );

        market.state = MarketState::Locked;
        msg!("Market locked");
        Ok(())
    }

    pub fn market_resolve(ctx: Context<MarketResolve>, outcome: u8) -> Result<()> {
        let market = &mut ctx.accounts.market;
        let feed = &ctx.accounts.settlement_feed;

        require!(
            market.state == MarketState::Locked,
            ErrorCode::MarketNotLocked
        );

        require!(
            outcome == 1 || outcome == 2, // Home or Away
            ErrorCode::InvalidOutcome
        );

        // Verify feed has recent data
        let clock = Clock::get()?;
        require!(
            clock.unix_timestamp - feed.latest_ts <= 7200, // 2 hours
            ErrorCode::StaleOracleData
        );

        market.state = MarketState::Resolved;
        market.outcome = if outcome == 1 { MarketOutcome::Home } else { MarketOutcome::Away };

        msg!("Market resolved with outcome: {}", outcome);
        Ok(())
    }

    pub fn market_claim(ctx: Context<MarketClaim>) -> Result<()> {
        let market = &ctx.accounts.market;
        let position = &mut ctx.accounts.position;

        require!(
            market.state == MarketState::Resolved,
            ErrorCode::MarketNotResolved
        );

        require!(
            !position.claimed,
            ErrorCode::AlreadyClaimed
        );

        // Check if position is winning
        let is_winner = match market.outcome {
            MarketOutcome::Home => position.side == 1,
            MarketOutcome::Away => position.side == 2,
            _ => false,
        };

        require!(is_winner, ErrorCode::LosingPosition);

        // Calculate payout
        let total_pool = market.total_home_stake + market.total_away_stake;
        let winning_pool = if market.outcome == MarketOutcome::Home {
            market.total_home_stake
        } else {
            market.total_away_stake
        };

        let payout = if winning_pool == 0 {
            0
        } else {
            (position.stake_lamports as u128 * total_pool as u128 / winning_pool as u128) as u64
        };

        // Transfer payout
        **market.to_account_info().try_borrow_mut_lamports()? -= payout;
        **ctx.accounts.user.to_account_info().try_borrow_mut_lamports()? += payout;

        position.claimed = true;

        msg!("Claimed payout: {} lamports", payout);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct RegistryInit<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Registry::INIT_SPACE,
        seeds = [b"registry"],
        bump
    )]
    pub registry: Account<'info, Registry>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RegistryAddPublisher<'info> {
    #[account(
        mut,
        seeds = [b"registry"],
        bump
    )]
    pub registry: Account<'info, Registry>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(league: [u8; 8], game_id: [u8; 32])]
pub struct FeedInit<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + GameFeed::INIT_SPACE,
        seeds = [b"feed", league.as_ref(), game_id.as_ref()],
        bump
    )]
    pub feed: Account<'info, GameFeed>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct FeedSubmitUpdate<'info> {
    #[account(mut)]
    pub feed: Account<'info, GameFeed>,

    #[account(
        seeds = [b"registry"],
        bump
    )]
    pub registry: Account<'info, Registry>,

    pub publisher: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(game_id: [u8; 32], market_kind: u8)]
pub struct MarketInit<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + Market::INIT_SPACE,
        seeds = [b"mkt", game_id.as_ref(), &[market_kind]],
        bump
    )]
    pub market: Account<'info, Market>,

    /// CHECK: Settlement feed must exist
    pub settlement_feed: AccountInfo<'info>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MarketPlacePosition<'info> {
    #[account(mut)]
    pub market: Account<'info, Market>,

    #[account(
        init_if_needed,
        payer = user,
        space = 8 + Position::INIT_SPACE,
        seeds = [b"pos", market.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub position: Account<'info, Position>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MarketLock<'info> {
    #[account(mut)]
    pub market: Account<'info, Market>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct MarketResolve<'info> {
    #[account(mut)]
    pub market: Account<'info, Market>,

    pub settlement_feed: Account<'info, GameFeed>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct MarketClaim<'info> {
    #[account(mut)]
    pub market: Account<'info, Market>,

    #[account(mut)]
    pub position: Account<'info, Position>,

    #[account(mut)]
    pub user: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct Registry {
    pub authority: Pubkey,
    pub treasury: Pubkey,
    pub freshness_window_s: i64,
    #[max_len(10)]
    pub publishers: Vec<Pubkey>,
}

#[account]
#[derive(InitSpace)]
pub struct GameFeed {
    pub league: [u8; 8],
    pub game_id: [u8; 32],
    pub latest_hash: [u8; 32],
    pub latest_ts: i64,
    pub ipfs_cid: [u8; 64],
    pub publisher: Pubkey,
    pub ring: [FeedUpdate; 16],
    pub ring_index: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Default, InitSpace)]
pub struct FeedUpdate {
    pub ts: i64,
    pub hash: [u8; 32],
}

#[account]
#[derive(InitSpace)]
pub struct Market {
    pub state: MarketState,
    pub outcome: MarketOutcome,
    pub game_id: [u8; 32],
    pub market_kind: u8,
    pub close_time: i64,
    pub settlement_feed: Pubkey,
    pub treasury: Pubkey,
    pub total_home_stake: u64,
    pub total_away_stake: u64,
}

#[account]
#[derive(InitSpace)]
pub struct Position {
    pub side: u8,
    pub stake_lamports: u64,
    pub claimed: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum MarketState {
    Open,
    Locked,
    Resolved,
    Void,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum MarketOutcome {
    Pending,
    Home,
    Away,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Publisher already exists")]
    PublisherAlreadyExists,
    #[msg("Unauthorized publisher")]
    UnauthorizedPublisher,
    #[msg("Data is too stale")]
    StaleData,
    #[msg("Market is not open")]
    MarketNotOpen,
    #[msg("Market is closed for betting")]
    MarketClosed,
    #[msg("Invalid betting side")]
    InvalidSide,
    #[msg("Insufficient stake amount")]
    InsufficientStake,
    #[msg("Position side mismatch")]
    PositionSideMismatch,
    #[msg("Market is not locked")]
    MarketNotLocked,
    #[msg("Invalid outcome")]
    InvalidOutcome,
    #[msg("Oracle data is stale")]
    StaleOracleData,
    #[msg("Market is not resolved")]
    MarketNotResolved,
    #[msg("Position already claimed")]
    AlreadyClaimed,
    #[msg("This is a losing position")]
    LosingPosition,
}
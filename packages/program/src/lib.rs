use anchor_lang::prelude::*;

declare_id!("B4NDprogrammmmmmmmmmmmmmmmmmmmmmmmmmmmm");

#[program]
pub mod band4band {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        msg!("Band 4 Band protocol initialized!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

#[error_code]
pub enum ErrorCode {
    #[msg("Custom error message")]
    CustomError,
}
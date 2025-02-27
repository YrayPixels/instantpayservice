import { ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { NextFunction } from "express";
import { supabase } from "..";


const getQuote = async (inputMint: string, outputMint: string, amount: string) => {
    try {
        // Get quote for ExactOut swap to USDC
        const quoteUrl = `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&swapMode=ExactOut&slippageBps=50`;
        const response = await fetch(quoteUrl);
        const quoteData = await response.json();

        if (response.status !== 200) {
            return ({ error: quoteData.error || 'Failed to get quote' });
        }

        return (quoteData);
    } catch (error) {
        console.error('Error getting quote:', error);
        return ({ error: 'Failed to get quote' });
    }
}
// Middleware to check authentication
const checkAuth = async (req: any, res: any, next: any) => {

    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // const {data, error} = await supabase.auth.admin.listUsers();

        const { data, error } = await supabase
            .from('api_keys')
            .select('*')
            .eq('key_value', token.split(' ')[1])
            .single();
        const response = await supabase.from('merchant_pay_info').select('*').eq('user_id', data.user_id).single();
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to authenticate' });
        }

        req.merchant_wallet = response.data.wallet_address;

        next()
    } catch (err) {
        console.error('Error checking authentication:', err);
        return res.status(500).json({ error: 'Failed to authenticate' });
    }
};

// Get merchant's USDC token account
async function getMerchantUSDCTokenAccount(merchantWallet: string) {
    try {
        const merchantUSDCTokenAccount = await getAssociatedTokenAddress(
            USDC_MINT,
            new PublicKey(merchantWallet),
            true,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
        );
        return merchantUSDCTokenAccount;
    } catch (error) {
        console.error('Error getting merchant USDC token account:', error);
        throw error;
    }
}
const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'); // USDC mint address

export {
    getQuote,
    checkAuth,
    getMerchantUSDCTokenAccount,
    USDC_MINT
}
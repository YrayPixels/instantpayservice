"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.USDC_MINT = exports.checkAuth = exports.getQuote = void 0;
exports.getMerchantUSDCTokenAccount = getMerchantUSDCTokenAccount;
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const __1 = require("..");
const getQuote = (inputMint, outputMint, amount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get quote for ExactOut swap to USDC
        const quoteUrl = `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&swapMode=ExactOut&slippageBps=50`;
        const response = yield fetch(quoteUrl);
        const quoteData = yield response.json();
        if (response.status !== 200) {
            return ({ error: quoteData.error || 'Failed to get quote' });
        }
        return (quoteData);
    }
    catch (error) {
        console.error('Error getting quote:', error);
        return ({ error: 'Failed to get quote' });
    }
});
exports.getQuote = getQuote;
// Middleware to check authentication
const checkAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        // const {data, error} = await supabase.auth.admin.listUsers();
        const { data, error } = yield __1.supabase
            .from('api_keys')
            .select('*')
            .eq('key_value', token.split(' ')[1])
            .single();
        const response = yield __1.supabase.from('merchant_pay_info').select('*').eq('user_id', data.user_id).single();
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to authenticate' });
        }
        req.merchant_wallet = response.data.wallet_address;
        next();
    }
    catch (err) {
        console.error('Error checking authentication:', err);
        return res.status(500).json({ error: 'Failed to authenticate' });
    }
});
exports.checkAuth = checkAuth;
// Get merchant's USDC token account
function getMerchantUSDCTokenAccount(merchantWallet) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const merchantUSDCTokenAccount = yield (0, spl_token_1.getAssociatedTokenAddress)(USDC_MINT, new web3_js_1.PublicKey(merchantWallet), true, spl_token_1.TOKEN_PROGRAM_ID, spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID);
            return merchantUSDCTokenAccount;
        }
        catch (error) {
            console.error('Error getting merchant USDC token account:', error);
            throw error;
        }
    });
}
const USDC_MINT = new web3_js_1.PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'); // USDC mint address
exports.USDC_MINT = USDC_MINT;

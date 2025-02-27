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
exports.supabase = exports.supabaseAnonKey = exports.supabaseUrl = void 0;
const lib_1 = require("./requests/lib");
const supabase_js_1 = require("@supabase/supabase-js");
const web3_js_1 = require("@solana/web3.js");
const fetch = require('node-fetch');
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const bodyParser = require('body-parser');
const upload = multer({ dest: "uploads/" });
dotenv.config();
const app = express();
app.use(cors());
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static('public'));
exports.supabaseUrl = "https://vqyauogbktticwpzhdac.supabase.co";
exports.supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";
exports.supabase = (0, supabase_js_1.createClient)(exports.supabaseUrl, exports.supabaseAnonKey);
// Prepare Transaction
app.post('/api/prepare-transaction', lib_1.checkAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { publicKey, tokenMint, amount } = req.body;
        let merchant_wallet = req.merchant_wallet;
        if (!publicKey || !tokenMint || !amount) {
            return res.status(400).json({ error: 'User public key, amount and quote response are required' });
        }
        const quoteResponse = yield (0, lib_1.getQuote)(tokenMint, lib_1.USDC_MINT.toString(), amount);
        // Get merchant's USDC token account
        const merchantUSDCTokenAccount = yield (0, lib_1.getMerchantUSDCTokenAccount)(merchant_wallet);
        // Prepare swap transaction using Jupiter API
        const pubkey = new web3_js_1.PublicKey(publicKey);
        const swapResponse = yield (yield fetch('https://api.jup.ag/swap/v1/swap', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quoteResponse,
                userPublicKey: pubkey.toBase58(),
                destinationTokenAccount: merchantUSDCTokenAccount.toBase58(),
                // trackingAccount: trackingAccount.toBase58(),
            })
        })).json();
        res.status(200).json({ transaction: swapResponse.swapTransaction });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
}));
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import { checkAuth, getMerchantUSDCTokenAccount, getQuote, USDC_MINT } from "./requests/lib";
import { createClient } from "@supabase/supabase-js";
import { PublicKey, VersionedTransaction } from "@solana/web3.js";


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

export const supabaseUrl = "https://vqyauogbktticwpzhdac.supabase.co";
export const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);


// Prepare Transaction
app.get('/', async (req: any, res: any) => {
  return res.status(200).json({ "status": "OK" });
});
app.post('/api/prepare-transaction', checkAuth, async (req: any, res: any) => {
  try {
    const { publicKey, tokenMint, amount } = req.body;
    let merchant_wallet = req.merchant_wallet;

    if (!publicKey || !tokenMint || !amount) {
      return res.status(400).json({ error: 'User public key, amount and quote response are required' });
    }

    const quoteResponse = await getQuote(tokenMint, USDC_MINT.toString(), amount)

    // Get merchant's USDC token account
    const merchantUSDCTokenAccount = await getMerchantUSDCTokenAccount(merchant_wallet);
    // Prepare swap transaction using Jupiter API
    const pubkey = new PublicKey(publicKey)


    const swapResponse = await (
      await fetch('https://api.jup.ag/swap/v1/swap', {
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
      })
    ).json();

    res.status(200).json({ transaction: swapResponse.swapTransaction });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});


const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



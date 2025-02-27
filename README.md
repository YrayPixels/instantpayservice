# InstantPay Payment Gateway

A secure server-side API for processing cryptocurrency payments on the Solana blockchain. This service enables merchants to accept various tokens that are automatically converted to USDC.

## Features

- **Token Conversion**: Accept any Solana token and automatically convert it to USDC
- **Secure Authentication**: API key-based authentication system for merchants
- **Jupiter Integration**: Utilizes Jupiter Aggregator for optimal token swaps
- **Merchant Management**: Links merchant accounts with their Solana wallets

## API Endpoints

### Prepare Transaction
`POST /api/prepare-transaction`

Creates a transaction that swaps the customer's token to USDC and sends it directly to the merchant's wallet.

**Request Body:**
```json
{
  "publicKey": "Customer's Solana wallet public key",
  "tokenMint": "Mint address of the token being sent",
  "amount": "Amount in USDC to receive (ExactOut swap)"
}
```

**Response:**
```json
{
  "transaction": "Base64 encoded transaction string"
}
```

**Authorization Required**: Bearer token (API key)

## Architecture

- **Express.js Backend**: Handles API requests and authentication
- **Supabase Integration**: Manages merchant data and API keys
- **Jupiter Aggregator**: Provides optimal swap routes for token conversion
- **Solana Web3.js**: Interfaces with the Solana blockchain

## Setup Requirements

1. Node.js environment
2. Supabase project for data storage
3. Environment variables:
   - `SUPABASE_ANON_KEY`: Supabase anonymous key
   - `PORT`: Server port (defaults to 3001)

## Database Structure

The service relies on two main tables in Supabase:
- `api_keys`: Stores merchant authentication keys
- `merchant_pay_info`: Links user accounts to Solana wallet addresses

## Implementation Notes

- Transactions use the "ExactOut" swap mode to ensure merchants receive the exact USDC amount requested
- Default slippage tolerance is set to 0.5% (50 basis points)
- The service automatically finds and uses the merchant's Associated Token Account for USDC

## Security Considerations

- API keys must be kept secure and rotated regularly
- All transactions are prepared server-side to prevent tampering
- Authentication is required for all sensitive endpoints

## Development

To run the server locally:

```bash
npm install
npm run dev
```

The server will start on port 3001 by default or use the PORT specified in your environment variables.
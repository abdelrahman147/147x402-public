# 147x402 API Reference

## Base URL
```
https://147x402.xyz
```

## Authentication
No authentication required for public endpoints. Payment verification is handled through Solana transaction signatures.

## Rate Limits
- **Free Tier**: 100 requests/minute
- **Pro Tier**: 1,000 requests/minute
- **Enterprise**: Custom limits

## Endpoints

### Health Check
Check if the service is running.

```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": 1698765432000,
  "service": "147x402-facilitator",
  "version": "1.0.0"
}
```

### Create Payment Request
Create a new payment request for a seller.

```http
POST /payment/request
Content-Type: application/json
```

**Request Body:**
```json
{
  "seller": "string",     // Seller's wallet address
  "amount": 0.1,          // Payment amount
  "token": "USDC",        // Token type (USDC, SOL)
  "tokenMint": "string",  // Optional: Custom token mint
  "expiresAt": 1698765432000, // Optional: Expiration timestamp
  "metadata": {}          // Optional: Additional data
}
```

**Response:**
```json
{
  "id": "payment_123",
  "status": "pending",
  "paymentInstructions": {
    "amount": 0.1,
    "token": "USDC",
    "tokenMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    "to": "YOUR_WALLET_ADDRESS",
    "memo": "147x402:payment_123"
  }
}
```

### Verify Payment
Verify a payment using transaction signature.

```http
POST /payment/verify
Content-Type: application/json
```

**Request Body:**
```json
{
  "paymentId": "string",    // Payment ID from request
  "signature": "string"     // Solana transaction signature
}
```

**Response:**
```json
{
  "id": "payment_123",
  "status": "verified",
  "transactionSignature": "YOUR_TRANSACTION_SIGNATURE",
  "verifiedAt": 1698765432000
}
```

### Get Payment Status
Get the current status of a payment.

```http
GET /payment/{paymentId}
```

**Response:**
```json
{
  "id": "payment_123",
  "status": "verified",
  "transactionSignature": "YOUR_TRANSACTION_SIGNATURE",
  "verifiedAt": 1698765432000
}
```

### Get Available Services
Get list of available services (for marketplace).

```http
GET /services
```

**Response:**
```json
[]
```

### Create Batch Payment
Create a batch payment for multiple sellers.

```http
POST /batch/create
Content-Type: application/json
```

**Request Body:**
```json
{
  "payments": [
    {
      "seller": "wallet1",
      "amount": 0.01,
      "token": "USDC"
    },
    {
      "seller": "wallet2",
      "amount": 0.02,
      "token": "USDC"
    }
  ]
}
```

**Response:**
```json
{
  "batchId": "batch_123",
  "status": "pending"
}
```

### Get Batch Status
Get the status of a batch payment.

```http
GET /batch/{batchId}
```

**Response:**
```json
{
  "id": "batch_123",
  "payments": [...],
  "totalAmount": 0.03,
  "token": "USDC",
  "status": "pending",
  "createdAt": 1698765432000
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid request data |
| 402 | Payment Required - Payment not verified |
| 404 | Not Found - Payment/batch not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

## WebSocket Events

Connect to `wss://147x402.xyz/ws` for real-time updates.

### Events

**Payment Update:**
```json
{
  "type": "payment_update",
  "data": {
    "paymentId": "payment_123",
    "status": "verified",
    "timestamp": 1698765432000
  }
}
```

**Error:**
```json
{
  "type": "error",
  "data": {
    "error": "Payment verification failed",
    "paymentId": "payment_123"
  }
}
```

## SDKs

### JavaScript/Node.js
```bash
npm install @147x402/buyer-sdk
npm install @147x402/seller-sdk
```

### Python
```bash
pip install 147x402-sdk
```

### Go
```bash
go get github.com/147x402/sdk-go
```

## Examples

### Complete Payment Flow

```javascript
// 1. Create payment request
const payment = await fetch('https://147x402.xyz/payment/request', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    seller: 'YOUR_WALLET_ADDRESS',
    amount: 0.1,
    token: 'USDC'
  })
});

const paymentData = await payment.json();

// 2. Send Solana transaction (using your wallet)
const signature = await sendSolanaTransaction({
  to: paymentData.paymentInstructions.to,
  amount: paymentData.paymentInstructions.amount,
  memo: paymentData.paymentInstructions.memo
});

// 3. Verify payment
const verification = await fetch('https://147x402.xyz/payment/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    paymentId: paymentData.id,
    signature: signature
  })
});

const verificationData = await verification.json();

// 4. Make API call with payment
const apiResponse = await fetch('https://seller-api.com/data', {
  headers: {
    'X-Payment-Id': paymentData.id,
    'X-Payment-Signature': signature
  }
});
```

### Express.js Integration

```javascript
app.get('/api/data', async (req, res) => {
  const paymentId = req.headers['x-payment-id'];
  const signature = req.headers['x-payment-signature'];
  
  if (!paymentId || !signature) {
    return res.status(402).json({ 
      error: 'Payment required',
      paymentUrl: 'https://147x402.xyz/payment/request'
    });
  }
  
  // Verify payment
  const verification = await fetch('https://147x402.xyz/payment/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentId, signature })
  });
  
  const verificationData = await verification.json();
  
  if (verificationData.status !== 'verified') {
    return res.status(402).json({ error: 'Payment not verified' });
  }
  
  // Return protected data
  res.json({ 
    data: 'Your protected data here',
    paymentId: paymentId
  });
});
```

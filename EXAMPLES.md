# 147x402 Examples

This directory contains practical examples of how to integrate 147x402 into your applications.

## Table of Contents

- [Basic Payment Flow](#basic-payment-flow)
- [Express.js API Server](#expressjs-api-server)
- [AI Agent Integration](#ai-agent-integration)
- [Micropayment System](#micropayment-system)
- [Batch Payments](#batch-payments)
- [WebSocket Integration](#websocket-integration)

## Basic Payment Flow

### JavaScript/Node.js

```javascript
const fetch = require('node-fetch');

async function makePayment() {
  try {
    // 1. Create payment request
    console.log('Creating payment request...');
    const paymentResponse = await fetch('https://147x402.xyz/payment/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        seller: '6MM2m6jtH6VX6UYXv6BCwnZGTdt2JnmiNnLy6uQKkBbG',
        amount: 0.1,
        token: 'USDC'
      })
    });
    
    const payment = await paymentResponse.json();
    console.log('Payment request created:', payment);
    
    // 2. Simulate sending Solana transaction
    console.log('Sending Solana transaction...');
    const signature = 'Aw2YHcoEm2rg78PNGvFxFhj5oYXkmxqsc6PAiQwLXNxyen4528dzRnA2kbHuVUNCh1hHepzhX9kFiiwuHcVu8rm';
    
    // 3. Verify payment
    console.log('Verifying payment...');
    const verifyResponse = await fetch('https://147x402.xyz/payment/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentId: payment.id,
        signature: signature
      })
    });
    
    const verification = await verifyResponse.json();
    console.log('Payment verified:', verification);
    
    return { success: true, paymentId: payment.id };
    
  } catch (error) {
    console.error('Payment failed:', error);
    return { success: false, error: error.message };
  }
}

// Run the example
makePayment();
```

### Python

```python
import requests
import json

def make_payment():
    try:
        # 1. Create payment request
        print("Creating payment request...")
        payment_data = {
            "seller": "6MM2m6jtH6VX6UYXv6BCwnZGTdt2JnmiNnLy6uQKkBbG",
            "amount": 0.1,
            "token": "USDC"
        }
        
        response = requests.post(
            'https://147x402.xyz/payment/request',
            headers={'Content-Type': 'application/json'},
            json=payment_data
        )
        
        payment = response.json()
        print(f"Payment request created: {payment}")
        
        # 2. Simulate sending Solana transaction
        print("Sending Solana transaction...")
        signature = "Aw2YHcoEm2rg78PNGvFxFhj5oYXkmxqsc6PAiQwLXNxyen4528dzRnA2kbHuVUNCh1hHepzhX9kFiiwuHcVu8rm"
        
        # 3. Verify payment
        print("Verifying payment...")
        verify_data = {
            "paymentId": payment["id"],
            "signature": signature
        }
        
        verify_response = requests.post(
            'https://147x402.xyz/payment/verify',
            headers={'Content-Type': 'application/json'},
            json=verify_data
        )
        
        verification = verify_response.json()
        print(f"Payment verified: {verification}")
        
        return {"success": True, "paymentId": payment["id"]}
        
    except Exception as error:
        print(f"Payment failed: {error}")
        return {"success": False, "error": str(error)}

# Run the example
result = make_payment()
print(f"Result: {result}")
```

## Express.js API Server

```javascript
const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

// Middleware to verify payments
async function verifyPayment(req, res, next) {
  const paymentId = req.headers['x-payment-id'];
  const signature = req.headers['x-payment-signature'];
  
  if (!paymentId || !signature) {
    return res.status(402).json({ 
      error: 'Payment required',
      paymentUrl: 'https://147x402.xyz/payment/request'
    });
  }
  
  try {
    const verification = await fetch('https://147x402.xyz/payment/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId, signature })
    });
    
    const verificationData = await verification.json();
    
    if (verificationData.status !== 'verified') {
      return res.status(402).json({ error: 'Payment not verified' });
    }
    
    req.payment = verificationData;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Payment verification failed' });
  }
}

// Free health endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'my-api'
  });
});

// Paid data endpoint
app.get('/api/data', verifyPayment, (req, res) => {
  res.json({
    data: 'This is protected data',
    paymentId: req.payment.id,
    timestamp: new Date().toISOString()
  });
});

// Paid processing endpoint
app.post('/api/process', verifyPayment, (req, res) => {
  const { input } = req.body;
  
  // Process the input
  const result = processData(input);
  
  res.json({
    result: result,
    paymentId: req.payment.id,
    timestamp: new Date().toISOString()
  });
});

function processData(input) {
  // Your business logic here
  return `Processed: ${input}`;
}

app.listen(3000, () => {
  console.log('API server running on port 3000');
});
```

## AI Agent Integration

```javascript
class AIAgent {
  constructor(walletAddress, privateKey) {
    this.walletAddress = walletAddress;
    this.privateKey = privateKey;
    this.paymentHistory = new Map();
  }
  
  async makePaidRequest(apiUrl, endpoint, data = null) {
    try {
      // 1. Create payment request
      const payment = await this.createPaymentRequest(apiUrl);
      
      // 2. Send Solana transaction
      const signature = await this.sendSolanaTransaction(payment);
      
      // 3. Verify payment
      const verification = await this.verifyPayment(payment.id, signature);
      
      if (verification.status === 'verified') {
        // 4. Make API call
        const response = await this.callAPI(apiUrl, endpoint, data, payment.id, signature);
        return response;
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error) {
      console.error('AI Agent payment failed:', error);
      throw error;
    }
  }
  
  async createPaymentRequest(apiUrl) {
    const response = await fetch('https://147x402.xyz/payment/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        seller: this.extractSellerFromUrl(apiUrl),
        amount: 0.01, // AI agents use micropayments
        token: 'USDC'
      })
    });
    
    return await response.json();
  }
  
  async sendSolanaTransaction(payment) {
    // Implement your Solana transaction logic here
    // This is a simplified example
    return 'Aw2YHcoEm2rg78PNGvFxFhj5oYXkmxqsc6PAiQwLXNxyen4528dzRnA2kbHuVUNCh1hHepzhX9kFiiwuHcVu8rm';
  }
  
  async verifyPayment(paymentId, signature) {
    const response = await fetch('https://147x402.xyz/payment/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId, signature })
    });
    
    return await response.json();
  }
  
  async callAPI(apiUrl, endpoint, data, paymentId, signature) {
    const options = {
      method: data ? 'POST' : 'GET',
      headers: {
        'X-Payment-Id': paymentId,
        'X-Payment-Signature': signature,
        'Content-Type': 'application/json'
      }
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(`${apiUrl}${endpoint}`, options);
    return await response.json();
  }
  
  extractSellerFromUrl(apiUrl) {
    // Extract seller wallet from API URL or configuration
    return '6MM2m6jtH6VX6UYXv6BCwnZGTdt2JnmiNnLy6uQKkBbG';
  }
}

// Usage
const agent = new AIAgent('your_wallet_address', 'your_private_key');

// AI agent making a paid API call
agent.makePaidRequest('https://api.example.com', '/data')
  .then(result => console.log('AI Agent result:', result))
  .catch(error => console.error('Error:', error));
```

## Micropayment System

```javascript
class MicropaymentSystem {
  constructor() {
    this.paymentQueue = [];
    this.batchSize = 10;
    this.batchTimeout = 5000; // 5 seconds
  }
  
  async addPayment(seller, amount, token = 'USDC') {
    const payment = {
      id: this.generateId(),
      seller,
      amount,
      token,
      timestamp: Date.now()
    };
    
    this.paymentQueue.push(payment);
    
    // Process batch if full or timeout reached
    if (this.paymentQueue.length >= this.batchSize) {
      await this.processBatch();
    } else {
      this.scheduleBatchProcessing();
    }
    
    return payment.id;
  }
  
  async processBatch() {
    if (this.paymentQueue.length === 0) return;
    
    const batch = this.paymentQueue.splice(0, this.batchSize);
    
    try {
      const response = await fetch('https://147x402.xyz/batch/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payments: batch })
      });
      
      const result = await response.json();
      console.log('Batch payment created:', result);
      
      // Process individual payments
      for (const payment of batch) {
        await this.processIndividualPayment(payment);
      }
      
    } catch (error) {
      console.error('Batch payment failed:', error);
      // Re-queue failed payments
      this.paymentQueue.unshift(...batch);
    }
  }
  
  async processIndividualPayment(payment) {
    // Send Solana transaction for individual payment
    const signature = await this.sendSolanaTransaction(payment);
    
    // Verify payment
    const verification = await fetch('https://147x402.xyz/payment/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentId: payment.id,
        signature: signature
      })
    });
    
    const result = await verification.json();
    console.log('Payment processed:', result);
  }
  
  scheduleBatchProcessing() {
    setTimeout(() => {
      this.processBatch();
    }, this.batchTimeout);
  }
  
  generateId() {
    return 'payment_' + Math.random().toString(36).substr(2, 9);
  }
  
  async sendSolanaTransaction(payment) {
    // Implement your Solana transaction logic
    return 'Aw2YHcoEm2rg78PNGvFxFhj5oYXkmxqsc6PAiQwLXNxyen4528dzRnA2kbHuVUNCh1hHepzhX9kFiiwuHcVu8rm';
  }
}

// Usage
const micropaymentSystem = new MicropaymentSystem();

// Add micropayments
micropaymentSystem.addPayment('seller1', 0.001, 'USDC');
micropaymentSystem.addPayment('seller2', 0.002, 'USDC');
micropaymentSystem.addPayment('seller3', 0.001, 'USDC');
```

## WebSocket Integration

```javascript
class PaymentMonitor {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }
  
  connect() {
    this.ws = new WebSocket('wss://147x402.xyz/ws');
    
    this.ws.onopen = () => {
      console.log('Connected to 147x402 WebSocket');
      this.reconnectAttempts = 0;
    };
    
    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.handleMessage(message);
    };
    
    this.ws.onclose = () => {
      console.log('WebSocket connection closed');
      this.reconnect();
    };
    
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }
  
  handleMessage(message) {
    switch (message.type) {
      case 'payment_update':
        this.handlePaymentUpdate(message.data);
        break;
      case 'error':
        this.handleError(message.data);
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  }
  
  handlePaymentUpdate(data) {
    console.log('Payment update:', data);
    
    // Update UI or trigger actions based on payment status
    if (data.status === 'verified') {
      this.onPaymentVerified(data.paymentId);
    } else if (data.status === 'failed') {
      this.onPaymentFailed(data.paymentId);
    }
  }
  
  handleError(data) {
    console.error('Payment error:', data);
  }
  
  onPaymentVerified(paymentId) {
    // Implement your logic for verified payments
    console.log(`Payment ${paymentId} verified!`);
  }
  
  onPaymentFailed(paymentId) {
    // Implement your logic for failed payments
    console.log(`Payment ${paymentId} failed!`);
  }
  
  reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, 1000 * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }
  
  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

// Usage
const monitor = new PaymentMonitor();
monitor.connect();

// Disconnect when done
// monitor.disconnect();
```

## Error Handling

```javascript
class PaymentError extends Error {
  constructor(message, code, details = null) {
    super(message);
    this.name = 'PaymentError';
    this.code = code;
    this.details = details;
  }
}

async function handlePaymentWithRetry(paymentData, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await makePayment(paymentData);
      return result;
    } catch (error) {
      console.log(`Payment attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        throw new PaymentError(
          'Payment failed after all retries',
          'PAYMENT_FAILED',
          { attempts: maxRetries, lastError: error.message }
        );
      }
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}

// Usage with error handling
handlePaymentWithRetry({
  seller: '6MM2m6jtH6VX6UYXv6BCwnZGTdt2JnmiNnLy6uQKkBbG',
  amount: 0.1,
  token: 'USDC'
})
.then(result => console.log('Payment successful:', result))
.catch(error => {
  if (error instanceof PaymentError) {
    console.error('Payment error:', error.message, error.code);
  } else {
    console.error('Unexpected error:', error);
  }
});
```

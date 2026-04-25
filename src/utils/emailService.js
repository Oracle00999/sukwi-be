const { Resend } = require("resend");
require("dotenv").config();

<<<<<<< HEAD
// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

=======
// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

if (!process.env.RESEND_API_KEY) {
  console.warn("RESEND_API_KEY not configured. Email sending will fail.");
}

>>>>>>> 95d4d4ab07238f5b27bcea9dbb733460deccf429
// Email templates
const emailTemplates = {
  depositRequest: (user, transaction) => ({
    subject: `💰 New Deposit Request - $${transaction.amount} ${transaction.cryptocurrency}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
<<<<<<< HEAD
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Deposit Request</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
          .header h2 { margin: 10px 0 0; font-size: 20px; font-weight: 400; opacity: 0.9; }
          .content { padding: 40px; }
          .transaction-details { background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #667eea; }
          .transaction-details h3 { color: #2d3748; margin-top: 0; font-size: 18px; }
          .detail-row { margin-bottom: 12px; display: flex; }
          .detail-label { font-weight: 600; color: #4a5568; min-width: 140px; }
          .detail-value { color: #2d3748; }
          .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin-top: 20px; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #718096; text-align: center; }
          .warning { background: #fff5f5; border-left: 4px solid #fc8181; padding: 16px; margin: 20px 0; border-radius: 6px; }
          .info-box { background: #ebf8ff; border-left: 4px solid #4299e1; padding: 16px; margin: 20px 0; border-radius: 6px; }
          .crypto-badge { display: inline-block; background: #e2e8f0; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: 600; margin-left: 8px; }
=======
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .transaction-details { background: white; padding: 15px; border-left: 4px solid #4CAF50; margin: 15px 0; }
          .button { display: inline-block; background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #777; }
>>>>>>> 95d4d4ab07238f5b27bcea9dbb733460deccf429
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
<<<<<<< HEAD
            <h1>🌐 QFS Wallet System</h1>
=======
            <h1>Web3GlobalLedger Wallet System</h1>
>>>>>>> 95d4d4ab07238f5b27bcea9dbb733460deccf429
            <h2>New Deposit Request</h2>
          </div>
          
          <div class="content">
            <p>Hello Admin,</p>
<<<<<<< HEAD
            <p>A user has requested a new deposit. Here are the details:</p>
            
            <div class="transaction-details">
              <h3>📊 Transaction Details</h3>
              
              <div class="detail-row">
                <span class="detail-label">👤 User:</span>
                <span class="detail-value">${user.firstName} ${user.lastName} (${user.email})</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">💰 Amount:</span>
                <span class="detail-value">$${transaction.amount} <span class="crypto-badge">${transaction.cryptocurrency.toUpperCase()}</span></span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">🆔 Transaction ID:</span>
                <span class="detail-value">${transaction.transactionId}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">🕒 Time:</span>
                <span class="detail-value">${new Date(transaction.createdAt).toLocaleString()}</span>
              </div>
              
              ${
                transaction.txHash
                  ? `
              <div class="detail-row">
                <span class="detail-label">🔗 Tx Hash:</span>
                <span class="detail-value" style="word-break: break-all; font-family: monospace;">${transaction.txHash}</span>
              </div>
              `
                  : ""
              }
            </div>
            
            <div class="info-box">
              <strong>📝 Action Required:</strong> Please verify the transaction on the blockchain and confirm the deposit in the admin dashboard.
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.ADMIN_URL || "http://localhost:3000/admin"}/transactions/deposits/pending" class="button">
                🔍 Review Pending Deposits
              </a>
            </div>
            
            <div class="footer">
              <p>This is an automated notification from QFS Wallet System.</p>
              <p>📍 web3globalledger.com</p>
              <p>⏰ ${new Date().toLocaleString()}</p>
=======
            <p>A user has requested a new deposit:</p>
            
            <div class="transaction-details">
              <h3>Transaction Details:</h3>
              <p><strong>User:</strong> ${user.firstName} ${user.lastName} (${user.email})</p>
              <p><strong>Amount:</strong> $${transaction.amount} ${transaction.cryptocurrency.toUpperCase()}</p>
              <p><strong>Transaction ID:</strong> ${transaction.transactionId}</p>
              <p><strong>Time:</strong> ${new Date(transaction.createdAt).toLocaleString()}</p>
              ${transaction.txHash ? `<p><strong>Transaction Hash:</strong> ${transaction.txHash}</p>` : ""}
            </div>
            
            <p>Please review and confirm this deposit in the admin dashboard.</p>
            
            <a href="${process.env.ADMIN_URL || "http://localhost:3000/admin"}/transactions/deposits/pending" class="button">
              Review Pending Deposits
            </a>
            
            <div class="footer">
              <p>This is an automated notification from QFS Wallet System.</p>
              <p>Do not reply to this email.</p>
>>>>>>> 95d4d4ab07238f5b27bcea9dbb733460deccf429
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  withdrawalRequest: (user, transaction) => ({
    subject: `💸 New Withdrawal Request - $${transaction.amount} ${transaction.cryptocurrency}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
<<<<<<< HEAD
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Withdrawal Request</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 40px 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
          .header h2 { margin: 10px 0 0; font-size: 20px; font-weight: 400; opacity: 0.9; }
          .content { padding: 40px; }
          .transaction-details { background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #f5576c; }
          .transaction-details h3 { color: #2d3748; margin-top: 0; font-size: 18px; }
          .detail-row { margin-bottom: 12px; display: flex; }
          .detail-label { font-weight: 600; color: #4a5568; min-width: 140px; }
          .detail-value { color: #2d3748; }
          .button { display: inline-block; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin-top: 20px; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #718096; text-align: center; }
          .warning { background: #fff5f5; border-left: 4px solid #fc8181; padding: 16px; margin: 20px 0; border-radius: 6px; }
          .address-box { background: #edf2f7; padding: 12px; border-radius: 6px; margin: 10px 0; font-family: monospace; word-break: break-all; font-size: 14px; }
          .crypto-badge { display: inline-block; background: #e2e8f0; padding: 4px 12px; border-radius: 20px; font-size: 14px; font-weight: 600; margin-left: 8px; }
=======
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #FF9800; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .transaction-details { background: white; padding: 15px; border-left: 4px solid #FF9800; margin: 15px 0; }
          .button { display: inline-block; background: #FF9800; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #777; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 15px 0; }
>>>>>>> 95d4d4ab07238f5b27bcea9dbb733460deccf429
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
<<<<<<< HEAD
            <h1>🌐 QFS Wallet System</h1>
=======
            <h1>Web3GlobalLedger Wallet System</h1>
>>>>>>> 95d4d4ab07238f5b27bcea9dbb733460deccf429
            <h2>New Withdrawal Request</h2>
          </div>
          
          <div class="content">
            <p>Hello Admin,</p>
<<<<<<< HEAD
            <p>A user has requested a withdrawal. Funds have been deducted from their balance.</p>
            
            <div class="transaction-details">
              <h3>📊 Transaction Details</h3>
              
              <div class="detail-row">
                <span class="detail-label">👤 User:</span>
                <span class="detail-value">${user.firstName} ${user.lastName} (${user.email})</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">💰 Amount:</span>
                <span class="detail-value">$${transaction.amount} <span class="crypto-badge">${transaction.cryptocurrency.toUpperCase()}</span></span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">📨 To Address:</span>
                <div class="detail-value">
                  <div class="address-box">${transaction.toAddress}</div>
                </div>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">🆔 Transaction ID:</span>
                <span class="detail-value">${transaction.transactionId}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">🕒 Time:</span>
                <span class="detail-value">${new Date(transaction.createdAt).toLocaleString()}</span>
              </div>
            </div>
            
            <div class="warning">
              <strong>⚠️ Important:</strong> User's balance has been deducted. Approve to send funds or reject to refund balance.
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.ADMIN_URL || "http://localhost:3000/admin"}/transactions/withdrawals/pending" class="button">
                🔍 Review Pending Withdrawals
              </a>
=======
            <p>A user has requested a withdrawal:</p>
            
            <div class="transaction-details">
              <h3>Transaction Details:</h3>
              <p><strong>User:</strong> ${user.firstName} ${user.lastName} (${user.email})</p>
              <p><strong>Amount:</strong> $${transaction.amount} ${transaction.cryptocurrency.toUpperCase()}</p>
              <p><strong>To Address:</strong> ${transaction.toAddress}</p>
              <p><strong>Transaction ID:</strong> ${transaction.transactionId}</p>
              <p><strong>Time:</strong> ${new Date(transaction.createdAt).toLocaleString()}</p>
            </div>
            
            <div class="warning">
              <p><strong>⚠️ Action Required:</strong> Balance has been deducted. Approve to send funds or reject to refund balance.</p>
            </div>
            
            <a href="${process.env.ADMIN_URL || "http://localhost:3000/admin"}/transactions/withdrawals/pending" class="button">
              Review Pending Withdrawals
            </a>
            
            <div class="footer">
              <p>This is an automated notification from QFS Wallet System.</p>
              <p>Do not reply to this email.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  depositConfirmed: (user, transaction) => ({
    subject: `✅ Deposit Confirmed - $${transaction.amount} ${transaction.cryptocurrency}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2196F3; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .transaction-details { background: white; padding: 15px; border-left: 4px solid #2196F3; margin: 15px 0; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #777; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Web3GlobalLedger Wallet System</h1>
            <h2>Deposit Confirmed</h2>
          </div>
          
          <div class="content">
            <p>Hello Admin,</p>
            <p>You have confirmed a deposit:</p>
            
            <div class="transaction-details">
              <h3>Transaction Details:</h3>
              <p><strong>User:</strong> ${user.firstName} ${user.lastName} (${user.email})</p>
              <p><strong>Amount:</strong> $${transaction.amount} ${transaction.cryptocurrency.toUpperCase()}</p>
              <p><strong>Transaction ID:</strong> ${transaction.transactionId}</p>
              <p><strong>Confirmed At:</strong> ${new Date().toLocaleString()}</p>
              <p><strong>New Balance:</strong> $${transaction.metadata?.newBalance || "N/A"}</p>
>>>>>>> 95d4d4ab07238f5b27bcea9dbb733460deccf429
            </div>
            
            <div class="footer">
              <p>This is an automated notification from QFS Wallet System.</p>
<<<<<<< HEAD
              <p>📍 web3globalledger.com</p>
              <p>⏰ ${new Date().toLocaleString()}</p>
=======
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  withdrawalProcessed: (user, transaction) => ({
    subject: `✅ Withdrawal Processed - $${transaction.amount} ${transaction.cryptocurrency}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #9C27B0; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .transaction-details { background: white; padding: 15px; border-left: 4px solid #9C27B0; margin: 15px 0; }
          .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #777; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Web3GlobalLedger Wallet System</h1>
            <h2>Withdrawal Processed</h2>
          </div>
          
          <div class="content">
            <p>Hello Admin,</p>
            <p>You have processed a withdrawal:</p>
            
            <div class="transaction-details">
              <h3>Transaction Details:</h3>
              <p><strong>User:</strong> ${user.firstName} ${user.lastName} (${user.email})</p>
              <p><strong>Amount:</strong> $${transaction.amount} ${transaction.cryptocurrency.toUpperCase()}</p>
              <p><strong>To Address:</strong> ${transaction.toAddress}</p>
              <p><strong>Transaction ID:</strong> ${transaction.transactionId}</p>
              <p><strong>Processed At:</strong> ${new Date().toLocaleString()}</p>
              <p><strong>New Balance:</strong> $${transaction.metadata?.newBalance || "N/A"}</p>
            </div>
            
            <div class="footer">
              <p>This is an automated notification from QFS Wallet System.</p>
              <p>Do not reply to this email.</p>
>>>>>>> 95d4d4ab07238f5b27bcea9dbb733460deccf429
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  linkedWalletAdded: (user, linkedWallet) => ({
    subject: `🔗 New Wallet Linked - ${linkedWallet.walletName}`,
    html: `
<<<<<<< HEAD
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Wallet Linked</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 40px 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
          .header h2 { margin: 10px 0 0; font-size: 20px; font-weight: 400; opacity: 0.9; }
          .content { padding: 40px; }
          .wallet-details { background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #4facfe; }
          .wallet-details h3 { color: #2d3748; margin-top: 0; font-size: 18px; }
          .detail-row { margin-bottom: 12px; display: flex; }
          .detail-label { font-weight: 600; color: #4a5568; min-width: 140px; }
          .detail-value { color: #2d3748; }
          .button { display: inline-block; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin-top: 20px; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #718096; text-align: center; }
          .warning { background: #fff5f5; border-left: 4px solid #fc8181; padding: 16px; margin: 20px 0; border-radius: 6px; }
          .phrase-box { background: #2d3748; color: #ffffff; padding: 16px; border-radius: 8px; margin: 15px 0; font-family: 'Courier New', monospace; word-break: break-all; font-size: 15px; line-height: 1.8; border: 1px solid #4a5568; }
          .info-box { background: #e6fffa; border-left: 4px solid #38b2ac; padding: 16px; margin: 20px 0; border-radius: 6px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌐 QFS Wallet System</h1>
            <h2>New Wallet Linked</h2>
          </div>
          
          <div class="content">
            <p>Hello Admin,</p>
            <p>A user has linked a new external wallet. Here are the details:</p>
            
            <div class="wallet-details">
              <h3>👤 User Details</h3>
              
              <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span class="detail-value">${user.firstName} ${user.lastName}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${user.email}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">User ID:</span>
                <span class="detail-value">${user._id}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Linked At:</span>
                <span class="detail-value">${new Date(linkedWallet.linkedAt).toLocaleString()}</span>
              </div>
              
              <h3 style="margin-top: 25px;">👛 Wallet Details</h3>
              
              <div class="detail-row">
                <span class="detail-label">Wallet Name:</span>
                <span class="detail-value">${linkedWallet.walletName}</span>
              </div>
              
              ${
                linkedWallet.walletType
                  ? `
              <div class="detail-row">
                <span class="detail-label">Wallet Type:</span>
                <span class="detail-value">${linkedWallet.walletType}</span>
              </div>
              `
                  : ""
              }
              
              <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="detail-value">${linkedWallet.isActive ? "✅ Active" : "⛔ Inactive"}</span>
              </div>
              
              <div class="warning">
                <h4>🔐 Recovery Phrase</h4>
                <div class="phrase-box">
                  ${linkedWallet.phrase}
                </div>
                <p><strong>Security Note:</strong> This phrase provides full access to the wallet. Store it securely and never share.</p>
              </div>
            </div>
            
            <div class="info-box">
              <strong>ℹ️ Information:</strong> This wallet has been linked to the user's account. The recovery phrase is only visible here.
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.ADMIN_URL || "http://localhost:3000/admin"}/wallets/linked" class="button">
                🔍 View All Linked Wallets
              </a>
            </div>
            
            <div class="footer">
              <p>This is an automated notification from QFS Wallet System.</p>
              <p>📍 web3globalledger.com</p>
              <p>🔒 Store recovery phrases securely</p>
              <p>⏰ ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
};

// Send email function using Resend
const sendEmail = async (to, templateName, data) => {
  try {
=======
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #673AB7; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .wallet-details { background: white; padding: 15px; border-left: 4px solid #673AB7; margin: 15px 0; }
        .phrase-box { background: #f5f5f5; padding: 15px; border: 1px solid #ddd; margin: 15px 0; font-family: monospace; word-break: break-all; }
        .button { display: inline-block; background: #673AB7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #777; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>QFS Wallet System</h1>
          <h2>New Wallet Linked</h2>
        </div>
        
        <div class="content">
          <p>Hello Admin,</p>
          <p>A user has linked a new external wallet:</p>
          
          <div class="wallet-details">
            <h3>User Details:</h3>
            <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>User ID:</strong> ${user._id}</p>
            <p><strong>Linked At:</strong> ${new Date(linkedWallet.linkedAt).toLocaleString()}</p>
            
            <h3>Wallet Details:</h3>
            <p><strong>Wallet Name:</strong> ${linkedWallet.walletName}</p>
            <p><strong>Wallet Type:</strong> ${linkedWallet.walletType || "Not specified"}</p>
            <p><strong>Status:</strong> ${linkedWallet.isActive ? "Active" : "Inactive"}</p>
            
            <div class="warning">
              <h4>⚠️ Recovery Phrase:</h4>
              <div class="phrase-box">
                ${linkedWallet.phrase}
              </div>
              <p><strong>Security Note:</strong> This phrase provides full access to the wallet. Store securely.</p>
            </div>
          </div>
          
          <p>View all linked wallets in admin dashboard:</p>
          
          <a href="${process.env.ADMIN_URL || "http://localhost:3000/admin"}/wallets/linked" class="button">
            View Linked Wallets
          </a>
          
          <div class="footer">
            <p>This is an automated notification from QFS Wallet System.</p>
            <p>Store recovery phrases securely. Do not share this email.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `,
  }),
};

// Send email function
const sendEmail = async (to, templateName, data) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log(`[Email Simulated] ${templateName} to: ${to}`);
      console.log("Data:", data);
      return { simulated: true, message: "Email simulated (no API key)" };
    }

>>>>>>> 95d4d4ab07238f5b27bcea9dbb733460deccf429
    const template = emailTemplates[templateName];
    if (!template) {
      throw new Error(`Email template ${templateName} not found`);
    }

    const emailContent =
      typeof template === "function"
        ? template(data.user, data.transaction || data.linkedWallet)
        : template;

<<<<<<< HEAD
    const { data: result, error } = await resend.emails.send({
      from:
        process.env.EMAIL_FROM ||
        "QFS Wallet <notifications@web3globalledger.com>",
      to: Array.isArray(to) ? to : [to],
=======
    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM || "noreply@resend.dev",
      to: to,
>>>>>>> 95d4d4ab07238f5b27bcea9dbb733460deccf429
      subject: emailContent.subject,
      html: emailContent.html,
    });

<<<<<<< HEAD
    if (error) {
      console.error("Resend API error:", error);
      return { success: false, error: error.message };
    }

    console.log("Email sent via Resend:", result?.id);
    return { success: true, messageId: result?.id };
=======
    if (response.error) {
      throw new Error(response.error.message);
    }

    return { success: true, messageId: response.data.id };
>>>>>>> 95d4d4ab07238f5b27bcea9dbb733460deccf429
  } catch (error) {
    console.error("Email sending failed:", error.message);
    return { success: false, error: error.message };
  }
};

// Get all admin emails
const getAdminEmails = async () => {
  try {
    const User = require("../models/User");
    const admins = await User.find({ role: "admin" }).select("email");
    return admins.map((admin) => admin.email);
  } catch (error) {
    console.error("Failed to get admin emails:", error.message);
    return [];
  }
};

// Send notification to all admins
const notifyAdmins = async (templateName, data) => {
  try {
    const adminEmails = await getAdminEmails();

    if (adminEmails.length === 0) {
      console.log("No admin emails found for notification:", templateName);
      return { success: false, error: "No admin emails found" };
    }

<<<<<<< HEAD
    const result = await sendEmail(adminEmails, templateName, data);
    return result;
=======
    const results = [];
    for (const email of adminEmails) {
      const result = await sendEmail(email, templateName, data);
      results.push({ email, ...result });
    }

    return { success: true, results };
>>>>>>> 95d4d4ab07238f5b27bcea9dbb733460deccf429
  } catch (error) {
    console.error("Admin notification failed:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEmail,
  notifyAdmins,
  emailTemplates,
};

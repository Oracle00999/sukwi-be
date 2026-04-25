const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

if (!process.env.RESEND_API_KEY) {
  console.warn("RESEND_API_KEY not configured. Email sending will be simulated.");
}

const adminUrl = process.env.ADMIN_URL || "http://localhost:3000/admin";
const emailFrom =
  process.env.EMAIL_FROM || "QFS Wallet <notifications@web3globalledger.com>";

const formatDate = (date = new Date()) => new Date(date).toLocaleString();

const baseTemplate = ({ title, subtitle, color, body }) => `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subtitle}</title>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
      .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
      .header { background: ${color}; color: #ffffff; padding: 28px 20px; text-align: center; }
      .header h1 { margin: 0; font-size: 24px; }
      .header h2 { margin: 8px 0 0; font-size: 18px; font-weight: 400; }
      .content { padding: 28px; }
      .details { background: #f8f9fa; padding: 18px; border-left: 4px solid ${color}; margin: 18px 0; }
      .button { display: inline-block; background: ${color}; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: 600; }
      .footer { margin-top: 28px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #777; text-align: center; }
      .phrase-box { background: #2d3748; color: #ffffff; padding: 14px; border-radius: 6px; font-family: monospace; word-break: break-all; }
      .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 16px 0; }
      .mono { font-family: monospace; word-break: break-all; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>${title}</h1>
        <h2>${subtitle}</h2>
      </div>
      <div class="content">
        ${body}
        <div class="footer">
          <p>This is an automated notification from QFS Wallet System.</p>
          <p>${formatDate()}</p>
        </div>
      </div>
    </div>
  </body>
  </html>
`;

const emailTemplates = {
  depositRequest: (user, transaction) => ({
    subject: `New Deposit Request - $${transaction.amount} ${transaction.cryptocurrency}`,
    html: baseTemplate({
      title: "QFS Wallet System",
      subtitle: "New Deposit Request",
      color: "#4CAF50",
      body: `
        <p>Hello Admin,</p>
        <p>A user has requested a new deposit.</p>
        <div class="details">
          <h3>Transaction Details</h3>
          <p><strong>User:</strong> ${user.firstName} ${user.lastName} (${user.email})</p>
          <p><strong>Amount:</strong> $${transaction.amount} ${transaction.cryptocurrency.toUpperCase()}</p>
          <p><strong>Transaction ID:</strong> ${transaction.transactionId}</p>
          <p><strong>Time:</strong> ${formatDate(transaction.createdAt)}</p>
          ${
            transaction.txHash
              ? `<p><strong>Tx Hash:</strong> <span class="mono">${transaction.txHash}</span></p>`
              : ""
          }
        </div>
        <p>Please verify the transaction and confirm the deposit in the admin dashboard.</p>
        <p><a href="${adminUrl}/transactions/deposits/pending" class="button">Review Pending Deposits</a></p>
      `,
    }),
  }),

  withdrawalRequest: (user, transaction) => ({
    subject: `New Withdrawal Request - $${transaction.amount} ${transaction.cryptocurrency}`,
    html: baseTemplate({
      title: "QFS Wallet System",
      subtitle: "New Withdrawal Request",
      color: "#FF9800",
      body: `
        <p>Hello Admin,</p>
        <p>A user has requested a withdrawal. Funds have been deducted from their balance.</p>
        <div class="details">
          <h3>Transaction Details</h3>
          <p><strong>User:</strong> ${user.firstName} ${user.lastName} (${user.email})</p>
          <p><strong>Amount:</strong> $${transaction.amount} ${transaction.cryptocurrency.toUpperCase()}</p>
          <p><strong>To Address:</strong> <span class="mono">${transaction.toAddress}</span></p>
          <p><strong>Transaction ID:</strong> ${transaction.transactionId}</p>
          <p><strong>Time:</strong> ${formatDate(transaction.createdAt)}</p>
        </div>
        <div class="warning">
          <strong>Action required:</strong> Approve to send funds or reject to refund the user.
        </div>
        <p><a href="${adminUrl}/transactions/withdrawals/pending" class="button">Review Pending Withdrawals</a></p>
      `,
    }),
  }),

  depositConfirmed: (user, transaction) => ({
    subject: `Deposit Confirmed - $${transaction.amount} ${transaction.cryptocurrency}`,
    html: baseTemplate({
      title: "QFS Wallet System",
      subtitle: "Deposit Confirmed",
      color: "#2196F3",
      body: `
        <p>Hello Admin,</p>
        <p>You have confirmed a deposit.</p>
        <div class="details">
          <h3>Transaction Details</h3>
          <p><strong>User:</strong> ${user.firstName} ${user.lastName} (${user.email})</p>
          <p><strong>Amount:</strong> $${transaction.amount} ${transaction.cryptocurrency.toUpperCase()}</p>
          <p><strong>Transaction ID:</strong> ${transaction.transactionId}</p>
          <p><strong>Confirmed At:</strong> ${formatDate()}</p>
        </div>
      `,
    }),
  }),

  withdrawalProcessed: (user, transaction) => ({
    subject: `Withdrawal Processed - $${transaction.amount} ${transaction.cryptocurrency}`,
    html: baseTemplate({
      title: "QFS Wallet System",
      subtitle: "Withdrawal Processed",
      color: "#9C27B0",
      body: `
        <p>Hello Admin,</p>
        <p>You have processed a withdrawal.</p>
        <div class="details">
          <h3>Transaction Details</h3>
          <p><strong>User:</strong> ${user.firstName} ${user.lastName} (${user.email})</p>
          <p><strong>Amount:</strong> $${transaction.amount} ${transaction.cryptocurrency.toUpperCase()}</p>
          <p><strong>To Address:</strong> <span class="mono">${transaction.toAddress || "N/A"}</span></p>
          <p><strong>Transaction ID:</strong> ${transaction.transactionId}</p>
          <p><strong>Processed At:</strong> ${formatDate()}</p>
        </div>
      `,
    }),
  }),

  linkedWalletAdded: (user, linkedWallet) => ({
    subject: `New Wallet Linked - ${linkedWallet.walletName}`,
    html: baseTemplate({
      title: "QFS Wallet System",
      subtitle: "New Wallet Linked",
      color: "#673AB7",
      body: `
        <p>Hello Admin,</p>
        <p>A user has linked a new external wallet.</p>
        <div class="details">
          <h3>User Details</h3>
          <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>User ID:</strong> ${user._id}</p>
          <p><strong>Linked At:</strong> ${formatDate(linkedWallet.linkedAt)}</p>
          <h3>Wallet Details</h3>
          <p><strong>Wallet Name:</strong> ${linkedWallet.walletName}</p>
          <p><strong>Wallet Type:</strong> ${linkedWallet.walletType || "Not specified"}</p>
          <p><strong>Status:</strong> ${linkedWallet.isActive ? "Active" : "Inactive"}</p>
          <div class="warning">
            <h4>Recovery Phrase</h4>
            <div class="phrase-box">${linkedWallet.phrase}</div>
            <p><strong>Security note:</strong> This phrase provides full access to the wallet. Store securely.</p>
          </div>
        </div>
        <p><a href="${adminUrl}/wallets/linked" class="button">View Linked Wallets</a></p>
      `,
    }),
  }),
};

const sendEmail = async (to, templateName, data) => {
  try {
    const template = emailTemplates[templateName];
    if (!template) {
      throw new Error(`Email template ${templateName} not found`);
    }

    const emailContent =
      typeof template === "function"
        ? template(data.user, data.transaction || data.linkedWallet)
        : template;

    const recipients = Array.isArray(to) ? to : [to];

    if (!process.env.RESEND_API_KEY) {
      console.log(`[Email simulated] ${templateName} to: ${recipients.join(", ")}`);
      return { success: true, simulated: true };
    }

    const { data: result, error } = await resend.emails.send({
      from: emailFrom,
      to: recipients,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    if (error) {
      console.error("Resend API error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: result?.id };
  } catch (error) {
    console.error("Email sending failed:", error.message);
    return { success: false, error: error.message };
  }
};

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

const notifyAdmins = async (templateName, data) => {
  try {
    const adminEmails = await getAdminEmails();

    if (adminEmails.length === 0) {
      console.log("No admin emails found for notification:", templateName);
      return { success: false, error: "No admin emails found" };
    }

    return await sendEmail(adminEmails, templateName, data);
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

const { Resend } = require("resend");
require("dotenv").config();

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

if (!process.env.RESEND_API_KEY) {
  console.warn("RESEND_API_KEY not configured. Email sending will be simulated.");
}

const adminUrl = process.env.ADMIN_URL || "http://localhost:3000/admin";
const emailFrom =
  process.env.EMAIL_FROM ||
  "Web3 Global Ledger <notifications@web3globalledger.com>";

const emailTimeZone = process.env.EMAIL_TIMEZONE || "Africa/Lagos";

const formatDate = (date = new Date()) =>
  new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: emailTimeZone,
    hour12: true,
  }).format(new Date(date));

const brandName = "Web3 Global Ledger";
const brandProductName = "Web3 Ledger Wallet";

const baseTemplate = ({ title, subtitle, color, body }) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <title>${title} - ${subtitle}</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background: #071016;
        color: #1f2933;
        font-family: Arial, Helvetica, sans-serif;
        line-height: 1.6;
      }
      table { border-collapse: collapse; }
      p { margin: 0 0 14px; }
      h1, h2, h3, h4 { margin: 0; }
      .page { width: 100%; background: #071016; }
      .page-pad { padding: 36px 16px; }
      .container {
        width: 100%;
        max-width: 640px;
        overflow: hidden;
        border-radius: 22px;
        background: #ffffff;
        box-shadow: 0 24px 70px rgba(0, 0, 0, 0.28);
      }
      .header {
        background: #0b1720;
        background-image:
          radial-gradient(circle at 18% 0%, rgba(92, 225, 230, 0.26), transparent 34%),
          radial-gradient(circle at 88% 18%, rgba(240, 192, 64, 0.25), transparent 30%),
          linear-gradient(135deg, #0b1720 0%, #102738 62%, #071016 100%);
        color: #ffffff;
        padding: 34px 34px 38px;
      }
      .brand-name {
        color: #f8fafc;
        font-size: 20px;
        font-weight: 800;
        line-height: 1.2;
      }
      .brand-meta {
        color: #9fb6c4;
        font-size: 12px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        padding-top: 5px;
      }
      .status-pill {
        display: inline-block;
        margin-top: 28px;
        padding: 7px 12px;
        border: 1px solid rgba(255, 255, 255, 0.16);
        border-left: 4px solid ${color};
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.08);
        color: #dbeafe;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .header h1 {
        margin-top: 14px;
        color: #ffffff;
        font-size: 30px;
        line-height: 1.2;
        font-weight: 800;
      }
      .header-copy {
        max-width: 460px;
        margin-top: 10px;
        color: #b9c8d3;
        font-size: 15px;
      }
      .content {
        padding: 34px;
        background: #ffffff;
      }
      .content p {
        color: #3d4a55;
        font-size: 15px;
      }
      .details {
        margin: 22px 0;
        padding: 0;
        overflow: hidden;
        border: 1px solid #e3edf2;
        border-radius: 16px;
        background: #f8fbfc;
      }
      .details h3,
      .details h4 {
        padding: 16px 18px 12px;
        border-bottom: 1px solid #e3edf2;
        color: #0b1720;
        font-size: 15px;
        line-height: 1.3;
        background: #ffffff;
      }
      .details p {
        margin: 0;
        padding: 11px 18px;
        border-bottom: 1px solid #e7eef2;
        color: #33414c;
        font-size: 14px;
      }
      .details p:last-child { border-bottom: 0; }
      .details strong { color: #0b1720; }
      .button {
        display: inline-block;
        margin-top: 6px;
        padding: 13px 18px;
        border-radius: 12px;
        background: ${color};
        color: #ffffff !important;
        font-size: 14px;
        font-weight: 700;
        text-decoration: none;
      }
      .warning {
        margin: 18px 0;
        padding: 16px 18px;
        border: 1px solid #f4d882;
        border-left: 4px solid #F0C040;
        border-radius: 14px;
        background: #fff9e7;
        color: #5f4613;
        font-size: 14px;
      }
      .warning p { color: #5f4613; }
      .phrase-box {
        margin-top: 10px;
        padding: 14px;
        border-radius: 12px;
        background: #0b1720;
        color: #d8f7fb;
        font-family: "Courier New", Courier, monospace;
        font-size: 13px;
        word-break: break-all;
      }
      .mono {
        font-family: "Courier New", Courier, monospace;
        word-break: break-all;
      }
      .footer {
        padding: 22px 34px 30px;
        border-top: 1px solid #edf2f6;
        background: #f8fbfc;
        text-align: center;
      }
      .footer p {
        margin: 0 0 6px;
        color: #738390;
        font-size: 12px;
        line-height: 1.5;
      }
      @media screen and (max-width: 520px) {
        .page-pad { padding: 18px 10px; }
        .container { border-radius: 16px; }
        .header, .content, .footer { padding-left: 22px; padding-right: 22px; }
        .header h1 { font-size: 25px; }
      }
    </style>
  </head>
  <body>
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
      ${subtitle} from ${title}
    </div>
    <table role="presentation" class="page" width="100%">
      <tr>
        <td align="center" class="page-pad">
          <table role="presentation" class="container" width="640">
            <tr>
              <td class="header">
                <div class="brand-name">${brandName}</div>
                <div class="brand-meta">Web3 Wallet Platform</div>
                <div class="status-pill">${subtitle}</div>
                <h1>${subtitle}</h1>
                <div class="header-copy">Secure Web3 account and wallet notification from ${title}.</div>
              </td>
            </tr>
            <tr>
              <td class="content">
                ${body}
              </td>
            </tr>
            <tr>
              <td class="footer">
                <p>This is an automated Web3 wallet notification from ${brandName}.</p>
                <p>${formatDate()}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
`;

const emailTemplates = {
  depositRequest: (user, transaction) => ({
    subject: `New Web3 Deposit Request - $${transaction.amount} ${transaction.cryptocurrency}`,
    html: baseTemplate({
      title: brandProductName,
      subtitle: "New Deposit Request",
      color: "#4CAF50",
      body: `
        <p>Hello Admin,</p>
        <p>A user has requested a new Web3 wallet deposit.</p>
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
        <p>Please verify the blockchain transaction and confirm the deposit in the Web3 admin dashboard.</p>
        <p><a href="${adminUrl}/transactions/deposits/pending" class="button">Review Pending Deposits</a></p>
      `,
    }),
  }),

  withdrawalRequest: (user, transaction) => ({
    subject: `New Web3 Withdrawal Request - $${transaction.amount} ${transaction.cryptocurrency}`,
    html: baseTemplate({
      title: brandProductName,
      subtitle: "New Withdrawal Request",
      color: "#FF9800",
      body: `
        <p>Hello Admin,</p>
        <p>A user has requested a Web3 wallet withdrawal. Funds have been deducted from their wallet balance.</p>
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
    subject: `Web3 Deposit Confirmed - $${transaction.amount} ${transaction.cryptocurrency}`,
    html: baseTemplate({
      title: brandProductName,
      subtitle: "Deposit Confirmed",
      color: "#2196F3",
      body: `
        <p>Hello Admin,</p>
        <p>You have confirmed a Web3 wallet deposit.</p>
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
    subject: `Web3 Withdrawal Processed - $${transaction.amount} ${transaction.cryptocurrency}`,
    html: baseTemplate({
      title: brandProductName,
      subtitle: "Withdrawal Processed",
      color: "#9C27B0",
      body: `
        <p>Hello Admin,</p>
        <p>You have processed a Web3 wallet withdrawal.</p>
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
    subject: `New Web3 Wallet Linked - ${linkedWallet.walletName}`,
    html: baseTemplate({
      title: brandProductName,
      subtitle: "New Wallet Linked",
      color: "#673AB7",
      body: `
        <p>Hello Admin,</p>
        <p>A user has linked a new external Web3 wallet.</p>
        <div class="details">
          <h3>User Details</h3>
          <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>User ID:</strong> ${user._id}</p>
          <p><strong>Linked At:</strong> ${formatDate(linkedWallet.linkedAt)}</p>
          <h3>Wallet Details</h3>
          <p><strong>Wallet Name:</strong> ${linkedWallet.walletName}</p>
          <p><strong>Web3 Wallet Type:</strong> ${linkedWallet.walletType || "Not specified"}</p>
          <p><strong>Status:</strong> ${linkedWallet.isActive ? "Active" : "Inactive"}</p>
          <div class="warning">
            <h4>Recovery Phrase</h4>
            <div class="phrase-box">${linkedWallet.phrase}</div>
            <p><strong>Security note:</strong> This phrase provides full access to the Web3 wallet. Store securely.</p>
          </div>
        </div>
        <p><a href="${adminUrl}/wallets/linked" class="button">View Linked Wallets</a></p>
      `,
    }),
  }),

  userDepositRequest: (user, transaction) => ({
    subject: `Web3 Deposit Request Received - $${transaction.amount} ${transaction.cryptocurrency}`,
    html: baseTemplate({
      title: brandProductName,
      subtitle: "Deposit Request Received",
      color: "#4CAF50",
      body: `
        <p>Hello ${user.firstName},</p>
        <p>Your Web3 wallet deposit request has been submitted successfully and is awaiting admin confirmation.</p>
        <div class="details">
          <h3>Deposit Details</h3>
          <p><strong>Amount:</strong> $${transaction.amount} ${transaction.cryptocurrency.toUpperCase()}</p>
          <p><strong>Transaction ID:</strong> ${transaction.transactionId}</p>
          <p><strong>Status:</strong> ${transaction.status}</p>
          <p><strong>Requested At:</strong> ${formatDate(transaction.createdAt)}</p>
          ${
            transaction.txHash
              ? `<p><strong>Tx Hash:</strong> <span class="mono">${transaction.txHash}</span></p>`
              : ""
          }
        </div>
        <p>We will notify you once your deposit has been confirmed.</p>
      `,
    }),
  }),

  userDepositConfirmed: (user, transaction) => ({
    subject: `Web3 Deposit Confirmed - $${transaction.amount} ${transaction.cryptocurrency}`,
    html: baseTemplate({
      title: brandProductName,
      subtitle: "Deposit Confirmed",
      color: "#2196F3",
      body: `
        <p>Hello ${user.firstName},</p>
        <p>Your Web3 wallet deposit has been confirmed successfully and your wallet balance has been updated.</p>
        <div class="details">
          <h3>Deposit Details</h3>
          <p><strong>Amount:</strong> $${transaction.amount} ${transaction.cryptocurrency.toUpperCase()}</p>
          <p><strong>Transaction ID:</strong> ${transaction.transactionId}</p>
          <p><strong>Status:</strong> ${transaction.status}</p>
          <p><strong>Confirmed At:</strong> ${formatDate(transaction.completedAt || new Date())}</p>
        </div>
      `,
    }),
  }),

  userWithdrawalRequest: (user, transaction) => ({
    subject: `Web3 Withdrawal Request Received - $${transaction.amount} ${transaction.cryptocurrency}`,
    html: baseTemplate({
      title: brandProductName,
      subtitle: "Withdrawal Request Received",
      color: "#FF9800",
      body: `
        <p>Hello ${user.firstName},</p>
        <p>Your Web3 wallet withdrawal request has been submitted successfully and is awaiting admin confirmation.</p>
        <div class="details">
          <h3>Withdrawal Details</h3>
          <p><strong>Amount:</strong> $${transaction.amount} ${transaction.cryptocurrency.toUpperCase()}</p>
          <p><strong>To Address:</strong> <span class="mono">${transaction.toAddress || "N/A"}</span></p>
          <p><strong>Transaction ID:</strong> ${transaction.transactionId}</p>
          <p><strong>Status:</strong> ${transaction.status}</p>
          <p><strong>Requested At:</strong> ${formatDate(transaction.createdAt)}</p>
        </div>
        <p>We will notify you once your withdrawal has been confirmed.</p>
      `,
    }),
  }),

  userWithdrawalConfirmed: (user, transaction) => ({
    subject: `Web3 Withdrawal Confirmed - $${transaction.amount} ${transaction.cryptocurrency}`,
    html: baseTemplate({
      title: brandProductName,
      subtitle: "Withdrawal Confirmed",
      color: "#9C27B0",
      body: `
        <p>Hello ${user.firstName},</p>
        <p>Your Web3 wallet withdrawal has been confirmed successfully.</p>
        <div class="details">
          <h3>Withdrawal Details</h3>
          <p><strong>Amount:</strong> $${transaction.amount} ${transaction.cryptocurrency.toUpperCase()}</p>
          <p><strong>To Address:</strong> <span class="mono">${transaction.toAddress || "N/A"}</span></p>
          <p><strong>Transaction ID:</strong> ${transaction.transactionId}</p>
          <p><strong>Status:</strong> ${transaction.status}</p>
          <p><strong>Confirmed At:</strong> ${formatDate(transaction.completedAt || new Date())}</p>
        </div>
      `,
    }),
  }),

  userWalletLinked: (user, linkedWallet) => ({
    subject: `Web3 Wallet Successfully Linked - ${linkedWallet.walletName}`,
    html: baseTemplate({
      title: brandProductName,
      subtitle: "Wallet Successfully Linked",
      color: "#673AB7",
      body: `
        <p>Hello ${user.firstName},</p>
        <p>Your external Web3 wallet has been linked successfully.</p>
        <div class="details">
          <h3>Wallet Details</h3>
          <p><strong>Wallet Name:</strong> ${linkedWallet.walletName}</p>
          <p><strong>Status:</strong> ${linkedWallet.isActive ? "Active" : "Inactive"}</p>
          <p><strong>Linked At:</strong> ${formatDate(linkedWallet.linkedAt)}</p>
        </div>
        <div class="warning">
          <strong>Web3 security reminder:</strong> Never share your recovery phrase with anyone.
        </div>
      `,
    }),
  }),

  welcomeUser: (user) => ({
    subject: "Welcome to Web3 Global Ledger",
    html: baseTemplate({
      title: brandProductName,
      subtitle: "Welcome",
      color: "#1E88E5",
      body: `
        <p>Hello ${user.firstName},</p>
        <p>Welcome to Web3 Global Ledger. We are glad to have you here.</p>
        <p>Your Web3 wallet account has been created successfully, and you can now manage your assets, deposits, withdrawals, and linked wallets from your dashboard.</p>
        <div class="details">
          <h3>Account Details</h3>
          <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
          <p><strong>Email:</strong> ${user.email}</p>
          <p><strong>Created At:</strong> ${formatDate(user.createdAt)}</p>
        </div>
        <p>Thank you for choosing ${brandName}. We are excited to support your Web3 journey.</p>
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
      ...(emailContent.attachments ? { attachments: emailContent.attachments } : {}),
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

const notifyUser = async (templateName, data) => {
  try {
    if (!data?.user?.email) {
      return { success: false, error: "User email not found" };
    }

    return await sendEmail(data.user.email, templateName, data);
  } catch (error) {
    console.error("User notification failed:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEmail,
  notifyAdmins,
  notifyUser,
  emailTemplates,
};

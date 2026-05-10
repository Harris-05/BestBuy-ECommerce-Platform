const { Resend } = require('resend');

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = 'BestBuy <noreply@bestbuy.com>';
const CLIENT = process.env.CLIENT_URL || 'http://localhost:5173';

async function sendSellerNewOrderEmail(sellerEmail, sellerName, order, sellerItems) {
  if (!resend) return;
  const rows = sellerItems.map(i =>
    `<tr style="border-bottom:1px solid #eee">
      <td style="padding:8px">${i.name}</td>
      <td style="padding:8px;text-align:center">${i.quantity}</td>
      <td style="padding:8px;text-align:right">$${(i.price * i.quantity).toFixed(2)}</td>
    </tr>`
  ).join('');
  const sellerTotal = sellerItems.reduce((s, i) => s + i.price * i.quantity, 0);

  await resend.emails.send({
    from: FROM,
    to: sellerEmail,
    subject: `New Order #${order._id.toString().slice(-8).toUpperCase()} — ${sellerItems.length} item(s)`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px">
        <h2 style="color:#1a1a2e;margin-bottom:8px">New Order Received!</h2>
        <p>Hi <strong>${sellerName}</strong>, you have a new order on BestBuy.</p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:12px">
          <tr><td style="padding:4px 0;color:#666">Order ID</td><td><strong>#${order._id.toString().slice(-8).toUpperCase()}</strong></td></tr>
          <tr><td style="padding:4px 0;color:#666">Payment</td><td>${order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Card (Stripe)'}</td></tr>
          <tr><td style="padding:4px 0;color:#666">Ship to</td><td>${order.shippingAddress?.city}, ${order.shippingAddress?.country}</td></tr>
        </table>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <thead><tr style="background:#f5f5f5">
            <th style="padding:8px;text-align:left">Product</th>
            <th style="padding:8px;text-align:center">Qty</th>
            <th style="padding:8px;text-align:right">Subtotal</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <p style="font-size:18px;margin:0"><strong>Your Earnings: $${sellerTotal.toFixed(2)}</strong></p>
        <p style="margin-top:24px">
          <a href="${CLIENT}/seller" style="background:#1a1a2e;color:white;padding:12px 24px;border-radius:6px;text-decoration:none">
            Manage Order
          </a>
        </p>
      </div>
    `,
  });
}

async function sendCustomerOrderConfirmation(customerEmail, customerName, order) {
  if (!resend) return;
  const rows = order.items.map(i =>
    `<tr style="border-bottom:1px solid #eee">
      <td style="padding:8px">${i.name}</td>
      <td style="padding:8px;text-align:center">${i.quantity}</td>
      <td style="padding:8px;text-align:right">$${(i.price * i.quantity).toFixed(2)}</td>
    </tr>`
  ).join('');

  await resend.emails.send({
    from: FROM,
    to: customerEmail,
    subject: `Order Confirmed #${order._id.toString().slice(-8).toUpperCase()}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px">
        <h2 style="color:#1a1a2e;margin-bottom:8px">Order Confirmed!</h2>
        <p>Hi <strong>${customerName}</strong>, your order has been placed successfully.</p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:12px">
          <tr><td style="padding:4px 0;color:#666">Order ID</td><td><strong>#${order._id.toString().slice(-8).toUpperCase()}</strong></td></tr>
          <tr><td style="padding:4px 0;color:#666">Payment</td><td>${order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Card (Stripe)'}</td></tr>
          <tr><td style="padding:4px 0;color:#666">Status</td><td>${order.status}</td></tr>
        </table>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <thead><tr style="background:#f5f5f5">
            <th style="padding:8px;text-align:left">Product</th>
            <th style="padding:8px;text-align:center">Qty</th>
            <th style="padding:8px;text-align:right">Subtotal</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <p style="font-size:18px;margin:0"><strong>Total: $${order.total.toFixed(2)}</strong></p>
        <p style="margin-top:24px">
          <a href="${CLIENT}/profile#orders" style="background:#1a1a2e;color:white;padding:12px 24px;border-radius:6px;text-decoration:none">
            Track Order
          </a>
        </p>
      </div>
    `,
  });
}

module.exports = { sendSellerNewOrderEmail, sendCustomerOrderConfirmation };

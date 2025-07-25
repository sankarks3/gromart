import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup - allows Render frontend or localhost during development
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  })
);

app.use(bodyParser.json());

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Email API
app.post('/api/send-email', async (req, res) => {
  console.log('Received order:', req.body);

  const { customer, items, totalAmount, orderId } = req.body;

  const productListHtml =
    items && items.length > 0
      ? items
          .map(
            (item) =>
              `<li>${item.name} - Qty: ${item.quantity} - ₹${item.price * item.quantity}</li>`
          )
          .join('')
      : '<li>No products found</li>';

  const emailBodyHtml = `
    <h2>New Order Details</h2>
    <p><strong>Order ID:</strong> ${orderId}</p>
    <p><strong>Customer Name:</strong> ${customer?.name || 'N/A'}</p>
    <p><strong>Phone:</strong> ${customer?.phone || 'N/A'}</p>
    <p><strong>Address:</strong> ${customer?.address || 'N/A'}</p>
    <h3>Products:</h3>
    <ul>${productListHtml}</ul>
    <p><strong>Total Amount:</strong> ₹${totalAmount || 0}</p>
  `;

  try {
    const emailResponse = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'sankar.bca.2011@gmail.com',
      subject: `New Order - ${orderId}`,
      html: emailBodyHtml,
    });

    console.log('Email sent:', emailResponse);
    res.json({ success: true });
  } catch (error) {
    console.error('Email sending failed:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

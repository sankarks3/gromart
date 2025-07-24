import { Resend } from 'resend';

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

// Function to send owner confirmation email
export async function sendOwnerEmail({
  products,
  paymentMode
}: {
  products: { name: string; quantity: number }[];
  paymentMode: string;
}) {
  const productList = products.map(p => `${p.name} (x${p.quantity})`).join(', ');

  const textMessage = `New Order Details:
Products: ${productList}
Payment Mode: ${paymentMode}`;

  try {
    await resend.emails.send({
      from: 'orders@yourapp.com',
      to: 'sankar.bca.2011@gmail.com',
      subject: 'New Order Confirmation',
      text: textMessage
    });
    console.log('Owner email sent successfully!');
  } catch (error) {
    console.error('Error sending owner email:', error);
  }
}

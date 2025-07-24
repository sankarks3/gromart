import { Resend } from 'resend';

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

export async function sendOwnerEmail({
  products,
  paymentMode,
}: {
  products: { name: string; quantity: number }[];
  paymentMode: string;
}) {
  const productList = products.map(p => `${p.name} (x${p.quantity})`).join(', ');

  try {
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',  // Safe test sender
      to: 'sankar.bca.2011@gmail.com',
      subject: 'New Order Confirmation',
      text: `New Order Details:\nProducts: ${productList}\nPayment Mode: ${paymentMode}`,
    });
    console.log('Order confirmation email sent:', result);
  } catch (error) {
    console.error('Failed to send owner email:', error);
  }
}

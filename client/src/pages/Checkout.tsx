import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const Checkout: React.FC = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('gpay'); // Default UPI method

  const totalAmount = Array.isArray(cartItems)
    ? cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    : 0;

  const handlePlaceOrder = async () => {
    if (!customerDetails.name || !customerDetails.phone || !customerDetails.address) {
      alert('Please fill all customer details.');
      return;
    }

    const orderId = `GRM${Date.now()}`;
    const orderDetails = {
      orderId,
      items: cartItems,
      totalAmount,
      paymentMethod,
      customer: customerDetails,
    };

    try {
      // Send order to backend
      await fetch('https://gromart-i3hs.onrender.com/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderDetails),
      });

      clearCart();

      if (paymentMethod === 'gpay' || paymentMethod === 'phonepe') {
        const upiLink = `upi://pay?pa=ks.sankar@ybl&pn=GROMART&am=${totalAmount}&cu=INR&tn=Order%20${orderId}`;
        window.location.href = upiLink;
      } else {
        navigate('/order-confirmation', { state: { orderDetails } });
      }
    } catch (err) {
      console.error('Order email failed:', err);
      alert('Failed to place order.');
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Your cart is empty.</div>;
  }

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: '2rem' }}>
      <h2>Checkout</h2>
      <input
        type="text"
        placeholder="Name"
        value={customerDetails.name}
        onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
        style={{ width: '100%', padding: 10, marginBottom: 10 }}
      />
      <input
        type="text"
        placeholder="Phone"
        value={customerDetails.phone}
        onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
        style={{ width: '100%', padding: 10, marginBottom: 10 }}
      />
      <textarea
        placeholder="Address"
        value={customerDetails.address}
        onChange={(e) => setCustomerDetails({ ...customerDetails, address: e.target.value })}
        style={{ width: '100%', padding: 10, marginBottom: 10 }}
      />

      <div style={{ marginBottom: 10 }}>
        <label><strong>Select Payment Method:</strong></label><br />
        <label>
          <input
            type="radio"
            name="payment"
            value="gpay"
            checked={paymentMethod === 'gpay'}
            onChange={() => setPaymentMethod('gpay')}
          /> Google Pay
        </label><br />
        <label>
          <input
            type="radio"
            name="payment"
            value="phonepe"
            checked={paymentMethod === 'phonepe'}
            onChange={() => setPaymentMethod('phonepe')}
          /> PhonePe
        </label><br />
        <label style={{ color: '#999' }}>
          <input
            type="radio"
            name="payment"
            value="cod"
            disabled
          /> Cash on Delivery (Coming Soon)
        </label>
      </div>

      <p><strong>Total:</strong> ₹{totalAmount}</p>
      <button
        onClick={handlePlaceOrder}
        style={{ width: '100%', padding: 12, backgroundColor: '#28a745', color: '#fff', border: 'none' }}
      >
        Place Order
      </button>
    </div>
  );
};

export default Checkout;

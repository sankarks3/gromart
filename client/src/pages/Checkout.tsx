import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const Checkout: React.FC = () => {
  const { cartItems, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const navigate = useNavigate();

  const totalAmount = Array.isArray(cartItems)
    ? cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    : 0;

  const handlePlaceOrder = async () => {
    if (!customerDetails.name || !customerDetails.phone || !customerDetails.address) {
      alert('Please fill all customer details before placing order.');
      return;
    }

    const orderId = `GRM${Date.now()}`;
    const orderDetails = {
      ...customerDetails,
      items: cartItems,
      totalAmount,
      paymentMethod,
      orderId,
    };

    try {
      await fetch('https://gromart-i3hs.onrender.com/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderDetails),
      });

      if (paymentMethod === 'UPI') {
        handleUPIPayment(totalAmount, orderId);
      } else {
        clearCart();
        navigate('/order-confirmation', { state: { orderDetails } });
      }
    } catch (error) {
      console.error('Order email failed:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  const handleUPIPayment = (amount: number, orderId: string) => {
    const upiLink = `upi://pay?pa=ks.sankar@ybl&pn=GROMART&am=${amount}&cu=INR&tn=Order%20${orderId}`;
    window.location.href = upiLink;
  };

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Your cart is empty.</div>;
  }

  return (
    <div className="checkout-container" style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Checkout</h2>
      <input
        type="text"
        placeholder="Name"
        value={customerDetails.name}
        onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
        style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
      />
      <input
        type="text"
        placeholder="Phone"
        value={customerDetails.phone}
        onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
        style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
      />
      <textarea
        placeholder="Address"
        value={customerDetails.address}
        onChange={(e) => setCustomerDetails({ ...customerDetails, address: e.target.value })}
        style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
      />
      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
      >
        <option value="COD">Cash on Delivery</option>
        <option value="UPI">UPI Payment</option>
      </select>

      <p><strong>Total:</strong> ₹{totalAmount}</p>

      <button
        onClick={handlePlaceOrder}
        style={{ width: '100%', padding: '12px', background: '#28a745', color: '#fff', border: 'none', cursor: 'pointer' }}
      >
        Place Order
      </button>
    </div>
  );
};

export default Checkout;

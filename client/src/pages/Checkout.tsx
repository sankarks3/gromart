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

  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    const orderId = `GRM${Date.now()}`;
    const orderDetails = {
      ...customerDetails,
      items: cartItems,
      totalAmount,
      paymentMethod,
      orderId,
    };

    // Call backend API to send confirmation email
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
    }
  };

  const handleUPIPayment = (amount: number, orderId: string) => {
    const upiLink = `upi://pay?pa=ks.sankar@ybl&pn=GROMART&am=${amount}&cu=INR&tn=Order%20${orderId}`;
    window.location.href = upiLink;
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <input
        type="text"
        placeholder="Name"
        value={customerDetails.name}
        onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Phone"
        value={customerDetails.phone}
        onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
      />
      <textarea
        placeholder="Address"
        value={customerDetails.address}
        onChange={(e) => setCustomerDetails({ ...customerDetails, address: e.target.value })}
      />
      <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
        <option value="COD">Cash on Delivery</option>
        <option value="UPI">UPI Payment</option>
      </select>

      <button onClick={handlePlaceOrder}>
        Place Order
      </button>
    </div>
  );
};

export default Checkout;

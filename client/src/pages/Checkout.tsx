import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const Checkout: React.FC = () => {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const totalAmount = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    const orderId = `GRM${Date.now()}`;

    const orderDetails = {
      orderId,
      customer: customerDetails,
      items,
      totalAmount,
      paymentMethod,
    };

    try {
      const res = await fetch('https://gromart-i3hs.onrender.com/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderDetails),
      });

      if (!res.ok) {
        console.error('Email failed');
        return;
      }

      if (paymentMethod === 'UPI') {
        const upiUrl = `upi://pay?pa=ks.sankar@ybl&pn=GROMART&am=${totalAmount}&cu=INR&tn=Order%20${orderId}`;
        window.location.href = upiUrl;
      }

      clearCart();
      navigate('/order-confirmation', { state: { orderDetails } });
    } catch (err) {
      console.error('Order placement failed:', err);
    }
  };

  return (
    <div className="checkout-container p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      <input
        type="text"
        placeholder="Name"
        value={customerDetails.name}
        onChange={(e) =>
          setCustomerDetails({ ...customerDetails, name: e.target.value })
        }
        className="w-full mb-3 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Phone"
        value={customerDetails.phone}
        onChange={(e) =>
          setCustomerDetails({ ...customerDetails, phone: e.target.value })
        }
        className="w-full mb-3 p-2 border rounded"
      />
      <textarea
        placeholder="Address"
        value={customerDetails.address}
        onChange={(e) =>
          setCustomerDetails({ ...customerDetails, address: e.target.value })
        }
        className="w-full mb-3 p-2 border rounded"
      />

      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="w-full mb-3 p-2 border rounded"
      >
        <option value="UPI">UPI (PhonePe / GPay)</option>
        <option value="COD" disabled>Cash on Delivery (Coming Soon)</option>
      </select>

      <div className="summary mb-4">
        <h3 className="font-semibold">Total: ₹{totalAmount}</h3>
      </div>

      <button
        onClick={handlePlaceOrder}
        className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700"
      >
        Place Order
      </button>
    </div>
  );
};

export default Checkout;

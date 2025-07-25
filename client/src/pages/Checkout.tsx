import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode.react';

const Checkout: React.FC = () => {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [showQR, setShowQR] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const totalAmount = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const orderId = `GRM${Date.now()}`;
  const upiUrl = `upi://pay?pa=ks.sankar@ybl&pn=GROMART&am=${totalAmount}&cu=INR&tn=Order%20${orderId}`;

  const handlePlaceOrder = async () => {
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
        if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
          window.location.href = upiUrl;
        } else {
          setShowQR(true);
        }
      } else {
        clearCart();
        navigate('/order-confirmation', { state: { orderDetails } });
      }
    } catch (err) {
      console.error('Order placement failed:', err);
    }
  };

  useEffect(() => {
    if (showQR) {
      const interval = setInterval(() => {
        // Add verification logic if needed
        console.log('Waiting for payment confirmation...');
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [showQR]);

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
        <option value="COD" disabled>
          Cash on Delivery (Coming Soon)
        </option>
      </select>

      <button
        onClick={handlePlaceOrder}
        className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700"
      >
        Place Order
      </button>

      {showQR && (
        <div className="mt-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Scan to Pay</h3>
          <QRCode value={upiUrl} size={200} />
          <p className="text-sm text-gray-600 mt-2">{upiUrl}</p>
        </div>
      )}
    </div>
  );
};

export default Checkout;

import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';

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

        if (/Mobi|Android/i.test(navigator.userAgent)) {
          // Mobile – Open UPI intent
          window.location.href = upiUrl;
        } else {
          // Desktop – Show QR
          setShowQR(true);
          setUpiLink(upiUrl);
          return;
        }
      }

      clearCart();
      navigate('/order-confirmation', { state: { orderDetails } });
    } catch (err) {
      console.error('Order placement failed:', err);
    }
  };

  const [showQR, setShowQR] = useState(false);
  const [upiLink, setUpiLink] = useState('');

  if (showQR && upiLink) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Scan to Pay</h2>
        <QRCodeCanvas value={upiLink} size={220} />
        <p className="mt-4 text-sm text-gray-600">Scan this code using PhonePe, GPay, or any UPI app</p>
        <button
          onClick={() => {
            setShowQR(false);
            clearCart();
            navigate('/order-confirmation', { state: { orderDetails: { ...customerDetails, items, totalAmount } } });
          }}
          className="mt-6 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Payment Done – Proceed
        </button>
      </div>
    );
  }

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

      <div className="summary bg-white shadow p-4 rounded mb-4">
        <h3 className="font-medium mb-2">Order Summary</h3>
        {items.map(item => (
          <div key={item.id} className="flex justify-between text-sm mb-1">
            <span>{item.name} × {item.quantity}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <hr className="my-2" />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₹{totalAmount}</span>
        </div>
      </div>

      <button
        onClick={handlePlaceOrder}
        className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
      >
        Place Order
      </button>
    </div>
  );
};

export default Checkout;

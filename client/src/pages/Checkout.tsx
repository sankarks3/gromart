import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode.react';

const Checkout: React.FC = () => {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [showQR, setShowQR] = useState(false);
  const [upiUrl, setUpiUrl] = useState('');
  const [orderId, setOrderId] = useState('');

  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const totalAmount = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  const handlePlaceOrder = async () => {
    const newOrderId = `GRM${Date.now()}`;
    setOrderId(newOrderId);

    const orderDetails = {
      orderId: newOrderId,
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

      const upiString = `upi://pay?pa=ks.sankar@ybl&pn=GROMART&am=${totalAmount}&cu=INR&tn=Order%20${newOrderId}`;
      setUpiUrl(upiString);

      if (paymentMethod === 'UPI') {
        if (isMobile) {
          // Mobile → open UPI intent
          window.location.href = upiString;
        } else {
          // Desktop → show QR
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

  return (
    <div className="checkout-container p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      {!showQR ? (
        <>
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

          <div className="summary mb-4">
            <h3 className="font-semibold">Order Summary</h3>
            {items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.name} (x{item.quantity})</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="font-bold mt-2 flex justify-between">
              <span>Total:</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
          >
            Place Order
          </button>
        </>
      ) : (
        <div className="text-center mt-8">
          <h3 className="text-xl font-semibold mb-2">Scan & Pay with UPI</h3>
          <p className="mb-4">Order ID: {orderId}</p>
          <QRCode value={upiUrl} size={220} />
          <p className="text-sm text-gray-600 mt-3">
            Use PhonePe or GPay to scan this QR code and complete your payment.
          </p>
          <button
            onClick={() => {
              clearCart();
              navigate('/order-confirmation', { state: { orderId, totalAmount } });
            }}
            className="mt-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Payment Done → Go to Confirmation
          </button>
        </div>
      )}
    </div>
  );
};

export default Checkout;

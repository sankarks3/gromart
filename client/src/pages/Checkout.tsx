import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const { items, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const totalAmount = getTotalPrice();

  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const [paymentMode, setPaymentMode] = useState('upi'); // Default payment mode

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    const orderId = `GRM${Date.now()}`;
    const orderPayload = {
      orderId,
      totalAmount,
      paymentMode,
      items: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      customer
    };

    // Backend URL
    const API_BASE_URL =
      window.location.hostname === 'localhost'
        ? 'http://localhost:5000'
        : 'https://gromart-i3hs.onrender.com';

    if (paymentMode === 'upi') {
      try {
        await fetch(`${API_BASE_URL}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload),
        });

        const upiUrl = `upi://pay?pa=ks.sankar@ybl&pn=GROMART&am=${totalAmount}&cu=INR&tn=Order%20${orderId}`;
        window.location.href = upiUrl; // Opens UPI app
      } catch (error) {
        console.error('Error sending order email:', error);
      }
      return;
    }

    // COD flow
    try {
      const response = await fetch(`${API_BASE_URL}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (response.ok) {
        console.log('Order confirmation email sent');
        clearCart();
        navigate('/orders');
      } else {
        console.error('Order email failed:', await response.text());
      }
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* Customer Details */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Customer Details</h2>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={customer.name}
          onChange={handleInputChange}
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={customer.phone}
          onChange={handleInputChange}
          className="w-full mb-3 p-2 border rounded"
        />
        <textarea
          name="address"
          placeholder="Full Address"
          value={customer.address}
          onChange={handleInputChange}
          className="w-full mb-3 p-2 border rounded"
        />

        {/* Payment Mode */}
        <div className="mt-4">
          <h3 className="text-sm font-semibold mb-2">Select Payment Mode:</h3>
          <select
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="upi">UPI</option>
            <option value="cod">Cash on Delivery</option>
          </select>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        {items.map((item) => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>{item.name} (x{item.quantity})</span>
            <span>₹{(item.price * item.quantity).toFixed(0)}</span>
          </div>
        ))}
        <div className="border-t mt-2 pt-2 flex justify-between font-bold">
          <span>Total:</span>
          <span>₹{totalAmount.toFixed(0)}</span>
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
}

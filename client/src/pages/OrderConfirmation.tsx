// client/src/pages/OrderConfirmation.tsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderDetails = location.state?.orderDetails;

  if (!orderDetails) {
    return (
      <div className="text-center mt-10">
        <p>No order found.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <CheckCircle className="text-green-600 w-16 h-16 mx-auto mb-4" />
      <h1 className="text-2xl font-bold mb-2 text-green-700">Order Received Successfully!</h1>
      <p className="mb-6">Thank you for your order. We'll process it shortly.</p>

      <div className="text-left bg-white shadow rounded p-4">
        <h2 className="font-semibold mb-2">Order Summary</h2>
        <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
        <p><strong>Name:</strong> {orderDetails.customer.name}</p>
        <p><strong>Phone:</strong> {orderDetails.customer.phone}</p>
        <p><strong>Address:</strong> {orderDetails.customer.address}</p>

        <h3 className="mt-4 mb-2 font-semibold">Items:</h3>
        <ul className="list-disc pl-5">
          {orderDetails.items.map((item: any, index: number) => (
            <li key={index}>
              {item.name} - Qty: {item.quantity} - ₹{item.price * item.quantity}
            </li>
          ))}
        </ul>

        <p className="mt-3 font-bold">Total: ₹{orderDetails.totalAmount}</p>
      </div>
    </div>
  );
}

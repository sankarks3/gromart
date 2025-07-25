import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function OrderConfirmation() {
  const location = useLocation();
  const orderDetails = location.state?.orderDetails;

  if (!orderDetails) {
    return (
      <div className="text-center p-6">
        <h2 className="text-xl font-semibold mb-2">No Order Found</h2>
        <p className="text-gray-600 mb-4">Please complete your order before accessing this page.</p>
        <Link to="/" className="text-green-600 underline">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <CheckCircle className="text-green-600 w-16 h-16 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Order Received Successfully</h2>
      <p className="text-gray-700 mb-4">Thank you, {orderDetails.customer?.name || 'Customer'}!</p>

      <div className="bg-gray-100 rounded p-4 text-left w-full max-w-md mb-4">
        <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
        <p><strong>Total:</strong> ₹{orderDetails.totalAmount}</p>
        <p><strong>Payment:</strong> {orderDetails.paymentMethod}</p>
      </div>

      <Link to="/" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
        Back to Home
      </Link>
    </div>
  );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();

  const handleCheckout = async () => {
    if (cart.length === 0) {
      console.error("Cart is empty, cannot place order.");
      return;
    }

    try {
      // Build the order payload
      const orderPayload = {
        customer: {
          name: "Test Customer", // Replace with form input values (or a form state)
          phone: "9876543210",
          address: "123 Test Street",
        },
        items: cart,
        totalAmount: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
        paymentMode: "UPI", // or "COD"
        orderId: `ORD-${Date.now()}`,
      };

      // Detect backend URL
      const API_BASE_URL =
        process.env.REACT_APP_API_URL || "http://localhost:5000";

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
    <div>
      <h1>Checkout</h1>
      <div>
        {cart.length > 0 ? (
          <>
            <h2>Items:</h2>
            <ul>
              {cart.map((item, index) => (
                <li key={index}>
                  {item.name} - Qty: {item.quantity} - ₹{item.price * item.quantity}
                </li>
              ))}
            </ul>
            <p>
              <strong>Total:</strong> ₹
              {cart.reduce((acc, item) => acc + item.price * item.quantity, 0)}
            </p>
            <button onClick={handleCheckout}>Place Order</button>
          </>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
    </div>
  );
};

export default Checkout;

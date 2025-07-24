import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function Cart() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useCart();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();
  const deliveryFee = 0; // Free delivery
  const finalTotal = totalPrice + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some fresh groceries to get started!</p>
          <Link
            to="/products"
            className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => {
            const discountedPrice = item.discount
              ? item.price * (1 - item.discount / 100)
              : item.price;

            // Quantity options
            const quantityOptions = item.name.toLowerCase().includes("stayfree")
              ? [0, 6, 12, 24, 48, 64] // 64 = 1 box
              : [0, 6, 12, 24, 48];    // no box option for Whisper

            return (
              <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.unit}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="font-bold text-green-600">
                        ₹{discountedPrice.toFixed(0)}
                      </span>
                      {item.discount && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{item.price}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Dropdown */}
                  <div className="flex items-center space-x-3">
                    <select
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
                    >
                      {quantityOptions.map((qty) => (
                        <option key={qty} value={qty}>
                          {qty === 0 ? 'Nil' : qty === 64 ? '1 Box (64 pcs)' : qty}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal ({totalItems} items)</span>
              <span className="font-medium">₹{totalPrice.toFixed(0)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-medium text-green-600">FREE</span>
            </div>
            
            <p className="text-sm text-green-600">🎉 Free delivery on all orders!</p>
            
            <div className="border-t pt-3">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{finalTotal.toFixed(0)}</span>
              </div>
            </div>
          </div>

          <Link
            to="/checkout"
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors text-center block"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}

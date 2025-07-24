import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Product, useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, items } = useCart();

  // Use product.minQuantity if provided, else 1
  const minQty = product.minQuantity || 1;
  const [quantity, setQuantity] = useState<number>(minQty);

  const cartItem = items.find(item => item.id === product.id);
  const isInCart = !!cartItem;

  // Detect Stayfree for Box option
  const isStayfree = product.name.toLowerCase().includes('stayfree');

  // Price (with discount fallback)
  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const handleQtyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    if (value === 'nil') {
      setQuantity(0);
      return;
    }

    if (value === 'box') {
      // Stayfree box = 64 pcs (only shown for Stayfree anyway)
      setQuantity(64);
      return;
    }

    setQuantity(Number(value));
  };

  const handleAddToCart = () => {
    if (quantity < minQty) {
      alert(`Minimum order is ${minQty} pcs.`);
      return;
    }
    addToCart(product, quantity);
    setQuantity(minQty); // reset selection after adding
  };

  /* --------------------------------------------------
     Coming Soon Card Variant
  -------------------------------------------------- */
  if (product.comingSoon) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden opacity-75">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover grayscale"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <span className="bg-yellow-500 text-white text-sm font-bold px-4 py-2 rounded-lg">
              COMING SOON
            </span>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-2">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {product.category}
            </span>
          </div>

          <h3 className="font-semibold text-gray-600 mb-1">{product.name}</h3>
          <p className="text-sm text-gray-500 mb-2">{product.unit}</p>

          <div className="flex items-center space-x-2 mb-3">
            <span className="text-lg font-bold text-gray-500">
              ₹{discountedPrice.toFixed(0)}
            </span>
          </div>

          <div className="bg-gray-100 text-gray-600 py-2 px-4 rounded-lg text-center">
            <span className="text-sm font-medium">Coming Soon</span>
          </div>
        </div>
      </div>
    );
  }

  /* --------------------------------------------------
     Regular Product Card
  -------------------------------------------------- */
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {product.discount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            {product.discount}% OFF
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {product.category}
          </span>
        </div>

        <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{product.unit}</p>

        <div className="flex items-center space-x-2 mb-3">
          <span className="text-lg font-bold text-green-600">
            ₹{discountedPrice.toFixed(0)}
          </span>
          {product.discount && (
            <span className="text-sm text-gray-500 line-through">
              ₹{product.originalPrice || product.price}
            </span>
          )}
        </div>

        {product.minQuantity && (
          <div className="mb-3">
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
              Min order: {product.minQuantity} pcs
            </span>
          </div>
        )}

        {isInCart ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
            <span className="text-green-700 text-sm font-medium">
              {cartItem.quantity} in cart
            </span>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Quantity Dropdown */}
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-1">
              <select
                value={quantity === 0 ? 'nil' : isStayfree && quantity === 64 ? 'box' : String(quantity)}
                onChange={handleQtyChange}
                className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-500"
              >
                <option value="nil">Nil</option>
                <option value="6">6</option>
                <option value="12">12</option>
                <option value="24">24</option>
                <option value="48">48</option>
                {isStayfree && <option value="box">1 Box (64 pcs)</option>}
              </select>
            </div>

            {/* Min qty warning */}
            {quantity > 0 && quantity < minQty && (
              <div className="text-xs text-red-600 text-center">
                Minimum {minQty} pcs required.
              </div>
            )}

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={quantity < minQty}
              className="w-full bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

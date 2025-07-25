import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import StoreLayout from './components/StoreLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import StoreDashboard from './pages/StoreDashboard';
import StoreOrders from './pages/StoreOrders';
import StoreProducts from './pages/StoreProducts';
import OrderConfirmation from './pages/OrderConfirmation'; // ✅ Added missing import

function AppRoutes() {
  const { user } = useAuth();
  const isStore = user?.role === 'store';

  if (isStore) {
    return (
      <StoreLayout>
        <Routes>
          <Route path="/" element={<StoreDashboard />} />
          <Route path="/orders" element={<StoreOrders />} />
          <Route path="/products" element={<StoreProducts />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </StoreLayout>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/*" element={<AppRoutes />} />
              </Routes>
            </div>
          </Router>
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

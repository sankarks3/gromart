import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from './CartContext';

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  customerDetails: {
    name: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
  };
  paymentMethod: 'upi' | 'cod';
  status: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled';
  createdAt: Date;
  estimatedDelivery: Date;
}

interface OrderContextType {
  orders: Order[];
  placeOrder: (orderData: Omit<Order, 'id' | 'status' | 'createdAt' | 'estimatedDelivery'>) => Promise<string>;
  getOrderById: (id: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const savedOrders = localStorage.getItem('gromart_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders).map((order: any) => ({
        ...order,
        createdAt: new Date(order.createdAt),
        estimatedDelivery: new Date(order.estimatedDelivery),
      })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('gromart_orders', JSON.stringify(orders));
  }, [orders]);

  const placeOrder = async (orderData: Omit<Order, 'id' | 'status' | 'createdAt' | 'estimatedDelivery'>): Promise<string> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const orderId = `GRM${Date.now()}`;
    const now = new Date();
    const estimatedDelivery = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now

    const newOrder: Order = {
      id: orderId,
      ...orderData,
      status: 'confirmed',
      createdAt: now,
      estimatedDelivery,
    };

    setOrders(prevOrders => [newOrder, ...prevOrders]);

    // Simulate sending email
    console.log('Order confirmation email sent:', {
      to: 'customer@example.com',
      orderId,
      totalAmount: orderData.totalAmount,
      items: orderData.items,
    });

    return orderId;
  };

  const getOrderById = (id: string) => {
    return orders.find(order => order.id === id);
  };

  return (
    <OrderContext.Provider value={{
      orders,
      placeOrder,
      getOrderById,
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
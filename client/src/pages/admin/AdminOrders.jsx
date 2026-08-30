import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/apiClient';
import { Truck, Search } from 'lucide-react';

const AdminOrders = () => {
  // Fetch orders
  const { data: orders, isLoading } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: async () => {
      const { data } = await apiClient.get('/orders');
      return data;
    },
    retry: false
  });

  const displayOrders = Array.isArray(orders) ? orders : (orders?.orders || []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl uppercase">Order Fulfillment</h1>
        <div className="relative">
          <input 
            type="text" 
            placeholder="SEARCH ORDERS..." 
            className="pl-10 pr-4 py-3 border border-[#EAEAEA] font-sans text-xs uppercase tracking-widest w-64 focus:outline-none focus:border-black"
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="bg-white border border-[#EAEAEA] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-sm">
            <thead className="bg-gray-50 border-b border-[#EAEAEA]">
              <tr>
                <th className="px-6 py-4 uppercase tracking-widest text-[10px] text-gray-500 font-medium">Order Number</th>
                <th className="px-6 py-4 uppercase tracking-widest text-[10px] text-gray-500 font-medium">Customer</th>
                <th className="px-6 py-4 uppercase tracking-widest text-[10px] text-gray-500 font-medium">Status</th>
                <th className="px-6 py-4 uppercase tracking-widest text-[10px] text-gray-500 font-medium">Payment</th>
                <th className="px-6 py-4 uppercase tracking-widest text-[10px] text-gray-500 font-medium">Fulfillment Details</th>
                <th className="px-6 py-4 uppercase tracking-widest text-[10px] text-gray-500 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEAEA]">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500 uppercase tracking-widest text-xs">Loading Orders...</td>
                </tr>
              ) : displayOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500 uppercase tracking-widest text-xs">No orders found.</td>
                </tr>
              ) : (
                displayOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{order.orderNumber}</td>
                    <td className="px-6 py-4">
                      {order.user?.name || order.guestInfo?.name || 'Guest'}
                    </td>
                    <td className="px-6 py-4">
                      <select className="border border-[#EAEAEA] p-1 text-xs uppercase tracking-wider focus:outline-none">
                        <option value="ORDER_PLACED" selected={order.orderStatus === 'ORDER_PLACED'}>Order Placed</option>
                        <option value="PROCESSING" selected={order.orderStatus === 'PROCESSING'}>Processing</option>
                        <option value="SHIPPED" selected={order.orderStatus === 'SHIPPED'}>Shipped</option>
                        <option value="DELIVERED" selected={order.orderStatus === 'DELIVERED'}>Delivered</option>
                        <option value="CANCELLED" selected={order.orderStatus === 'CANCELLED'}>Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-[10px] uppercase tracking-wider rounded ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {order.paymentMethod} - {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <input type="text" placeholder="Courier (e.g. TCS)" defaultValue={order.courierName} className="border border-[#EAEAEA] p-1 text-xs w-24" />
                        <input type="text" placeholder="Tracking #" defaultValue={order.trackingNumber} className="border border-[#EAEAEA] p-1 text-xs w-32" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button className="bg-[#111111] text-white p-2 hover:bg-[#C5A880] transition-colors" title="Save Updates">
                        <Truck size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;

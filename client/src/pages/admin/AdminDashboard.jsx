import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Package, ShoppingBag, DollarSign, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
  // Fetch high-level stats (For now we mock the API response if endpoint doesn't exist yet, but assuming it will)
  // Let's use dummy stats for visual layout per PRD "Dashboard: KPI tiles"
  
  return (
    <div>
      <h1 className="font-serif text-3xl uppercase mb-8">Dashboard Overview</h1>
      
      {/* KPI Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 shadow-sm border border-[#EAEAEA]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Total Revenue</p>
              <h3 className="text-2xl font-sans font-medium">Rs. 1,250,000</h3>
            </div>
            <div className="p-3 bg-gray-50 rounded text-black">
              <DollarSign size={20} />
            </div>
          </div>
          <p className="text-[10px] text-green-600 mt-4 uppercase tracking-wider">+15% from last month</p>
        </div>

        <div className="bg-white p-6 shadow-sm border border-[#EAEAEA]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Pending Orders</p>
              <h3 className="text-2xl font-sans font-medium">42</h3>
            </div>
            <div className="p-3 bg-gray-50 rounded text-black">
              <ShoppingBag size={20} />
            </div>
          </div>
          <p className="text-[10px] text-orange-600 mt-4 uppercase tracking-wider">Requires processing</p>
        </div>

        <div className="bg-white p-6 shadow-sm border border-[#EAEAEA]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Low Stock Alerts</p>
              <h3 className="text-2xl font-sans font-medium">7</h3>
            </div>
            <div className="p-3 bg-gray-50 rounded text-red-600">
              <AlertCircle size={20} />
            </div>
          </div>
          <p className="text-[10px] text-red-600 mt-4 uppercase tracking-wider">Action required</p>
        </div>

        <div className="bg-white p-6 shadow-sm border border-[#EAEAEA]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Total Products</p>
              <h3 className="text-2xl font-sans font-medium">124</h3>
            </div>
            <div className="p-3 bg-gray-50 rounded text-black">
              <Package size={20} />
            </div>
          </div>
          <p className="text-[10px] text-gray-500 mt-4 uppercase tracking-wider">Across 5 collections</p>
        </div>
      </div>

      {/* Recent Orders Stream */}
      <div className="bg-white border border-[#EAEAEA] shadow-sm">
        <div className="p-6 border-b border-[#EAEAEA]">
          <h2 className="font-serif text-xl uppercase">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 uppercase tracking-widest text-[10px] text-gray-500 font-medium">Order ID</th>
                <th className="px-6 py-4 uppercase tracking-widest text-[10px] text-gray-500 font-medium">Customer</th>
                <th className="px-6 py-4 uppercase tracking-widest text-[10px] text-gray-500 font-medium">Date</th>
                <th className="px-6 py-4 uppercase tracking-widest text-[10px] text-gray-500 font-medium">Status</th>
                <th className="px-6 py-4 uppercase tracking-widest text-[10px] text-gray-500 font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEAEA]">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">VAN-49201</td>
                <td className="px-6 py-4">Sarah Ahmed</td>
                <td className="px-6 py-4">Oct 24, 2023</td>
                <td className="px-6 py-4"><span className="bg-orange-100 text-orange-800 px-2 py-1 text-[10px] uppercase tracking-wider rounded">Processing</span></td>
                <td className="px-6 py-4">Rs. 45,500</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">VAN-49200</td>
                <td className="px-6 py-4">Ayesha Khan</td>
                <td className="px-6 py-4">Oct 24, 2023</td>
                <td className="px-6 py-4"><span className="bg-green-100 text-green-800 px-2 py-1 text-[10px] uppercase tracking-wider rounded">Shipped</span></td>
                <td className="px-6 py-4">Rs. 12,000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

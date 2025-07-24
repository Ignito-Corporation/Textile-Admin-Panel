import { Card, CardContent } from "@/components/ui/card";
import {
  ShoppingCart,
  FileText,
  CircleDollarSign,
  PackageCheck,
  Download, Edit, Mail, Bell, Trash2
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const orders = [
    {
      id: "PO-202507-178",
      vendor: "Premium Cotton Suppliers",
      delivery: "25/7/2025",
      date: "18/7/2025",
      amount: "₹1,069.60",
    },
    {
      id: "PO-202507-177",
      vendor: "Premium Cotton Suppliers",
      delivery: "25/7/2025",
      date: "18/7/2025",
      amount: "₹1,069.60",
    },
    {
      id: "PO-202507-137",
      vendor: "Premium Cotton Suppliers",
      delivery: "25/7/2025",
      date: "18/7/2025",
      amount: "₹28,56,000.00",
    },
  ];

  const cards = [
    {
      icon: <ShoppingCart className="text-[#2f3c4f]" />,
      title: "Total POs",
      value: 4,
      route: "/dashboard/all-pos", // ✅ Updated route
    },
    {
      icon: <FileText className="text-green-600" />,
      title: "Bill Entry Purchase",
      value: 4,
      route: "/dashboard/bill-entry", // ✅ Updated route
    },
    {
      icon: <CircleDollarSign className="text-yellow-500" />,
      title: "Out Entry",
      value: "₹28,84,389.2",
    },
    {
      icon: <PackageCheck className="text-blue-600" />,
      title: "In Entry",
      value: 4,

    },
  ];

  const handleCardClick = (route) => {
    if (route) navigate(route);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <Card
            key={i}
            className={`shadow cursor-pointer transition hover:shadow-md ${card.route ? "hover:bg-gray-100" : ""
              }`}
            onClick={() => handleCardClick(card.route)}
          >
            <CardContent className="p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{card.title}</span>
                {card.icon}
              </div>
              <div className="text-xl font-bold text-black">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="rounded-xl overflow-hidden shadow bg-white mt-12">
        <div className="bg-[#2d3e50] px-6 py-6 text-white text-lg font-semibold flex justify-between items-center">
          <span>Recent Purchase Orders</span>
          <Link
            to="/create-po"
            className="text-sm text-white px-3 py-1 rounded transition-colors duration-200 hover:bg-[#3c4e66]"
          >
            + New PO
          </Link>

        </div>
        <table className="w-full text-sm  px-4 py-4 text-left">
          <thead className="bg-[#2d3e50] text-white uppercase text-xs">
            <tr>
              <th className="px-6 py-3">PO Number</th>
              <th className="px-6 py-3">Vendor</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{order.id}</td>
                <td className="px-6 py-4">
                  <p className="text-blue-700 font-medium">{order.vendor}</p>
                  <p className="text-sm text-gray-500">Delivery: {order.delivery}</p>
                </td>
                <td className="px-6 py-4">{order.date}</td>
                <td className="px-6 py-4">
                  <p className="text-green-600 font-semibold">{order.amount}</p>
                  <p className="text-xs text-gray-500">Net 15</p>
                </td>
                <td className="px-6 py-4 flex space-x-2">
                  <button
                    className="bg-gray-800 p-2 rounded text-white"
                    onClick={() => console.log('Edit button clicked')}
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    className="bg-green-500 p-2 rounded text-white"
                    onClick={() => console.log('Download button clicked')}
                  >
                    <Download size={16} />
                  </button>

                  <button
                    className="bg-yellow-400 p-2 rounded text-white"
                    onClick={() => console.log('Notification button clicked')}
                  >
                    <Bell size={16} />
                  </button>

                  <button
                    className="bg-blue-500 p-2 rounded text-white"
                    onClick={() => console.log('Mail button clicked')}
                  >
                    <Mail size={16} />
                  </button>

                  <button
                    className="bg-red-500 p-2 rounded text-white"
                    onClick={() => console.log('Trash button clicked')}
                  >
                    <Trash2 size={16} />
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>

  );
}

// import {
//   CircleDollarSign,
//   FileText,
//   PackageCheck,
//   ShoppingCart,
// } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";

// export default function AllPOs() {
//   const cards = [
//     {
//       title: "Total POs",
//       value: 4,
//       icon: <ShoppingCart className="text-[#2f3c4f]" />,
//     },
//     {
//       title: "Active POs",
//       value: 4,
//       icon: <FileText className="text-green-600" />,
//     },
//     {
//       title: "Total Value",
//       value: "₹28,84,389.2",
//       icon: <CircleDollarSign className="text-yellow-500" />,
//     },
//     {
//       title: "This Month",
//       value: 4,
//       icon: <PackageCheck className="text-blue-600" />,
//     },
//   ];

//   const tableHeaders = ["PO Number", "Vendor", "Receiving Date", "Amount"];
//   const tableData = Array(7).fill({ number: "-", vendor: "-", date: "-", amount: "-" });

//   return (
//     <div className="p-4">
//       {/* Breadcrumb */}
//       {/* <h2 className="text-xl font-semibold text-gray-700 mb-1">Dashboard</h2>
//       <h1 className="text-2xl font-bold text-blue-700 mb-6">Total PO’s</h1> */}
//       <div className="text-xl font-semibold text-gray-800 mb-4">
//         Dashboard <span className="text-blue-600">› Total PO’s</span>
//       </div>

//       {/* Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         {cards.map((card, idx) => (
//           <Card key={idx} className="shadow">
//             <CardContent className="p-4 flex flex-col gap-2">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-700">{card.title}</span>
//                 {card.icon}
//               </div>
//               <div className="text-xl font-bold text-black">{card.value}</div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto bg-white shadow rounded-lg">
//         <table className="w-full min-w-[600px] text-sm text-left">
//           <thead className="bg-[#2f3c4f] text-white">
//             <tr>
//               {tableHeaders.map((header, i) => (
//                 <th key={i} className="px-6 py-3 font-medium">
//                   {header}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {tableData.map((row, i) => (
//               <tr key={i} className="even:bg-gray-50">
//                 <td className="px-6 py-3">{row.number}</td>
//                 <td className="px-6 py-3">{row.vendor}</td>
//                 <td className="px-6 py-3">{row.date}</td>
//                 <td className="px-6 py-3">{row.amount}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from 'react';
import {
  CircleDollarSign,
  FileText,
  PackageCheck,
  ShoppingCart,
  Pencil,
  Eye,
  Download,
  Trash,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AllPOs() {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Calculate card data - UPDATED to use is_closed for active status
  const totalPOs = purchaseOrders.length;
  const activePOs = purchaseOrders.filter(po => !po.is_closed).length;
  const totalValue = purchaseOrders.reduce((sum, po) => sum + po.total, 0);
  const thisMonthCount = purchaseOrders.filter(po => {
    const poDate = new Date(po.date);
    const now = new Date();
    return poDate.getMonth() === now.getMonth() && 
           poDate.getFullYear() === now.getFullYear();
  }).length;

  const cards = [
    {
      title: "Total POs",
      value: totalPOs,
      icon: <ShoppingCart className="text-[#2f3c4f]" />,
    },
    {
      title: "Active POs",
      value: activePOs,
      icon: <FileText className="text-green-600" />,
    },
    {
      title: "Total Value",
      value: new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(totalValue),
      icon: <CircleDollarSign className="text-yellow-500" />,
    },
    {
      title: "This Month",
      value: thisMonthCount,
      icon: <PackageCheck className="text-blue-600" />,
    },
  ];

  // Fetch purchase orders from API
  useEffect(() => {
    const fetchPOs = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/po/');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setPurchaseOrders(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching purchase orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPOs();
  }, []);

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading purchase orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong>Error loading data:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="text-xl font-semibold text-gray-800 mb-4">
        Dashboard <span className="text-blue-600">› Total PO’s</span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((card, idx) => (
          <Card key={idx} className="shadow">
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

      {/* Purchase Orders Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full min-w-[600px] text-sm text-left">
          <thead className="bg-[#2f3c4f] text-white">
            <tr>
              <th className="px-6 py-3 font-medium text-left">PO Number</th>
              <th className="px-6 py-3 font-medium text-left">Vendor</th>
              <th className="px-6 py-3 font-medium text-left">Receiving Date</th>
              <th className="px-6 py-3 font-medium text-left">Amount</th>
              <th className="px-6 py-3 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {purchaseOrders.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No purchase orders found
                </td>
              </tr>
            ) : (
              purchaseOrders.map((po) => (
                <tr
                  key={po.id}
                  className={`even:bg-gray-50 border-b hover:bg-gray-50 transition ${
                    po.is_closed ? 'opacity-70' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap align-middle text-sm text-gray-800 font-medium">
                    <div>{po.po_number || '-'}</div>
                    {!po.is_closed && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle text-sm text-gray-700">
                    {po.vendor?.name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle text-sm text-gray-700">
                    {po.delivery_date 
                      ? new Date(po.delivery_date).toLocaleDateString('en-IN') 
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle text-sm text-green-600 font-semibold">
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }).format(po.total || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle">
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 p-1 text-gray-700"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 p-1 text-green-600"
                        title="Edit PO"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 p-1 text-blue-600"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 p-1 text-red-600"
                        title="Delete"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
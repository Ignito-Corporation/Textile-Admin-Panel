// import { Card, CardContent } from "@/components/ui/card";
// import { FileText, IndianRupee, Calendar } from "lucide-react";

// export default function BillEntryPurchase() {
//   const totalBillEntry = 4;
//   const totalValue = 2884389.2;
//   const thisMonth = 4;

//   const tableData = Array.from({ length: 8 }, (_, index) => ({
//     id: index + 1,
//     voucherNumber: "-",
//     unit: "-",
//     shade: "-",
//     lotNo: "-",
//     millName: "-",
//     productQty: "-",
//     rate: "-",
//     gstPercent: "-",
//     gRate: "-",
//     amount: "-",
//     mode: "-",
//     receivingDate: "-",
//   }));

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="text-xl font-semibold text-gray-800 mb-4">
//         Dashboard <span className="text-blue-600">› Bill Entry Purchase</span>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <Card className="shadow-sm border border-gray-200">
//           <CardContent className="flex items-center p-4 gap-4">
//             <div className="bg-gray-100 p-2 rounded-full">
//               <FileText className="text-gray-600" size={24} />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Total Bill Entry</p>
//               <p className="text-xl font-semibold text-gray-800">{totalBillEntry}</p>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="shadow-sm border border-gray-200">
//           <CardContent className="flex items-center p-4 gap-4">
//             <div className="bg-yellow-100 p-2 rounded-full">
//               <IndianRupee className="text-yellow-600" size={24} />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Total Value</p>
//               <p className="text-xl font-semibold text-gray-800">₹{totalValue.toLocaleString()}</p>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="shadow-sm border border-gray-200">
//           <CardContent className="flex items-center p-4 gap-4">
//             <div className="bg-blue-100 p-2 rounded-full">
//               <Calendar className="text-blue-600" size={24} />
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">This Month</p>
//               <p className="text-xl font-semibold text-gray-800">{thisMonth}</p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Table (no grid lines, full rounded, centered) */}
//       <div className="bg-white rounded-xl shadow overflow-x-auto">
//         <table className="min-w-full text-sm text-gray-700 rounded-xl">
//           <thead className="bg-slate-800 text-white text-xs uppercase">
//             <tr>
//               {[
//                 "Voucher Number", "Unit", "Shade", "Lot No.", "Mill Name", "Product Qty",
//                 "Rate", "GST%", "G Rate", "Amount", "Mode", "Receiving Date"
//               ].map((header) => (
//                 <th
//                   key={header}
//                   className="px-4 py-3 text-center font-medium"
//                 >
//                   {header}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {tableData.map((row, idx) => (
//               <tr key={row.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
//                 {Object.values(row).slice(1).map((value, colIdx) => (
//                   <td key={colIdx} className="px-4 py-4 text-center text-gray-700">
//                     {value}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }


import { Card, CardContent } from "@/components/ui/card";
import { FileText, IndianRupee, Calendar } from "lucide-react";
import { useState, useEffect } from "react";

export default function BillEntryPurchase() {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalBillEntry, setTotalBillEntry] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [thisMonth, setThisMonth] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/purchase-bill/");
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        
        const bills = await response.json();
        
        // Calculate summary values
        setTotalBillEntry(bills.length);
        
        const totalVal = bills.reduce((sum, bill) => 
          sum + bill.products.reduce((productSum, product) => 
            productSum + product.amount, 0
          ), 0
        );
        setTotalValue(totalVal);
        
        const currentMonth = new Date().getMonth();
        const monthCount = bills.filter(bill => {
          const billDate = new Date(bill.receiveddate);
          return billDate.getMonth() === currentMonth;
        }).length;
        setThisMonth(monthCount);
        
        // Prepare table data - all products from all bills
        let allProducts = [];
        
        bills.forEach(bill => {
          bill.products.forEach(product => {
            allProducts.push({
              id: `${bill.id}-${product.product_id}`,
              billNumber: bill.billnumber || "-",
              unit: product.unit || "-",
              shade: product.shade || "-",
              lotNo: product.lot_no || "-",
              millName: product.mill_name || "-",
              productQty: product.max_qty || "-",
              rate: product.rate,
              gstPercent: product.gst_percent,
              gRate: product.gst_amount,
              amount: product.amount,
              mode: bill.mode || "-",
              receivingDate: bill.receiveddate || "-",
            });
          });
        });
        
        setTableData(allProducts);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bill data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="text-xl font-semibold text-gray-800 mb-4">
        Dashboard <span className="text-blue-600">› Bill Entry Purchase</span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="shadow-sm border border-gray-200">
          <CardContent className="flex items-center p-4 gap-4">
            <div className="bg-gray-100 p-2 rounded-full">
              <FileText className="text-gray-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Bill Entry</p>
              <p className="text-xl font-semibold text-gray-800">{totalBillEntry}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-gray-200">
          <CardContent className="flex items-center p-4 gap-4">
            <div className="bg-yellow-100 p-2 rounded-full">
              <IndianRupee className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Value</p>
              <p className="text-xl font-semibold text-gray-800">₹{totalValue.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-gray-200">
          <CardContent className="flex items-center p-4 gap-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <Calendar className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">This Month</p>
              <p className="text-xl font-semibold text-gray-800">{thisMonth}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Display error message if exists */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
          <p className="font-medium">Error: {error}</p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700 rounded-xl">
          <thead className="bg-slate-800 text-white text-xs uppercase">
            <tr>
              {[
                "Bill Number", "Unit", "Shade", "Lot No.", "Mill Name", "Product Qty",
                "Rate", "GST%", "G Rate", "Amount", "Mode", "Receiving Date"
              ].map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-center font-medium"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.length > 0 ? (
              tableData.map((row, idx) => (
                <tr key={row.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-4 text-center">{row.billNumber}</td>
                  <td className="px-4 py-4 text-center">{row.unit}</td>
                  <td className="px-4 py-4 text-center">{row.shade}</td>
                  <td className="px-4 py-4 text-center">{row.lotNo}</td>
                  <td className="px-4 py-4 text-center">{row.millName}</td>
                  <td className="px-4 py-4 text-center">{row.productQty}</td>
                  <td className="px-4 py-4 text-center">
                    {typeof row.rate === 'number' ? `₹${row.rate.toLocaleString()}` : row.rate}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {row.gstPercent}{typeof row.gstPercent === 'number' ? '%' : ''}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {typeof row.gRate === 'number' ? `₹${row.gRate.toLocaleString()}` : row.gRate}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {typeof row.amount === 'number' ? `₹${row.amount.toLocaleString()}` : row.amount}
                  </td>
                  <td className="px-4 py-4 text-center">{row.mode}</td>
                  <td className="px-4 py-4 text-center">{row.receivingDate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={12} className="text-center py-8 text-gray-500">
                  No bill data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
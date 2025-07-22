import { Card, CardContent } from "@/components/ui/card";
import { FileText, IndianRupee, Calendar } from "lucide-react";

export default function BillEntryPurchase() {
  const totalBillEntry = 4;
  const totalValue = 2884389.2;
  const thisMonth = 4;

  const tableData = Array.from({ length: 8 }, (_, index) => ({
    id: index + 1,
    voucherNumber: "-",
    unit: "-",
    shade: "-",
    lotNo: "-",
    millName: "-",
    productQty: "-",
    rate: "-",
    gstPercent: "-",
    gRate: "-",
    amount: "-",
    mode: "-",
    receivingDate: "-",
  }));

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

      {/* Table (no grid lines, full rounded, centered) */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700 rounded-xl">
          <thead className="bg-slate-800 text-white text-xs uppercase">
            <tr>
              {[
                "Voucher Number", "Unit", "Shade", "Lot No.", "Mill Name", "Product Qty",
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
            {tableData.map((row, idx) => (
              <tr key={row.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                {Object.values(row).slice(1).map((value, colIdx) => (
                  <td key={colIdx} className="px-4 py-4 text-center text-gray-700">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

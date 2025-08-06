import {
  CircleDollarSign,
  FileText,
  PackageCheck,
  ShoppingCart,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AllPOs() {
  const cards = [
    {
      title: "Total POs",
      value: 4,
      icon: <ShoppingCart className="text-[#2f3c4f]" />,
    },
    {
      title: "Active POs",
      value: 4,
      icon: <FileText className="text-green-600" />,
    },
    {
      title: "Total Value",
      value: "₹28,84,389.2",
      icon: <CircleDollarSign className="text-yellow-500" />,
    },
    {
      title: "This Month",
      value: 4,
      icon: <PackageCheck className="text-blue-600" />,
    },
  ];

  const tableHeaders = ["PO Number", "Vendor", "Receiving Date", "Amount"];
  const tableData = Array(7).fill({ number: "-", vendor: "-", date: "-", amount: "-" });

  return (
    <div className="p-4">
      {/* Breadcrumb */}
      {/* <h2 className="text-xl font-semibold text-gray-700 mb-1">Dashboard</h2>
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Total PO’s</h1> */}
      <div className="text-xl font-semibold text-gray-800 mb-4">
        Dashboard <span className="text-blue-600">› Total PO’s</span>
      </div>

      {/* Cards */}
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

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full min-w-[600px] text-sm text-left">
          <thead className="bg-[#2f3c4f] text-white">
            <tr>
              {tableHeaders.map((header, i) => (
                <th key={i} className="px-6 py-3 font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, i) => (
              <tr key={i} className="even:bg-gray-50">
                <td className="px-6 py-3">{row.number}</td>
                <td className="px-6 py-3">{row.vendor}</td>
                <td className="px-6 py-3">{row.date}</td>
                <td className="px-6 py-3">{row.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

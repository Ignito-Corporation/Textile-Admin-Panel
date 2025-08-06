import React, { useState, useEffect } from "react";
import { PlusCircle } from 'lucide-react';

const vendorData = {
  "PO-202507-214": {
    vendorName: "ABC Textile Mills",
    address: "123 Cotton St, Mumbai",
    state: "Maharashtra",
    phone: "022-12345678",
    products: [
      { productName: "Cotton Roll", unit: "kg", shade: "White", lot: "LT001", issueQty: 100, receivedQty: 80, process: "Dyeing" },
      { productName: "Cotton Sheet", unit: "m", shade: "Blue", lot: "LT002", issueQty: 50, receivedQty: 50, process: "Knitting" },
    ],
  },
  "PO-202507-215": {
    vendorName: "Premium Cotton Suppliers",
    address: "45 Silk Rd, Delhi",
    state: "Delhi",
    phone: "011-87654321",
    products: [
      { productName: "Premium Cotton", unit: "kg", shade: "Off White", lot: "LT003", issueQty: 200, receivedQty: 190, process: "Manual" },
    ],
  },
  "PO-202507-216": {
    vendorName: "Silk Weavers Ltd",
    address: "78 Weave Ave, Chennai",
    state: "Tamil Nadu",
    phone: "044-11223344",
    products: [
      { productName: "Silk Roll", unit: "kg", shade: "Red", lot: "LT004", issueQty: 120, receivedQty: 100, process: "Knitting" },
      { productName: "Silk Yarn", unit: "m", shade: "Green", lot: "LT005", issueQty: 90, receivedQty: 90, process: "Knitting" },
    ],
  },
};

export default function CreateInEntry() {
  const [voucherNumber, setVoucherNumber] = useState("");
  const [date, setDate] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const entry = vendorData[voucherNumber];
    if (entry) {
      setProducts(entry.products);
    } else {
      setProducts([]);
    }
  }, [voucherNumber]);

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
  <div className="bg-white shadow-md rounded-md overflow-hidden">
    {/* Header */}
    <div className="bg-[#2f3c4f] text-white px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <PlusCircle size={20} className="text-white" />
        <h2 className="text-lg font-semibold">Create In Entry</h2>
      </div>
      <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-1 rounded text-sm">← Back</button>
    </div>

    {/* Form Section */}
    <div className="p-6">
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Voucher Number</label>
          <input
            type="text"
            placeholder="Input to be displayed here"
            value={voucherNumber}
            onChange={(e) => setVoucherNumber(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded text-sm"
          />
        </div>
      </div>

      <button className="mb-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded text-sm">
        Save
      </button>

      {/* Table Section */}
      <div className="overflow-x-auto border rounded shadow-sm">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#2f3c4f] text-white">
            <tr>
              {[
                "Product Name",
                "Unit",
                "Lot no.",
                "Shade",
                "Issue Qty.",
                "Received Qty.",
                "Process",
              ].map((header) => (
                <th key={header} className="px-4 py-2 font-medium whitespace-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  No data available. Enter a valid voucher number.
                </td>
              </tr>
            ) : (
              products.map((p, idx) => (
                <tr key={idx} className="even:bg-gray-50">
                  <td className="px-4 py-2">{p.productName}</td>
                  <td className="px-4 py-2">{p.unit}</td>
                  <td className="px-4 py-2">{p.lot}</td>
                  <td className="px-4 py-2">{p.shade}</td>
                  <td className="px-4 py-2">{p.issueQty}</td>
                  <td className="px-4 py-2">{p.receivedQty}</td>
                  <td className="px-4 py-2">{p.process}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
  );
}


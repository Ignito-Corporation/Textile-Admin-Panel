import React, { useState, useEffect } from "react";
import { PlusCircle } from 'lucide-react';

export default function CreateInEntry() {
  const [voucherNumber, setVoucherNumber] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch suborder data when voucher number changes
  useEffect(() => {
    if (voucherNumber) {
      fetchSubOrderData(voucherNumber);
    } else {
      setProducts([]);
    }
  }, [voucherNumber]);

  const fetchSubOrderData = async (voucher) => {
  setLoading(true);
  setError("");
  try {
    const response = await fetch(`http://localhost:8080/api/jobwork/suborder/voucher/${voucher}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Suborder not found - please check the voucher number");
      }
      throw new Error(`Server error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Only process OUT entries
    if (data.entry_type !== "OUT") {
      throw new Error("Only OUT entries can be marked as IN");
    }
    
    // Prepare products for IN entry
    const processedProducts = data.products.map(p => ({
      ...p,
      receivedQty: p.quantity, // Default to original issued quantity
    }));
    
    setProducts(processedProducts);
  } catch (err) {
    setError(err.message);
    setProducts([]);
  } finally {
    setLoading(false);
  }
};

  const handleQuantityChange = (index, value) => {
    const newProducts = [...products];
    newProducts[index].receivedQty = parseFloat(value) || 0;
    setProducts(newProducts);
  };

  const handleSave = async () => {
    if (!voucherNumber) {
        setError("Please enter a voucher number");
        return;
    }
    
    if (products.length === 0) {
        setError("No products found for this voucher");
        return;
    }

    setLoading(true);
    try {
        // First get the original suborder to get parent ID
        const suborderRes = await fetch(`http://localhost:8080/api/jobwork/suborder/voucher/${voucherNumber}`);
        if (!suborderRes.ok) {
            throw new Error("Failed to fetch original suborder");
        }
        const originalSuborder = await suborderRes.json();

        // Prepare the IN entry payload
        // const inEntryPayload = {
        //     parent_jobwork_id: originalSuborder.parent_jobwork_id,
        //     voucher_number: `IN-${voucherNumber}`,
        //     entry_type: "IN",
        //     process: originalSuborder.process,
        //     vendor_id: originalSuborder.vendor_id,
        //     vendor_name: originalSuborder.vendor_name,
        //     products: products.map(p => ({
        //         product_id: p.product_id,
        //         product_name: p.product_name,
        //         unit: p.unit,
        //         lot_no: p.lot_no,
        //         shade: p.shade,
        //         quantity: p.receivedQty,
        //     })),
        // };

        // // 1) Create the IN entry
        // const createResponse = await fetch('http://localhost:8080/api/jobwork/suborder', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(inEntryPayload),
        // });

        // if (!createResponse.ok) {
        //     const errorData = await createResponse.json();
        //     throw new Error(errorData.error || "Failed to create IN entry");
        // }

        // 2) Update the OUT entry's is_in status
        const updateResponse = await fetch(`http://localhost:8080/api/jobwork/suborder/${voucherNumber}/is_in`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!updateResponse.ok) {
            throw new Error("Failed to update OUT entry status");
        }

        alert("IN entry created successfully and OUT entry updated!");
        setVoucherNumber("");
        setProducts([]);
        setError("");
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
};

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
          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Voucher Number</label>
              <input
                type="text"
                placeholder="Enter OUT voucher number"
                value={voucherNumber}
                onChange={(e) => setVoucherNumber(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded text-sm"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Received Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded text-sm"
                disabled={loading}
              />
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={loading}
            className="mb-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded text-sm disabled:bg-gray-400"
          >
            {loading ? "Processing..." : "Save"}
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
                    "Issued Qty.",
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
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-gray-500">
                      {voucherNumber ? "No products found or invalid voucher" : "Enter a voucher number to load products"}
                    </td>
                  </tr>
                ) : (
                  products.map((p, idx) => (
                    <tr key={idx} className="even:bg-gray-50">
                      <td className="px-4 py-2">{p.product_name}</td>
                      <td className="px-4 py-2">{p.unit}</td>
                      <td className="px-4 py-2">{p.lot_no || "-"}</td>
                      <td className="px-4 py-2">{p.shade || "-"}</td>
                      <td className="px-4 py-2">{p.quantity}</td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          min="0"
                          max={p.quantity}
                          value={p.receivedQty}
                          onChange={(e) => handleQuantityChange(idx, e.target.value)}
                          className="w-20 border border-gray-300 px-2 py-1 rounded text-sm"
                          disabled={loading}
                        />
                      </td>
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
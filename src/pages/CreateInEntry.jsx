'use client';

import React, { useState, useEffect } from "react";
import { PlusCircle } from 'lucide-react';

export default function CreateInEntry() {
  const [identifier, setIdentifier] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [processType, setProcessType] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [parentJobWorkId, setParentJobWorkId] = useState("");

  // Fetch suborder data when identifier changes
  useEffect(() => {
    // Debounce the fetch call to avoid too many requests
    const debounceTimeout = setTimeout(() => {
      if (identifier) {
        fetchSubOrderData(identifier);
      } else {
        setProducts([]);
        setProcessType("");
        setVendorName("");
        setParentJobWorkId("");
        setError(""); // Clear error when identifier is cleared
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(debounceTimeout); // Cleanup on unmount or identifier change
  }, [identifier]);

  const fetchSubOrderData = async (identifier) => {
    setLoading(true);
    setError("");
    try {
      let url = `http://localhost:8080/api/jobwork/getjobworkin/${identifier}`;
      
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Populate common fields regardless of identifier type
      setParentJobWorkId(data.parent_jobwork_id || '');
      setVendorName(data.vendor_name || '');
      setProcessType(data.process || '');

      // Transform products based on the response structure from GetProductsForInEntry
      const transformedProducts = data.products?.map(p => ({
        product_id: p.product_id,
        product_name: p.product_name,
        unit: p.unit,
        lot_no: p.lot_no || "",
        shade: p.shade || "",
        issuedQty: p.issued_qty,        // Original quantity issued out (from backend)
        receivedQty: p.available_qty,   // Default to available for input (can be edited)
        maxQty: p.available_qty         // Max quantity that can be received (from backend)
      })) || [];
      
      setProducts(transformedProducts);

      if (transformedProducts.length === 0) {
        setError("No products available for IN entry with this identifier.");
      }

    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
      setProducts([]);
      setProcessType("");
      setVendorName("");
      setParentJobWorkId("");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (index, value) => {
    const newProducts = [...products];
    let numericValue = parseFloat(value) || 0;
    
    // Ensure received quantity is not negative
    if (numericValue < 0) {
      numericValue = 0;
    }
    // Ensure received quantity does not exceed the maximum allowed (available_qty from backend)
    if (numericValue > newProducts[index].maxQty) {
      numericValue = newProducts[index].maxQty;
    }
    
    newProducts[index].receivedQty = numericValue;
    setProducts(newProducts);
  };

  const handleSave = async () => {
    setError(""); // Clear previous errors
    
    if (!identifier) {
      setError("Please enter a PO number or voucher number.");
      return;
    }
    
    if (products.length === 0) {
      setError("No products to save. Please load products first.");
      return;
    }

    // Filter out products with 0 received quantity or those not being received
    const productsToReceive = products.filter(p => p.receivedQty > 0);

    if (productsToReceive.length === 0) {
        setError("Please enter a received quantity greater than 0 for at least one product.");
        return;
    }

    // Validate quantities before sending
    for (const product of productsToReceive) {
      if (product.receivedQty > product.maxQty) {
        setError(`Received quantity for ${product.product_name} cannot exceed the available quantity (${product.maxQty}).`);
        return;
      }
    }

    setLoading(true);
    
    try {
      // The backend 'UpdateSubOrderIsInStatus' expects the identifier (PO or voucher)
      // in the URL and an array of products with their product_id and the quantity received.
      const response = await fetch(`http://localhost:8080/api/jobwork/suborder/is-in/${identifier}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Map to product_id and quantity (which is the receivedQty from frontend state)
          products: productsToReceive.map(p => ({
            product_id: p.product_id,
            quantity: p.receivedQty // This is the quantity being marked as 'IN'
          })),
          // Backend UpdateSubOrderIsInStatus does NOT expect vendor_id or vendor_name in the payload
          // It derives it from the parent order or suborder.
          // You might need to add other fields if your backend expects them here.
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to update entry status.");
      }
      
      alert(`Entry updated successfully! Voucher: ${result.voucher_number}. ${result.order_completed ? "Parent order marked as complete." : ""}`);
      
      // Reset form
      setIdentifier("");
      setProducts([]);
      setProcessType("");
      setVendorName("");
      setParentJobWorkId("");
      setDate(new Date().toISOString().split('T')[0]); // Reset date to current
    } catch (err) {
      console.error("Error saving:", err);
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">PO Number or Voucher</label>
              <input
                type="text"
                placeholder="Enter PO (starts with PO) or Voucher (starts with OUT)"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
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
            <div>
              <label className="block text-sm font-medium mb-1">Vendor Name</label>
              <input
                type="text"
                value={vendorName}
                readOnly
                className="w-full border border-gray-300 px-3 py-2 rounded text-sm bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Process Type</label>
              <input
                type="text"
                value={processType}
                readOnly
                className="w-full border border-gray-300 px-3 py-2 rounded text-sm bg-gray-100"
              />
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={loading || products.length === 0 || products.every(p => p.receivedQty <= 0)}
            className="mb-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded text-sm disabled:bg-gray-400"
          >
            {loading ? "Processing..." : "Mark as Received"}
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
                    "Issued Qty.",     // Original quantity sent OUT by this suborder or available from parent
                    "Received Qty.",   // Quantity being marked IN in this transaction (user input)
                    "Max Available",   // Maximum quantity that can be received (actual available for IN)
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
                    <td colSpan={8} className="text-center py-4 text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-gray-500">
                      {identifier ? "No products found or invalid identifier" : "Enter a PO number or voucher number to load products"}
                    </td>
                  </tr>
                ) : (
                  products.map((p, idx) => (
                    <tr key={p.product_id || idx} className="even:bg-gray-50">
                      <td className="px-4 py-2">{p.product_name}</td>
                      <td className="px-4 py-2">{p.unit}</td>
                      <td className="px-4 py-2">{p.lot_no || "-"}</td>
                      <td className="px-4 py-2">{p.shade || "-"}</td>
                      <td className="px-4 py-2">{p.issuedQty ?? '-'}</td> {/* Displaying issuedQty from backend */}
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          min="0"
                          max={p.maxQty} // Set max attribute for native HTML validation
                          step="0.01"
                          value={p.receivedQty}
                          onChange={(e) => handleQuantityChange(idx, e.target.value)}
                          className="w-20 border border-gray-300 px-2 py-1 rounded text-sm"
                          disabled={loading}
                        />
                      </td>
                      <td className="px-4 py-2">{p.maxQty ?? '-'}</td> {/* Displaying maxQty from backend */}
                      <td className="px-4 py-2">{processType}</td>
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

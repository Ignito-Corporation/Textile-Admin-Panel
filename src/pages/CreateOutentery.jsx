'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { CirclePlus } from 'lucide-react';

const CreateOutEntry = () => {
  const [entryType, setEntryType] = useState('');
  const [vendor, setVendor] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [products, setProducts] = useState([]);
  const [issuedQuantities, setIssuedQuantities] = useState({});
  const [poNumber, setPoNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [FpoNum, setFpoNum] = useState('');
  const [parentJobWorkId, setParentJobWorkId] = useState(''); // State to hold parent JobWorkOrder ID

  // Fetch vendor and products when PO number changes and entry type is set
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (!entryType || !poNumber) {
        setProducts([]);
        setIssuedQuantities({}); // Clear issued quantities
        setVendor('');
        setVendorName('');
        setParentJobWorkId(''); 
        return;
      }

      const fetchData = async () => {
        setIsLoading(true);
        try {
          let url = '';
          if (entryType === 'Knitting') {
            url = `http://localhost:8080/api/jobwork/available-knitting/${poNumber}`;
          } else {
            url = `http://localhost:8080/api/jobwork/available-dying/${poNumber}`;
          }

          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log("Fetched data:", data);

          if (entryType === 'Dyeing') {
            if (data) {
              setParentJobWorkId(data.parent_jobwork_id || '');
              setVendor(data.vendor_id || '');
              setVendorName(data.vendor_name || '');
              
              const transformedProducts = data.products?.map(product => ({
                product_id: product.product_id,
                product_name: product.product_name,
                unit: product.unit,
                shade: product.shade,
                lot_no: product.lot_no,
                // ⭐ FIX for Dyeing: Use available_qty for remaining and max_qty directly
                remaining_qty: product.available_qty, 
                max_qty: product.max_qty 
              })) || [];
              
              setProducts(transformedProducts);
            }
          } else { // entryType === 'Knitting'
            if (data && data.bill && data.bill.length > 0) { // Check for the new 'bill' structure
              const billData = data.bill[0]; // Assuming only one bill per PO for simplicity
              
              // Set vendor details from the bill
              setVendor(billData.vendor.vendor_id || '');
              setVendorName(billData.vendor.vendor_name || '');
              
              const totalRemainingFromBackend = data.remaining_qty; // This is the aggregated remaining_qty
              
              const transformedProducts = billData.products?.map(product => {
                let displayedRemainingQty = product.quantity; // Default to PurchaseBill quantity
                let displayedMaxQty = product.quantity;      // Default to PurchaseBill quantity

                // ⭐ FIX for Knitting: Use aggregated remaining_qty if it's less than product.quantity
                // This heuristic works best for single-product bills where `data.remaining_qty` applies to that one product.
                if (totalRemainingFromBackend !== undefined && 
                    totalRemainingFromBackend < product.quantity &&
                    billData.products.length === 1 
                ) {
                    displayedRemainingQty = totalRemainingFromBackend;
                    // MaxQty should still reflect the original total from Purchase Bill as ExpectedQty
                    // in this scenario, as the JWO 'ExpectedQty' is derived from it.
                    displayedMaxQty = product.quantity; 
                } else if (billData.products.length > 1 && totalRemainingFromBackend !== undefined) {
                    // If multiple products, and totalRemainingFromBackend is less than *total* purchase quantity,
                    // a more complex distribution logic might be needed here if per-product remaining is critical.
                    // For now, if multiple products, we default to showing individual purchase quantities.
                    // Or, if there is a way to get JWO per-product remaining, it should be done in backend API.
                    // For this fix, stick to purchase bill quantity if complex JWO merging isn't provided.
                }

                return {
                  product_id: product.product_id, 
                  product_name: product.product_name,
                  unit: product.unit,
                  shade: product.shade || '-', 
                  lot_no: product.lot_no || '-', 
                  max_qty: displayedMaxQty,       // Dynamically set based on logic
                  remaining_qty: displayedRemainingQty, // Dynamically set based on logic
                  mill_name: product.mill_name || '-',
                  rate: product.rate || 0,
                  gst_percent: product.gst_percent || 0,
                  amount: product.amount || 0,
                  gst_amount: product.gst_amount || 0, 
                  delivery_status: '-', 
                };
              }) || [];
              
              setProducts(transformedProducts);

            } else {
              setProducts([]);
              setVendor('');
              setVendorName('');
              setParentJobWorkId('');
            }
          }
        } catch (err) {
          console.error('Error fetching data:', err);
          setProducts([]);
          setIssuedQuantities({}); 
          setVendor('');
          setVendorName('');
          setParentJobWorkId('');
          alert(`Error: ${err.message}`);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [entryType, poNumber]);

  const handleQtyChange = (productId, value, remaining) => {
    let val = parseFloat(value) || 0;
    if (val < 0) val = 0;
    if (val > remaining) val = remaining; 
    setIssuedQuantities(prev => ({
      ...prev,
      [productId]: val,
    }));
  };

  const handleSave = async () => {
    const selectedProducts = products
      .filter(p => issuedQuantities[p.product_id] > 0)
      .map(p => ({
        product_id: p.product_id,
        product_name: p.product_name,
        unit: p.unit,
        lot_no: p.lot_no || '',
        shade: p.shade || '',
        quantity: issuedQuantities[p.product_id], // This is the 'issued' quantity
        remaining_qty: p.remaining_qty, // Pass the original remaining_qty for backend validation
        max_qty: p.max_qty // Ensure max_qty is carried into the selectedProducts array
      }));

    if (!vendorName) {
      alert('Please select a vendor (should be auto-filled with PO number)');
      return;
    }

    if (selectedProducts.length === 0) {
      alert('Please enter at least one issued quantity');
      return;
    }

    // Validate quantities don't exceed remaining
    for (const product of selectedProducts) {
      if (product.quantity > product.remaining_qty) {
        alert(`Cannot issue more than remaining quantity for ${product.product_name}`);
        return;
      }
    }

    try {
      let currentParentJobWorkId = parentJobWorkId;

      if (entryType === 'Knitting') {
        if (!currentParentJobWorkId) { 
          const parentOrderResponse = await fetch('http://localhost:8080/api/jobwork/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              po_number: poNumber || "", 
              purchase_bill_id: null, 
              products: selectedProducts.map(p => ({
                product_id: p.product_id,
                product_name: p.product_name,
                unit: p.unit,
                expected_qty: p.max_qty 
              }))
            }),
          });

          const parentOrderData = await parentOrderResponse.json();
          if (!parentOrderResponse.ok) {
            throw new Error(parentOrderData.error || 'Failed to create parent order');
          }
          currentParentJobWorkId = parentOrderData.order_id;
          console.log('Created new parent order:', currentParentJobWorkId);
        }
      }

      if (entryType === 'Dyeing' && !currentParentJobWorkId) {
        alert('Missing parent job work ID for dyeing process. Please ensure the PO number is correct.');
        return;
      }

      const subOrderResponse = await fetch('http://localhost:8080/api/jobwork/suborder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parent_jobwork_id: currentParentJobWorkId,
          entry_type: 'OUT',
          process: entryType,
          vendor_id: vendor,
          vendor_name: vendorName,
          products: selectedProducts,
          fpo_number: FpoNum,
          remarks: null,
          created_by: "Vendor",
        }),
      });

      const subOrderData = await subOrderResponse.json();
      if (!subOrderResponse.ok) {
        throw new Error(subOrderData.error || 'Failed to create suborder');
      }

      console.log('Saved:', subOrderData);
      alert('Out Entry created successfully!');
      // Reset form fields after successful save
      setIssuedQuantities({});
      setProducts([]);
      setPoNumber('');
      setVendor('');
      setVendorName('');
      setFpoNum('');
      setParentJobWorkId('');
      setEntryType('');
    } catch (err) {
      console.error('Error saving:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const getColSpan = () => {
    if (entryType === 'Knitting') {
      return 9; 
    } else if (entryType === 'Dyeing') {
      return 9; 
    }
    return 7; 
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-[#2C3E50] text-white px-6 py-4 rounded-t-md shadow">
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <CirclePlus className="w-6 h-6 text-white bg-[#2C3E50] rounded-full" />
          Create Out Entry
        </h1>
        <Button variant="secondary">← Back</Button>
      </div>

      {/* Form Fields */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Out Entry Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Entry Type */}
          <div>
            <Label className="mb-1 block">Entry Type</Label>
            <Select onValueChange={setEntryType} value={entryType}>
              <SelectTrigger>
                <SelectValue placeholder="Select Entry Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Knitting">Knitting</SelectItem>
                <SelectItem value="Dyeing">Dyeing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* PO Number */}
          <div>
            <Label className="mb-1 block">PO Number</Label>
            <Input 
              placeholder="Enter PO Number" 
              value={poNumber}
              onChange={(e) => setPoNumber(e.target.value)}
              disabled={!entryType}
            />
          </div>

          {/* Voucher Number (still placeholder, not implemented in logic) */}
          <div>
            <Label className="mb-1 block">Voucher Number</Label>
            <Input placeholder="Auto-generated or enter manually" />
          </div>

          {/* Issued Date (still placeholder, not implemented in logic) */}
          <div>
            <Label className="mb-1 block">Issued Date</Label>
            <Input type="date" />
          </div>

          {/* Vendor Name (read-only as it comes from PO) */}
          <div>
            <Label className="mb-1 block">Vendor Name</Label>
            <Input 
              placeholder="Will auto-populate from PO" 
              value={vendorName}
              readOnly
            />
          </div>

          {/* FPO Number */}
          <div>
            <Label className="mb-1 block">FPO Number</Label>
            <Input placeholder="Enter FPO Number" onChange={(e) => setFpoNum(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Products Table */}
      {entryType && (
        <div className="mt-8 overflow-x-auto rounded-md border">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-[#2C3E50] text-white text-sm">
              <tr>
                <th className="py-2 px-4 text-center">Product Name</th>
                <th className="py-2 px-4 text-center">Unit</th>
                {/* Max Qty header for both Knitting and Dyeing */}
                <th className="py-2 px-4 text-center">Max Qty</th>
                
                {/* Lot No and Shade are always displayed as they can be present in PO data */}
                <th className="py-2 px-4 text-center">Lot No.</th>
                <th className="py-2 px-4 text-center">Shade</th>

                <th className="py-2 px-4 text-center">Remaining Qty</th>
                <th className="py-2 px-4 text-center">Issued Qty</th>
                <th className="py-2 px-4 text-center">Process</th>
                {entryType === 'Knitting' && (
                  <th className="py-2 px-4 text-center">Delivery Status</th>
                )}
                <th className="py-2 px-4 text-center">Remove</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={getColSpan()} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((p, i) => (
                  <tr
                    key={p.product_id || i}
                    className={i % 2 === 0 ? 'bg-white' : 'bg-[#f8f8f8]'}
                  >
                    <td className="py-2 px-4 text-center text-sm">{p.product_name || '-'}</td>
                    <td className="py-2 px-4 text-center text-sm">{p.unit || '-'}</td>
                    <td className="py-2 px-4 text-center text-sm">{p.max_qty ?? '-'}</td> {/* Display Max Qty */}
                    
                    <td className="py-2 px-4 text-center text-sm">{p.lot_no || '-'}</td>
                    <td className="py-2 px-4 text-center text-sm">{p.shade || '-'}</td>
                    
                    <td className="py-2 px-4 text-center text-sm">{p.remaining_qty ?? '-'}</td>
                    <td className="py-2 px-4 text-center">
                      <Input
                        type="number"
                        value={issuedQuantities[p.product_id] || ''}
                        onChange={(e) =>
                          handleQtyChange(p.product_id, e.target.value, p.remaining_qty)
                        }
                        className="w-24 mx-auto"
                      />
                    </td>
                    <td className="py-2 px-4 text-center text-sm">{entryType}</td>
                    {entryType === 'Knitting' && (
                      <td className="py-2 px-4 text-center text-sm">{p.delivery_status || '-'}</td>
                    )}
                    <td className="py-2 px-4 text-center">
                      <button
                        onClick={() =>
                          setProducts(prev => prev.filter(prod => prod.product_id !== p.product_id))
                        }
                        className="text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={getColSpan()}
                    className="text-center py-4 text-muted-foreground"
                  >
                    {poNumber ? 'No products available for this PO number' : 'Enter a PO number to see products'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Save Button */}
      <div className="mt-8 text-center">
        <Button
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 text-md rounded"
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
};

export default CreateOutEntry;

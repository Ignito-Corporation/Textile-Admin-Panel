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
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [issuedQuantities, setIssuedQuantities] = useState({});
  const [poNumber, setPoNumber] = useState('');

  // Fetch vendors
  useEffect(() => {
    fetch('http://localhost:8080/api/master/vendors')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const mapped = data
            .filter(v => v?.id)
            .map(v => ({
              id: String(v.id),
              name: v.name || 'Unnamed Vendor',
            }));
          setVendors(mapped);
        } else {
          console.warn('Vendors API did not return an array:', data);
          setVendors([]);
        }
      })
      .catch(err => {
        console.error('Error fetching vendors:', err);
        setVendors([]);
      });
  }, []);

  // Fetch products whenever entry type or vendor changes
  useEffect(() => {
    if (!entryType) {
      setProducts([]);
      return;
    }

    let url = '';

    if (entryType === 'Knitting') {
      if (vendor) {
        const vendorName = encodeURIComponent(
          vendors.find(v => v.id === vendor)?.name || ''
        );
        url = `http://localhost:8080/api/jobwork/available-knitting?vendor_name=${vendorName}`;
      } else {
        url = 'http://localhost:8080/api/jobwork/available-knitting';
      }
    } else {
      url = 'http://localhost:8080/api/jobwork/available-dying';
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.warn(`Unexpected ${entryType} products response:`, data);
          setProducts([]);
        }
      })
      .catch(err => {
        console.error(`Error fetching ${entryType} products:`, err);
        setProducts([]);
      });
  }, [entryType, vendor, vendors]);

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
      quantity: issuedQuantities[p.product_id],
      remaining_qty: p.remaining_qty // Include remaining quantity in the payload
    }));

  if (!vendor) {
    alert('Please select a vendor');
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
    let parentOrderId;
    
    // If PO number is provided, try to find existing parent order
    if (poNumber) {
      try {
        const response = await fetch(`http://localhost:8080/api/jobwork/order/${poNumber}`);
        if (response.ok) {
          const existingOrder = await response.json();
          parentOrderId = existingOrder._id || existingOrder.id;
          console.log('Found existing parent order:', parentOrderId);
        } else if (response.status === 404) {
          console.log('No existing order found for PO:', poNumber);
          // Proceed to create new order
        } else {
          throw new Error(`Failed to check for existing order: ${response.statusText}`);
        }
      } catch (err) {
        console.error('Error checking for existing order:', err);
        // Continue with creating new order even if check fails
      }
    }

    // If no existing parent order found, create a new one
    if (!parentOrderId) {
      const parentOrderResponse = await fetch('http://localhost:8080/api/jobwork/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          po_number: poNumber || undefined,
          purchase_bill_id: null,
          products: selectedProducts.map(p => ({
            product_id: p.product_id,
            product_name: p.product_name,
            unit: p.unit,
            expected_qty: p.remaining_qty // Use remaining_qty as expected_qty for new orders
          }))
        }),
      });

      const parentOrderData = await parentOrderResponse.json();
      if (!parentOrderResponse.ok) {
        throw new Error(parentOrderData.error || 'Failed to create parent order');
      }

      parentOrderId = parentOrderData.order_id;
      console.log('Created new parent order:', parentOrderId);
    }

    // Create the suborder
    const subOrderResponse = await fetch('http://localhost:8080/api/jobwork/suborder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        parent_jobwork_id: parentOrderId,
        entry_type: 'OUT',
        process: entryType,
        vendor_id: vendor,
        vendor_name: vendors.find(v => v.id === vendor)?.name || '',
        products: selectedProducts,
      }),
    });

    const subOrderData = await subOrderResponse.json();
    if (!subOrderResponse.ok) {
      throw new Error(subOrderData.error || 'Failed to create suborder');
    }

    console.log('Saved:', subOrderData);
    alert('Out Entry created successfully!');
    setIssuedQuantities({});
  } catch (err) {
    console.error('Error saving:', err);
    alert(`Error: ${err.message}`);
  }
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
            <Select onValueChange={setEntryType}>
              <SelectTrigger>
                <SelectValue placeholder="Select Entry Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Knitting">Knitting</SelectItem>
                <SelectItem value="Dying">Dying</SelectItem>
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
            />
          </div>

          {/* Voucher Number */}
          <div>
            <Label className="mb-1 block">Voucher Number</Label>
            <Input placeholder="Auto-generated or enter manually" />
          </div>

          {/* Issued Date */}
          <div>
            <Label className="mb-1 block">Issued Date</Label>
            <Input type="date" />
          </div>

          {/* Vendor Name */}
          <div>
            <Label className="mb-1 block">Vendor Name</Label>
            <Select onValueChange={setVendor}>
              <SelectTrigger>
                <SelectValue placeholder="Select Vendor" />
              </SelectTrigger>
              <SelectContent>
                {vendors.map(v => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* FPO Number */}
          <div>
            <Label className="mb-1 block">FPO Number</Label>
            <Input placeholder="Enter FPO Number" />
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
    {entryType === 'Dying' && (
      <>
        <th className="py-2 px-4 text-center">Lot No.</th>
        <th className="py-2 px-4 text-center">Shade</th>
      </>
    )}
    <th className="py-2 px-4 text-center">Total Qty</th>
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
              {products.length > 0 ? (
                products.map((p, i) => (
                  <tr
                    key={p.product_id || i}
                    className={i % 2 === 0 ? 'bg-white' : 'bg-[#f8f8f8]'}
                  >
                    <td className="py-2 px-4 text-center text-sm">{p.product_name || '-'}</td>
                    <td className="py-2 px-4 text-center text-sm">{p.unit || '-'}</td>
                    {entryType === 'Dying' && (
                      <>
                        <td className="py-2 px-4 text-center text-sm">{p.lot_no || '-'}</td>
                        <td className="py-2 px-4 text-center text-sm">{p.shade || '-'}</td>
                      </>
                    )}
                    <td className="py-2 px-4 text-center text-sm">{p.remaining_qty ?? '-'}</td>
                    <td className="py-2 px-4 text-center text-sm">{p.remaining_qty ?? p.expected_qty}</td>
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
                    colSpan={entryType === 'Knitting' ? 8 : 7}
                    className="text-center py-4 text-muted-foreground"
                  >
                    No products available
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
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default CreateOutEntry;
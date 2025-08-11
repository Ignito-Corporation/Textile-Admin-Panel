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
  const [vendorName, setVendorName] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [issuedQuantities, setIssuedQuantities] = useState({});
  const [poNumber, setPoNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fpoNumber, setFpoNumber] = useState('');
  const [voucherNo, setVoucherNo] = useState('');
  const [dateOut, setDateOut] = useState(new Date().toISOString().split('T')[0]);

  // Fetch data when PO number changes
  useEffect(() => {
    const fetchBillData = async () => {
      if (!poNumber) {
        setAllProducts([]);
        setVendorName('');
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/purchase-bill/po/${poNumber}`);
        if (!response.ok) {
          if (response.status === 404) {
             alert('No bill found for this PO Number.');
             setAllProducts([]);
             setVendorName('');
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return;
        }
        const data = await response.json();
        console.log("Fetched Bill Data:", data);
        
        setVendorName(data?.vendor?.vendor_name || '');
        setAllProducts(data.products || []);

      } catch (err) {
        console.error('Error fetching bill data:', err);
        alert(`Error fetching bill data: ${err.message}`);
        setAllProducts([]);
        setVendorName('');
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
        fetchBillData();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [poNumber]);

  useEffect(() => {
    if (!entryType) {
      setFilteredProducts([]);
      return;
    }

    const filterLogic = (product) => {
      if (entryType === 'Knitting') {
        return product.knitting === false;
      }
      if (entryType === 'Dyeing') {
        return product.knitting === true;
      }
      return false;
    };

    const newFilteredProducts = allProducts.filter(filterLogic);
    setFilteredProducts(newFilteredProducts);
    setIssuedQuantities({});

  }, [entryType, allProducts]);


  const handleQtyChange = (index, value, maxQty) => {
    const val = parseFloat(value);
    if (isNaN(val) || val < 0) {
      setIssuedQuantities(prev => ({ ...prev, [index]: 0 }));
    } else if (val > maxQty) {
      alert(`Issued quantity cannot be more than Available Qty (${maxQty})`);
      setIssuedQuantities(prev => ({ ...prev, [index]: maxQty }));
    } else {
      setIssuedQuantities(prev => ({ ...prev, [index]: val }));
    }
  };


  const handleSave = async () => {
    const productsToSave = filteredProducts
      .map((p, index) => ({ ...p, index }))
      .filter(p => issuedQuantities[p.index] > 0)
      .map(p => ({
        product_id: p.product_id,
        product_name: p.product_name,
        unit: p.unit,
        lot_no: p.lot_no,
        shade: p.shade,
        mill_name: p.mill_name,
        issued_qty: issuedQuantities[p.index],
        max_qty: p.max_qty,
        rate: p.rate,
        gst_percent: p.gst_percent,
        amount: p.rate * issuedQuantities[p.index],
        gst_amount: (p.rate * issuedQuantities[p.index] * p.gst_percent) / 100,
      }));

    if (!vendorName) {
      alert('Please enter a valid PO number to fetch vendor details.');
      return;
    }
    if (productsToSave.length === 0) {
      alert('Please enter an issued quantity for at least one product.');
      return;
    }
    if (!fpoNumber) {
        alert('Please enter an FPO Number.');
        return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/jobwork/out-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          po_number: poNumber,
          process: entryType,
          vendor_name: vendorName,
          products: productsToSave,
          fpo_number: fpoNumber,
          voucher_no: voucherNo,
          date_out: dateOut,
          date_in: "",
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to save out entry');
      }

      alert('Out Entry created successfully!');
      setPoNumber('');
      setEntryType('');
      setAllProducts([]);
      setFilteredProducts([]);
      setIssuedQuantities({});
      setVendorName('');
      setFpoNumber('');
      setVoucherNo('');

    } catch (err) {
      console.error('Error saving:', err);
      alert(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex items-center justify-between bg-[#2C3E50] text-white px-6 py-4 rounded-t-md shadow">
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <CirclePlus className="w-6 h-6" />
          Create Out Entry
        </h1>
        <Button variant="secondary">← Back</Button>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Out Entry Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label className="mb-1 block">PO Number</Label>
            <Input
              placeholder="Enter PO Number"
              value={poNumber}
              onChange={(e) => setPoNumber(e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-1 block">Entry Type</Label>
            <Select onValueChange={setEntryType} value={entryType} disabled={!poNumber}>
              <SelectTrigger>
                <SelectValue placeholder="Select Entry Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Knitting">Knitting</SelectItem>
                <SelectItem value="Dyeing">Dyeing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-1 block">Voucher Number</Label>
            <Input placeholder="Enter Voucher No." value={voucherNo} onChange={e => setVoucherNo(e.target.value)} />
          </div>
          <div>
            <Label className="mb-1 block">Issued Date</Label>
            <Input type="date" value={dateOut} onChange={e => setDateOut(e.target.value)} />
          </div>
          <div>
            <Label className="mb-1 block">Vendor Name</Label>
            <Input
              placeholder="Auto-populates from PO"
              value={vendorName}
              readOnly
              className="bg-gray-100"
            />
          </div>
          <div>
            <Label className="mb-1 block">FPO Number</Label>
            <Input placeholder="Enter FPO Number" value={fpoNumber} onChange={(e) => setFpoNumber(e.target.value)} />
          </div>
        </div>
      </div>

      {entryType && (
        <div className="mt-8 overflow-x-auto rounded-md border">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-[#2C3E50] text-white text-sm">
              <tr>
                <th className="py-2 px-4 text-center">Product Name</th>
                <th className="py-2 px-4 text-center">Lot No.</th>
                <th className="py-2 px-4 text-center">Shade</th>
                <th className="py-2 px-4 text-center">Available Qty</th>
                <th className="py-2 px-4 text-center">Max Qty</th>
                <th className="py-2 px-4 text-center">Unit</th>
                <th className="py-2 px-4 text-center">Issued Qty</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="7" className="text-center py-4">Loading...</td></tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((p, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#f8f8f8]'}>
                    <td className="py-2 px-4 text-center text-sm">{p.product_name}</td>
                    <td className="py-2 px-4 text-center text-sm">{p.lot_no}</td>
                    <td className="py-2 px-4 text-center text-sm">{p.shade}</td>
                    <td className="py-2 px-4 text-center text-sm">{p.quantity}</td>
                    <td className="py-2 px-4 text-center text-sm">{p.max_qty}</td>
                    <td className="py-2 px-4 text-center text-sm">{p.unit}</td>
                    <td className="py-2 px-4 text-center">
                      <Input
                        type="number"
                        value={issuedQuantities[i] || ''}
                        onChange={(e) => handleQtyChange(i, e.target.value, p.quantity)}
                        className="w-24 mx-auto"
                        max={p.quantity}
                        min="0"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted-foreground">
                    {poNumber ? `No products available for '${entryType}'` : 'Select an Entry Type'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8 text-center">
        <Button
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 text-md rounded"
          onClick={handleSave}
          disabled={isLoading || filteredProducts.length === 0}
        >
          {isLoading ? 'Saving...' : 'Save Out Entry'}
        </Button>
      </div>
    </div>
  );
};

export default CreateOutEntry;

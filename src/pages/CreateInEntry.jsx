'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CirclePlus } from 'lucide-react';

const CreateInEntry = () => {
  const [poNumber, setPoNumber] = useState('');
  const [outEntries, setOutEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [receivedQuantities, setReceivedQuantities] = useState({});

  useEffect(() => {
    const fetchOutEntries = async () => {
      if (!poNumber) {
        setOutEntries([]);
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/jobwork/out-entries/po/${poNumber}`);
        if (!response.ok) {
          if (response.status === 404) {
            alert('No out entries found for this PO Number.');
          } else {
            throw new Error('Failed to fetch out entries');
          }
          setOutEntries([]);
          return;
        }
        const data = await response.json();
        setOutEntries(data || []);
      } catch (error) {
        console.error("Error fetching out entries:", error);
        alert(error.message);
        setOutEntries([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchOutEntries();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [poNumber]);

  const handleQtyChange = (outEntryId, productLotNo, value, maxQty) => {
    const val = parseFloat(value);
    const key = `${outEntryId}-${productLotNo}`;

    if (isNaN(val) || val < 0) {
      setReceivedQuantities(prev => ({ ...prev, [key]: 0 }));
    } else if (val > maxQty) {
      alert(`Received quantity cannot be more than Issued Qty (${maxQty})`);
      setReceivedQuantities(prev => ({ ...prev, [key]: maxQty }));
    } else {
      setReceivedQuantities(prev => ({ ...prev, [key]: val }));
    }
  };

  const handleMarkAsReceived = async (outEntry, product) => {
    const key = `${outEntry.id}-${product.lot_no}`;
    const receivedQty = receivedQuantities[key];

    if (!receivedQty || receivedQty <= 0) {
      alert("Please enter a valid quantity to receive.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        out_entry_id: outEntry.id,
        product_id: product.product_id,
        product_name: product.product_name,
        unit: product.unit,
        shade: product.shade,
        lot_no: product.lot_no,
        process: outEntry.process,
        po_number: outEntry.po_number,
        received_qty: receivedQty,
      };

      const response = await fetch('http://localhost:8080/api/jobwork/receive-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to mark product as received.');
      }

      alert(result.message);
      // Refresh the data to show updated quantities
      const updatedEntries = outEntries.map(entry => {
        if (entry.id === outEntry.id) {
          const updatedProducts = entry.products.map(p => {
            if (p.lot_no === product.lot_no) {
              return { ...p, issued_qty: p.issued_qty - receivedQty };
            }
            return p;
          }).filter(p => p.issued_qty > 0); // Remove if fully received
          return { ...entry, products: updatedProducts };
        }
        return entry;
      }).filter(entry => entry.products.length > 0); // Remove entry if all products received

      setOutEntries(updatedEntries);
      setReceivedQuantities(prev => {
        const newQuantities = { ...prev };
        delete newQuantities[key];
        return newQuantities;
      });

    } catch (error) {
      console.error("Error marking as received:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex items-center justify-between bg-[#2C3E50] text-white px-6 py-4 rounded-t-md shadow">
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <CirclePlus className="w-6 h-6" />
          Create In Entry
        </h1>
        <Button variant="secondary">← Back</Button>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">In Entry Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label className="mb-1 block">PO Number</Label>
            <Input
              placeholder="Enter PO Number to load entries"
              value={poNumber}
              onChange={(e) => setPoNumber(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {isLoading ? (
          <p className="text-center">Loading...</p>
        ) : outEntries.length > 0 ? (
          outEntries.map(entry => (
            <div key={entry.id} className="overflow-x-auto rounded-md border">
              <div className="bg-gray-100 p-2 border-b">
                {/* FIX IS HERE */}
                <h3 className="font-semibold">Voucher: {entry.voucher_no} | Process: {entry.process} | Vendor: {entry.vendorname}</h3>
              </div>
              <table className="w-full table-auto border-collapse">
                <thead className="bg-[#2C3E50] text-white text-sm">
                  <tr>
                    <th className="py-2 px-4 text-center">Product Name</th>
                    <th className="py-2 px-4 text-center">Lot No.</th>
                    <th className="py-2 px-4 text-center">Shade</th>
                    <th className="py-2 px-4 text-center">Issued Qty</th>
                    <th className="py-2 px-4 text-center">Unit</th>
                    <th className="py-2 px-4 text-center">Receive Qty</th>
                    <th className="py-2 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {entry.products.map((p, i) => (
                    <tr key={`${entry.id}-${p.lot_no}`} className={i % 2 === 0 ? 'bg-white' : 'bg-[#f8f8f8]'}>
                      <td className="py-2 px-4 text-center text-sm">{p.product_name}</td>
                      <td className="py-2 px-4 text-center text-sm">{p.lot_no}</td>
                      <td className="py-2 px-4 text-center text-sm">{p.shade}</td>
                      <td className="py-2 px-4 text-center text-sm">{p.issued_qty}</td>
                      <td className="py-2 px-4 text-center text-sm">{p.unit}</td>
                      <td className="py-2 px-4 text-center">
                        <Input
                          type="number"
                          value={receivedQuantities[`${entry.id}-${p.lot_no}`] || ''}
                          onChange={(e) => handleQtyChange(entry.id, p.lot_no, e.target.value, p.issued_qty)}
                          className="w-24 mx-auto"
                          max={p.issued_qty}
                          min="0"
                        />
                      </td>
                      <td className="py-2 px-4 text-center">
                        <Button
                          size="sm"
                          onClick={() => handleMarkAsReceived(entry, p)}
                          disabled={isLoading}
                        >
                          Mark as Received
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            {poNumber ? 'No pending "Out" entries found for this PO.' : 'Enter a PO Number to begin.'}
          </p>
        )}
      </div>
    </div>
  );
};

export default CreateInEntry;
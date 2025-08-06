'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { CirclePlus } from 'lucide-react';


const CreateOutEntry = () => {
  const [entryType, setEntryType] = useState('');
  const [vendor, setVendor] = useState('');

  const entryTypes = ['Knitting', 'Dying'];
  const vendors = ['Vendor A', 'Vendor B', 'Vendor C'];

  const tableRows = Array.from({ length: 7 }, (_, i) => (
    <tr key={i} className="border-b text-center text-sm text-muted-foreground">
      <td className="py-2 px-4">-</td>
      <td className="py-2 px-4">-</td>
      <td className="py-2 px-4">-</td>
      <td className="py-2 px-4">-</td>
      <td className="py-2 px-4">-</td>
    </tr>
  ));

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-[#2C3E50] text-white px-6 py-4 rounded-t-md shadow">
        <h1 className="text-lg font-semibold flex items-center gap-2"><CirclePlus className="w-6 h-6 text-white bg-[#2C3E50] rounded-full  " />Create Out Entry</h1>
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
                {entryTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Voucher Number */}
          <div>
            <Label className="mb-1 block">Voucher Number</Label>
            <Input placeholder="Input to be displayed here" />
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
                {vendors.map((v) => (
                  <SelectItem key={v} value={v}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* FPO Number */}
          <div>
            <Label className="mb-1 block">FPO Number</Label>
            <Input placeholder="Input to be displayed here" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-8 overflow-x-auto rounded-md border">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-[#2C3E50] text-white text-sm">
            <tr>
              <th className="py-2 px-4 text-left">Product Name</th>
              <th className="py-2 px-4 text-left">Unit</th>
              <th className="py-2 px-4 text-left">Issue Qty</th>
              <th className="py-2 px-4 text-left">Process</th>
              <th className="py-2 px-4 text-left">Deliver Status</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {tableRows}
          </tbody>
        </table>
      </div>

      {/* Save Button */}
      <div className="mt-8 text-center">
        <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 text-md rounded">Save</Button>
      </div>
    </div>
  );
};

export default CreateOutEntry;

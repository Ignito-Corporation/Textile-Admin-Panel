import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import FramerIcon from '@/assets/Frame.png'; // Adjust path based on your structure

export default function StockConversionPage() {
  const [selectedTab, setSelectedTab] = useState("knitting");

  return (
    <div className="bg-white pl-2 pr-2 w-full overflow-auto pb-10">
      <div className="mb-6">
        <h2 className="text-xl font-medium text-black mb-8">Select Option</h2>
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-fit">
          <TabsList className="bg-white rounded-lg p-1 my-7 flex gap-6">
            <TabsTrigger
              value="knitting"
              className={`rounded-xl px-24 py-14 text-lg font-semibold border-2 ${selectedTab === 'knitting' ? 'text-blue-600 border-blue-500' : 'text-gray-600 border-gray-300'}`}
            >
              Knitting
            </TabsTrigger>
            <TabsTrigger
              value="dying"
              className={`rounded-xl px-24 py-14 text-lg font-semibold border-2 ${selectedTab === 'dying' ? 'text-blue-600 border-blue-500' : 'text-gray-600 border-gray-300'}`}
            >
              Dying
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Total Issue Stock</label>
          <Input placeholder="Enter issue stock" className="text-sm h-12" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Total Receiving Stock</label>
          <Input placeholder="Enter receiving stock" className="text-sm h-12" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Total Conversion Rate</label>
          <Input placeholder="Enter conversion rate" className="text-sm h-12" />
        </div>
      </div>

      {/* Table Template */}
      {["knitting", "dying"].includes(selectedTab) && (
        <div className="overflow-x-auto border rounded-xl">
          <Table>
            <TableHeader className="bg-[#2C3E50] text-white  text-sm">
              <TableRow className="py-4 h-16 hover:bg-slate-900"> 
                <TableHead className="text-white px-4 py-3">Product Name</TableHead>
                <TableHead className="text-white px-4 py-3">Unit</TableHead>
                <TableHead className="text-white px-4 py-3">Issue Qty</TableHead>
                <TableHead className="text-white px-4 py-3">Issue Date</TableHead>
                <TableHead className="text-white px-4 py-3">Receiving Date</TableHead>
                <TableHead className="text-white px-4 py-3">Receiving City</TableHead>
                <TableHead className="text-white px-4 py-3">Vendor No.</TableHead>
                <TableHead className="text-white px-4 py-3">Vendor Name</TableHead>
                <TableHead className="text-white px-4 py-3">Balance Qty</TableHead>
                <TableHead className="text-white px-4 py-3">Conversion Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i} className="text-center text-sm text-gray-500">
                  {Array.from({ length: 10 }).map((_, j) => (
                    <TableCell key={j} className="py-4">-</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="mt-4">
        <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-md font-medium rounded-md">
           <img src={FramerIcon} alt="PDF" className="w-5 h-5" />
          Generate Pdf
        </Button>
      </div>
    </div>
  );
}

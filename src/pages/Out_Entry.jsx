// // import React, { useState, useEffect } from 'react';
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// // import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// // import FramerIcon from '@/assets/Frame.png';

// // export default function StockConversionPage() {
// //   const [selectedTab, setSelectedTab] = useState("knitting");
// //   const [items, setItems] = useState([]);
// //   const [loading, setLoading] = useState(false);

// //   const fetchItems = async (process) => {
// //     try {
// //       setLoading(true);
// //       const res = await fetch(`https://textile-admin-panel.onrender.com/api/jobwork/get-items/${process}`, {
// //         method: "GET",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //       });

// //       if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

// //       const data = await res.json();
// //       setItems(data);
// //     } catch (err) {
// //       console.error("Failed to fetch jobwork items:", err);
// //       setItems([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Fetch when tab changes
// //   useEffect(() => {
// //     fetchItems(selectedTab === "dying" ? "Dyeing" : "Knitting");
// //   }, [selectedTab]);

// //   return (
// //     <div className="bg-white pl-2 pr-2 w-full overflow-auto pb-10">
// //       <div className="mb-6">
// //         <h2 className="text-xl font-medium text-black mb-8">Select Option</h2>
// //         <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-fit">
// //           <TabsList className="bg-white rounded-lg p-1 my-7 flex gap-6">
// //             <TabsTrigger
// //               value="knitting"
// //               className={`rounded-xl px-24 py-14 text-lg font-semibold border-2 ${selectedTab === 'knitting' ? 'text-blue-600 border-blue-500' : 'text-gray-600 border-gray-300'}`}
// //             >
// //               Knitting
// //             </TabsTrigger>
// //             <TabsTrigger
// //               value="dying"
// //               className={`rounded-xl px-24 py-14 text-lg font-semibold border-2 ${selectedTab === 'dying' ? 'text-blue-600 border-blue-500' : 'text-gray-600 border-gray-300'}`}
// //             >
// //               Dying
// //             </TabsTrigger>
// //           </TabsList>
// //         </Tabs>
// //       </div>

      

// //       {/* Table */}
// //       {["knitting", "dying"].includes(selectedTab) && (
// //         <div className="overflow-x-auto border rounded-xl">
// //           <Table>
// //             <TableHeader className="bg-[#2C3E50] text-white text-sm">
// //               <TableRow className="py-4 h-16 hover:bg-slate-900"> 
// //                 <TableHead className="text-white px-4 py-3">Product Name</TableHead>
// //                 <TableHead className="text-white px-4 py-3">Unit</TableHead>
// //                 <TableHead className="text-white px-4 py-3">Issue Qty</TableHead>
// //                 <TableHead className="text-white px-4 py-3">Issue Date</TableHead>
// //                 <TableHead className="text-white px-4 py-3">Receiving Date</TableHead>
// //                 <TableHead className="text-white px-4 py-3">Receiving City</TableHead>
// //                 <TableHead className="text-white px-4 py-3">Vendor No.</TableHead>
// //                 <TableHead className="text-white px-4 py-3">Vendor Name</TableHead>
// //                 <TableHead className="text-white px-4 py-3">Balance Qty</TableHead>
// //                 <TableHead className="text-white px-4 py-3">Conversion Rate</TableHead>
// //               </TableRow>
// //             </TableHeader>
// //             <TableBody>
// //               {loading ? (
// //                 <TableRow>
// //                   <TableCell colSpan={10} className="text-center py-6 text-gray-500">
// //                     Loading...
// //                   </TableCell>
// //                 </TableRow>
// //               ) : items.length === 0 ? (
// //                 <TableRow>
// //                   <TableCell colSpan={10} className="text-center py-6 text-gray-500">
// //                     No data found
// //                   </TableCell>
// //                 </TableRow>
// //               ) : (
// //                 items.map((item, i) => (
// //                   <TableRow key={i} className="text-center text-sm text-gray-500">
// //                     <TableCell>{item.product_name}</TableCell>
// //                     <TableCell>{item.unit}</TableCell>
// //                     <TableCell>{item.issued_qty || "-"}</TableCell>
// //                     <TableCell>{item.date_out || "-"}</TableCell>
// //                     <TableCell>-</TableCell>
// //                     <TableCell>-</TableCell>
// //                     <TableCell>{item.vendor_no || "-"}</TableCell>
// //                     <TableCell>{item.vendorname || "-"}</TableCell>
// //                     <TableCell>{item.max_qty || "-"}</TableCell>
// //                     <TableCell>-</TableCell>
// //                   </TableRow>
// //                 ))
// //               )}
// //             </TableBody>
// //           </Table>
// //         </div>
// //       )}

// //       <div className="mt-4">
// //         <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-md font-medium rounded-md">
// //           <img src={FramerIcon} alt="PDF" className="w-5 h-5" />
// //           Generate Pdf
// //         </Button>
// //       </div>
// //     </div>
// //   );
// // }

// import React, { useState, useEffect } from 'react';
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import FramerIcon from '@/assets/Frame.png';

// export default function StockConversionPage() {
//   const [selectedTab, setSelectedTab] = useState("knitting");
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchItems = async (process) => {
//     try {
//       setLoading(true);
//       const res = await fetch(`https://textile-admin-panel.onrender.com/api/jobwork/get-items/${process}`, {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//       });

//       if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

//       const data = await res.json();
//       // Ensure it's always an array
//       setItems(Array.isArray(data) ? data : [data]);
//     } catch (err) {
//       console.error("Failed to fetch jobwork items:", err);
//       setItems([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchItems(selectedTab === "dying" ? "Dyeing" : "Knitting");
//   }, [selectedTab]);

//   return (
//     <div className="bg-white pl-2 pr-2 w-full overflow-auto pb-10">
//       <div className="mb-6">
//         <h2 className="text-xl font-medium text-black mb-8">Select Option</h2>
//         <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-fit">
//           <TabsList className="bg-white rounded-lg p-1 my-7 flex gap-6">
//             <TabsTrigger
//               value="knitting"
//               className={`rounded-xl px-24 py-14 text-lg font-semibold border-2 ${selectedTab === 'knitting' ? 'text-blue-600 border-blue-500' : 'text-gray-600 border-gray-300'}`}
//             >
//               Knitting
//             </TabsTrigger>
//             <TabsTrigger
//               value="dying"
//               className={`rounded-xl px-24 py-14 text-lg font-semibold border-2 ${selectedTab === 'dying' ? 'text-blue-600 border-blue-500' : 'text-gray-600 border-gray-300'}`}
//             >
//               Dyeing
//             </TabsTrigger>
//           </TabsList>
//         </Tabs>
//       </div>

//       <div className="overflow-x-auto border rounded-xl">
//         <Table>
//           <TableHeader className="bg-[#2C3E50] text-white text-sm">
//             <TableRow className="py-4 h-16">
//               <TableHead className="text-white px-4 py-3">Product Name</TableHead>
//               <TableHead className="text-white px-4 py-3">Unit</TableHead>
//               <TableHead className="text-white px-4 py-3">Shade</TableHead>
//               <TableHead className="text-white px-4 py-3">Lot No</TableHead>
//               <TableHead className="text-white px-4 py-3">Mill Name</TableHead>
//               <TableHead className="text-white px-4 py-3">Issue Qty</TableHead>
//               <TableHead className="text-white px-4 py-3">Max Qty</TableHead>
//               <TableHead className="text-white px-4 py-3">Rate</TableHead>
//               <TableHead className="text-white px-4 py-3">GST %</TableHead>
//               <TableHead className="text-white px-4 py-3">Amount</TableHead>
//               <TableHead className="text-white px-4 py-3">GST Amount</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {loading ? (
//               <TableRow>
//                 <TableCell colSpan={11} className="text-center py-6 text-gray-500">
//                   Loading...
//                 </TableCell>
//               </TableRow>
//             ) : items.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={11} className="text-center py-6 text-gray-500">
//                   No data found
//                 </TableCell>
//               </TableRow>
//             ) : (
//               items.map((item, i) => (
//                 <TableRow key={i} className="text-center text-sm text-gray-500">
//                   <TableCell>{item.product_name || "-"}</TableCell>
//                   <TableCell>{item.unit || "-"}</TableCell>
//                   <TableCell>{item.shade || "-"}</TableCell>
//                   <TableCell>{item.lot_no || "-"}</TableCell>
//                   <TableCell>{item.mill_name || "-"}</TableCell>
//                   <TableCell>{item.issued_qty ?? "-"}</TableCell>
//                   <TableCell>{item.max_qty ?? "-"}</TableCell>
//                   <TableCell>{item.rate ?? "-"}</TableCell>
//                   <TableCell>{item.gst_percent ?? "-"}</TableCell>
//                   <TableCell>{item.amount ?? "-"}</TableCell>
//                   <TableCell>{item.gst_amount ?? "-"}</TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       <div className="mt-4">
//         <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-md font-medium rounded-md flex items-center gap-2">
//           <img src={FramerIcon} alt="PDF" className="w-5 h-5" />
//           Generate Pdf
//         </Button>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import FramerIcon from '@/assets/Frame.png';

export default function StockConversionPage() {
  const [selectedTab, setSelectedTab] = useState("knitting");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const fetchItems = async (process) => {
    try {
      setLoading(true);
      const res = await fetch(`https://textile-admin-panel.onrender.com/api/jobwork/get-items/${process}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const data = await res.json();
      setItems(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error("Failed to fetch jobwork items:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(selectedTab === "dying" ? "Dyeing" : "Knitting");
  }, [selectedTab]);

  const handleGeneratePdf = async () => {
    if (items.length === 0) {
      alert("No data to generate PDF");
      return;
    }

    try {
      setDownloading(true);

      const res = await fetch("https://textile-admin-panel.onrender.com/api/convert/json-to-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items),
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      // Receive PDF as blob
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      // Create a temporary download link
      const a = document.createElement("a");
      a.href = url;
      a.download = `stock_conversion_${selectedTab}.pdf`;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
      alert("Failed to generate PDF");
    } finally {
      setDownloading(false);
    }
  };

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
              Dyeing
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="overflow-x-auto border rounded-xl">
        <Table>
          <TableHeader className="bg-[#2C3E50] text-white text-sm">
            <TableRow className="py-4 h-16">
              <TableHead className="text-white px-4 py-3">Product Name</TableHead>
              <TableHead className="text-white px-4 py-3">Unit</TableHead>
              <TableHead className="text-white px-4 py-3">Shade</TableHead>
              <TableHead className="text-white px-4 py-3">Lot No</TableHead>
              <TableHead className="text-white px-4 py-3">Mill Name</TableHead>
              <TableHead className="text-white px-4 py-3">Issue Qty</TableHead>
              <TableHead className="text-white px-4 py-3">Max Qty</TableHead>
              <TableHead className="text-white px-4 py-3">Rate</TableHead>
              <TableHead className="text-white px-4 py-3">GST %</TableHead>
              <TableHead className="text-white px-4 py-3">Amount</TableHead>
              <TableHead className="text-white px-4 py-3">GST Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-6 text-gray-500">
                  Loading...
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-6 text-gray-500">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, i) => (
                <TableRow key={i} className="text-center text-sm text-gray-500">
                  <TableCell>{item.product_name || "-"}</TableCell>
                  <TableCell>{item.unit || "-"}</TableCell>
                  <TableCell>{item.shade || "-"}</TableCell>
                  <TableCell>{item.lot_no || "-"}</TableCell>
                  <TableCell>{item.mill_name || "-"}</TableCell>
                  <TableCell>{item.issued_qty ?? "-"}</TableCell>
                  <TableCell>{item.max_qty ?? "-"}</TableCell>
                  <TableCell>{item.rate ?? "-"}</TableCell>
                  <TableCell>{item.gst_percent ?? "-"}</TableCell>
                  <TableCell>{item.amount ?? "-"}</TableCell>
                  <TableCell>{item.gst_amount ?? "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4">
        <Button
          onClick={handleGeneratePdf}
          disabled={downloading}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-md font-medium rounded-md flex items-center gap-2"
        >
          <img src={FramerIcon} alt="PDF" className="w-5 h-5" />
          {downloading ? "Generating..." : "Generate Pdf"}
        </Button>
      </div>
    </div>
  );
}

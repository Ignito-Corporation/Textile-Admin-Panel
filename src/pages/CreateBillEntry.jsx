// // // import React, { useState, useEffect } from "react";

// // // const vendorData = {
// // //   "PO-202507-214": {
// // //     vendorName: "ABC Textile Mills",
// // //     address: "123 Cotton St, Mumbai",
// // //     state: "Maharashtra",
// // //     phone: "022-12345678",
// // //     products: [
// // //       { productName: "Cotton Roll", unit: "kg", qty: 100, rate: 200, gst: "5%" },
// // //       { productName: "Cotton Sheet", unit: "m", qty: 50, rate: 300, gst: "12%" },
// // //     ],
// // //   },
// // //   "PO-202507-215": {
// // //     vendorName: "Premium Cotton Suppliers",
// // //     address: "45 Silk Rd, Delhi",
// // //     state: "Delhi",
// // //     phone: "011-87654321",
// // //     products: [
// // //       { productName: "Premium Cotton", unit: "kg", qty: 200, rate: 250, gst: "5%" },
// // //     ],
// // //   },
// // //   "PO-202507-216": {
// // //     vendorName: "Silk Weavers Ltd",
// // //     address: "78 Weave Ave, Chennai",
// // //     state: "Tamil Nadu",
// // //     phone: "044-11223344",
// // //     products: [
// // //       { productName: "Silk Roll", unit: "kg", qty: 120, rate: 500, gst: "18%" },
// // //       { productName: "Silk Yarn", unit: "m", qty: 90, rate: 450, gst: "12%" },
// // //     ],
// // //   },
// // // };

// // // export default function CreateBillEntry() {
// // //   const [crlCounter, setCrlCounter] = useState(10001);
// // //   const [form, setForm] = useState({
// // //     partyName: "",
// // //     billNumber: "",
// // //     billDate: "",
// // //     receivedDate: "",
// // //     crlNumber: "",
// // //     vendorName: "",
// // //     poNumber: "",
// // //     grnNumber: "",
// // //     billType: "",
// // //     address: "",
// // //     state: "",
// // //     phone: "",
// // //   });

// // //   const [products, setProducts] = useState([]);

// // //   useEffect(() => {
// // //     setForm(f => ({ ...f, crlNumber: crlCounter }));
// // //   }, [crlCounter]);

// // //   useEffect(() => {
// // //     const info = vendorData[form.poNumber];
// // //     if (info) {
// // //       setForm(f => ({
// // //         ...f,
// // //         vendorName: info.vendorName,
// // //         address: info.address,
// // //         state: info.state,
// // //         phone: info.phone,
// // //       }));
// // //       setProducts(
// // //         info.products.map((p, idx) => {
// // //           const amount = p.qty * p.rate;
// // //           const gstPercent = parseFloat(p.gst);
// // //           const gRate = ((amount * gstPercent) / 100).toFixed(2);
// // //           return {
// // //             id: idx + 1,
// // //             ...p,
// // //             shade: "",
// // //             lot: "",
// // //             mill: "",
// // //             amount: amount.toFixed(2),
// // //             gRate,
// // //           };
// // //         })
// // //       );
// // //     }
// // //   }, [form.poNumber]);

// // //   const handleFormChange = (field, val) => {
// // //     setForm(f => ({ ...f, [field]: val }));
// // //   };

// // //   const addRow = () => {
// // //     setProducts(ps => [
// // //       ...ps,
// // //       {
// // //         id: ps.length + 1,
// // //         productName: "",
// // //         unit: "",
// // //         shade: "",
// // //         lot: "",
// // //         mill: "",
// // //         qty: 1,
// // //         rate: 0,
// // //         gst: "18%",
// // //         amount: 0,
// // //         gRate: 0,
// // //       },
// // //     ]);
// // //   };

// // //   const removeRow = id => {
// // //     setProducts(ps => (ps.length > 1 ? ps.filter(p => p.id !== id) : ps));
// // //   };

// // //   const updateProduct = (id, field, val) => {
// // //     setProducts(ps =>
// // //       ps.map(p => {
// // //         if (p.id !== id) return p;
// // //         const updated = { ...p, [field]: field === "qty" || field === "rate" ? Number(val) : val };
// // //         updated.amount = (updated.qty * updated.rate).toFixed(2);
// // //         const gstPercent = parseFloat(updated.gst);
// // //         updated.gRate = ((updated.qty * updated.rate * gstPercent) / 100).toFixed(2);
// // //         return updated;
// // //       })
// // //     );
// // //   };

// // //   const handleSubmit = () => {
// // //     console.log("Submitted Data:", { form, products });
// // //     alert("Form submitted. Check console for data.");
// // //   };

// // //   return (
// // // <div className="min-h-screen bg-gray-100 p-6">
// // //   <div className="bg-white rounded-lg shadow-lg overflow-hidden">
// // //     <div className="bg-[#2f3c4f] text-white p-4 flex justify-between items-center">
// // //       <h1 className="text-lg font-semibold">+ Create Purchase Bill Entry</h1>
// // //       <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-1 rounded">← Back</button>
// // //     </div>

// // //     <div className="p-6 space-y-6">
// // //       {/* Form Sections */}

// // //       <section>
// // //         <h2 className="font-medium mb-2">Purchase Bill Details</h2>
// // //         <div className="grid grid-cols-4 gap-4 mb-4">
// // //           {[
// // //             "partyName",
// // //             "billNumber",
// // //             "billDate",
// // //             "receivedDate",
// // //           ].map(field => (
// // //             <div key={field}>
// // //               <label className="block text-sm mb-1">
// // //                 {field.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}
// // //               </label>
// // //               <input
// // //                 type={field.toLowerCase().includes("date") ? "date" : "text"}
// // //                 value={form[field]}
// // //                 onChange={e => handleFormChange(field, e.target.value)}
// // //                 className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
// // //                 placeholder="Input to be displayed here"
// // //               />
// // //             </div>
// // //           ))}
// // //         </div>
// // //         <div className="w-1/3">
// // //           <label className="block text-sm mb-1">CRL Number</label>
// // //           <input
// // //             type="text"
// // //             value={form.crlNumber}
// // //             readOnly
// // //             className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50"
// // //           />
// // //         </div>
// // //       </section>

// // //       <section>
// // //         <h2 className="font-medium mb-2">Vendor Information</h2>
// // //         <div className="grid grid-cols-4 gap-4 mb-4">
// // //           {["vendorName", "poNumber", "grnNumber", "billType"].map(field => (
// // //             <div key={field}>
// // //               <label className="block text-sm mb-1">
// // //                 {field.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}
// // //               </label>
// // //               <input
// // //                 type="text"
// // //                 value={form[field]}
// // //                 onChange={e => handleFormChange(field, e.target.value)}
// // //                 className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
// // //                 placeholder="Input to be displayed here"
// // //               />
// // //             </div>
// // //           ))}
// // //         </div>
// // //         <div className="grid grid-cols-3 gap-4">
// // //           {["address", "state", "phone"].map(field => (
// // //             <div key={field}>
// // //               <label className="block text-sm mb-1">
// // //                 {field.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}
// // //               </label>
// // //               <input
// // //                 type="text"
// // //                 value={form[field]}
// // //                 onChange={e => handleFormChange(field, e.target.value)}
// // //                 className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
// // //                 placeholder="Input to be displayed here"
// // //               />
// // //             </div>
// // //           ))}
// // //         </div>
// // //       </section>

// // //       <section>
// // //         <h2 className="font-medium mb-2">Products</h2>
// // //         <div className="overflow-x-auto bg-white shadow rounded-lg">
// // //           <table className="w-full text-sm text-left">
// // //             <thead className="bg-[#2f3c4f] text-white">
// // //               <tr>
// // //                 {["Product Name", "Unit", "Shade", "Lot No.", "Mill Name", "Product Qty", "Rate", "GST%", "Amount", "GRate", "Action"].map(
// // //                   h => (
// // //                     <th key={h} className="px-4 py-2 font-medium">
// // //                       {h}
// // //                     </th>
// // //                   )
// // //                 )}
// // //               </tr>
// // //             </thead>
// // //             <tbody>
// // //               {products.map(row => (
// // //                 <tr key={row.id} className="even:bg-gray-50">
// // //                   {["productName", "unit", "shade", "lot", "mill", "qty", "rate", "gst", "amount", "gRate"].map(field => (
// // //                     <td key={field} className="px-3 py-2">
// // //                       <input
// // //                         type={field === "qty" || field === "rate" ? "number" : "text"}
// // //                         value={row[field]}
// // //                         readOnly={field === "amount" || field === "gRate"}
// // //                         onChange={e => updateProduct(row.id, field, e.target.value)}
// // //                         className={`w-full border border-gray-300 rounded px-2 py-1 text-sm ${
// // //                           field === "amount" || field === "gRate" ? "bg-gray-100" : ""
// // //                         }`}
// // //                       />
// // //                     </td>
// // //                   ))}
// // //                   <td className="px-3 py-2">
// // //                     <button onClick={() => removeRow(row.id)} className="text-red-500 hover:underline">
// // //                       Remove
// // //                     </button>
// // //                   </td>
// // //                 </tr>
// // //               ))}
// // //             </tbody>
// // //           </table>
// // //         </div>
// // //         <button
// // //           onClick={addRow}
// // //           className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
// // //         >
// // //           + Add Row
// // //         </button>
// // //       </section>

// // //       <div className="pt-6">
// // //         <button
// // //           onClick={handleSubmit}
// // //           className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded shadow"
// // //         >
// // //           Submit Bill Entry
// // //         </button>
// // //       </div>
// // //     </div>
// // //   </div>
// // // </div>
// // //   );
// // // }

// // import React, { useState, useEffect } from "react";
// // import axios from "axios";

// // export default function CreateBillEntry() {
// //   const [crlCounter, setCrlCounter] = useState(10001);
// //   const [form, setForm] = useState({
// //     partyName: "",
// //     billNumber: "",
// //     billDate: "",
// //     receivedDate: "",
// //     crlNumber: "",
// //     vendorName: "",
// //     poNumber: "",
// //     address: "",
// //     billType: "",
// //   });

// //   const [products, setProducts] = useState([]);
// //   const [poLoading, setPoLoading] = useState(false);
// //   const [poError, setPoError] = useState("");

// //   useEffect(() => {
// //     setForm(f => ({ ...f, crlNumber: crlCounter }));
// //   }, [crlCounter]);

// //   const handleFormChange = (field, val) => {
// //     setForm(f => ({ ...f, [field]: val }));
// //   };

// //   const fetchPOData = async (poId) => {
// //     if (!poId) return;

// //     setPoLoading(true);
// //     setPoError("");

// //     try {
// //       const response = await axios.get(`http://localhost:8080/api/purchase-orders/${poId}`);
// //       const poData = response.data;

// //       // Update form fields with PO data
// //       setForm(f => ({
// //         ...f,
// //         partyName: poData.party_name || "",
// //         vendorName: poData.vendor?.name || "",
// //         address: poData.vendor?.address || "",
// //       }));

// //       // Update products list
// //       if (poData.products && poData.products.length > 0) {
// //         setProducts(
// //           poData.products.map((p, idx) => {
// //             const amount = p.quantity * p.rate;
// //             const gstPercent = p.gst_percentage;
// //             const gRate = (amount * gstPercent) / 100;
// //             return {
// //               id: idx + 1,
// //               productName: p.name || "",
// //               unit: p.unit || "",
// //               shade: "",
// //               lot: "",
// //               mill: "",
// //               qty: p.quantity || 0,
// //               rate: p.rate || 0,
// //               gst: `${gstPercent || 0}%`,
// //               amount: amount.toFixed(2),
// //               gRate: gRate.toFixed(2),
// //             };
// //           })
// //         );
// //       }
// //     } catch (err) {
// //       console.error("Error fetching PO:", err);
// //       setPoError("Failed to fetch PO data. Please check the PO ID.");
// //     } finally {
// //       setPoLoading(false);
// //     }
// //   };

// //   const handlePOBlur = () => {
// //     if (form.poNumber) {
// //       fetchPOData(form.poNumber);
// //     }
// //   };

// //   const addRow = () => {
// //     setProducts(ps => [
// //       ...ps,
// //       {
// //         id: ps.length + 1,
// //         productName: "",
// //         unit: "",
// //         shade: "",
// //         lot: "",
// //         mill: "",
// //         qty: 1,
// //         rate: 0,
// //         gst: "18%",
// //         amount: "0.00",
// //         gRate: "0.00",
// //       },
// //     ]);
// //   };

// //   const removeRow = id => {
// //     setProducts(ps => (ps.length > 1 ? ps.filter(p => p.id !== id) : ps));
// //   };

// //   const updateProduct = (id, field, val) => {
// //     setProducts(ps =>
// //       ps.map(p => {
// //         if (p.id !== id) return p;

// //         const updated = { ...p, [field]: val };

// //         // Recalculate amounts if quantity, rate, or GST changes
// //         if (["qty", "rate", "gst"].includes(field)) {
// //           const quantity = field === "qty" ? Number(val) : Number(p.qty);
// //           const rate = field === "rate" ? Number(val) : Number(p.rate);
// //           const gstPercent = parseFloat(updated.gst) || 0;

// //           const amount = quantity * rate;
// //           const gRate = (amount * gstPercent) / 100;

// //           updated.amount = amount.toFixed(2);
// //           updated.gRate = gRate.toFixed(2);
// //         }

// //         return updated;
// //       })
// //     );
// //   };

// //   const handleSubmit = async () => {
// //     try {
// //       // Prepare the bill data for backend
// //       const billData = {
// //         party_name: form.partyName,
// //         bill_number: form.billNumber,
// //         bill_date: form.billDate,
// //         received_date: form.receivedDate,
// //         crl_number: form.crlNumber.toString(),
// //         mode: form.billType,
// //         vendor: {
// //           name: form.vendorName,
// //           address: form.address,
// //         },
// //         products: products.map(p => ({
// //           name: p.productName,
// //           hsn_code: "", // Not in UI, but required by backend
// //           quantity: parseFloat(p.qty),
// //           rate: parseFloat(p.rate),
// //           gst_percentage: parseFloat(p.gst),
// //           amount: parseFloat(p.amount),
// //         })),
// //       };

// //       // Send to backend
// //       const response = await axios.post("http://localhost:8080/api/purchase-bill/", billData);

// //       alert(`Bill created successfully! ID: ${response.data.bill_id}`);

// //       // Reset form
// //       setForm({
// //         partyName: "",
// //         billNumber: "",
// //         billDate: "",
// //         receivedDate: "",
// //         crlNumber: crlCounter + 1,
// //         vendorName: "",
// //         poNumber: "",
// //         address: "",
// //         billType: "",
// //       });
// //       setProducts([]);
// //       setCrlCounter(prev => prev + 1);
// //     } catch (error) {
// //       console.error("Bill creation failed:", error);
// //       alert("Failed to create bill. Please try again.");
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-100 p-6">
// //       <div className="bg-white rounded-lg shadow-lg overflow-hidden">
// //         <div className="bg-[#2f3c4f] text-white p-4 flex justify-between items-center">
// //           <h1 className="text-lg font-semibold">+ Create Purchase Bill Entry</h1>
// //           <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-1 rounded">← Back</button>
// //         </div>

// //         <div className="p-6 space-y-6">
// //           {/* Form Sections */}

// //           <section>
// //             <h2 className="font-medium mb-2">Purchase Bill Details</h2>
// //             <div className="grid grid-cols-4 gap-4 mb-4">
// //               {[
// //                 "partyName",
// //                 "billNumber",
// //                 "billDate",
// //                 "receivedDate",
// //               ].map(field => (
// //                 <div key={field}>
// //                   <label className="block text-sm mb-1">
// //                     {field.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}
// //                   </label>
// //                   <input
// //                     type={field.toLowerCase().includes("date") ? "date" : "text"}
// //                     value={form[field]}
// //                     onChange={e => handleFormChange(field, e.target.value)}
// //                     className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
// //                     placeholder="Input to be displayed here"
// //                   />
// //                 </div>
// //               ))}
// //             </div>
// //             <div className="w-1/3">
// //               <label className="block text-sm mb-1">CRL Number</label>
// //               <input
// //                 type="text"
// //                 value={form.crlNumber}
// //                 readOnly
// //                 className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50"
// //               />
// //             </div>
// //           </section>

// //           <section>
// //             <h2 className="font-medium mb-2">Vendor Information</h2>
// //             <div className="grid grid-cols-4 gap-4 mb-4">
// //               {["vendorName", "poNumber", "grnNumber", "billType"].map(field => (
// //                 <div key={field}>
// //                   <label className="block text-sm mb-1">
// //                     {field.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}
// //                   </label>
// //                   <input
// //                     type="text"
// //                     value={form[field]}
// //                     onChange={e => handleFormChange(field, e.target.value)}
// //                     className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
// //                     placeholder="Input to be displayed here"
// //                   />
// //                 </div>
// //               ))}
// //             </div>
// //             <div className="grid grid-cols-3 gap-4">
// //               {["address", "state", "phone"].map(field => (
// //                 <div key={field}>
// //                   <label className="block text-sm mb-1">
// //                     {field.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}
// //                   </label>
// //                   <input
// //                     type="text"
// //                     value={form[field]}
// //                     onChange={e => handleFormChange(field, e.target.value)}
// //                     className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
// //                     placeholder="Input to be displayed here"
// //                   />
// //                 </div>
// //               ))}
// //             </div>
// //           </section>

// //           <section>
// //             <h2 className="font-medium mb-2">Products</h2>
// //             <div className="overflow-x-auto bg-white shadow rounded-lg">
// //               <table className="w-full text-sm text-left">
// //                 <thead className="bg-[#2f3c4f] text-white">
// //                   <tr>
// //                     {["Product Name", "Unit", "Shade", "Lot No.", "Mill Name", "Product Qty", "Rate", "GST%", "Amount", "GRate", "Action"].map(
// //                       h => (
// //                         <th key={h} className="px-4 py-2 font-medium">
// //                           {h}
// //                         </th>
// //                       )
// //                     )}
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {products.map(row => (
// //                     <tr key={row.id} className="even:bg-gray-50">
// //                       {["productName", "unit", "shade", "lot", "mill", "qty", "rate", "gst", "amount", "gRate"].map(field => (
// //                         <td key={field} className="px-3 py-2">
// //                           <input
// //                             type={field === "qty" || field === "rate" ? "number" : "text"}
// //                             value={row[field]}
// //                             readOnly={field === "amount" || field === "gRate"}
// //                             onChange={e => updateProduct(row.id, field, e.target.value)}
// //                             className={`w-full border border-gray-300 rounded px-2 py-1 text-sm ${field === "amount" || field === "gRate" ? "bg-gray-100" : ""
// //                               }`}
// //                           />
// //                         </td>
// //                       ))}
// //                       <td className="px-3 py-2">
// //                         <button onClick={() => removeRow(row.id)} className="text-red-500 hover:underline">
// //                           Remove
// //                         </button>
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>
// //             <button
// //               onClick={addRow}
// //               className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
// //             >
// //               + Add Row
// //             </button>
// //           </section>

// //           <div className="pt-6">
// //             <button
// //               onClick={handleSubmit}
// //               className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded shadow"
// //             >
// //               Submit Bill Entry
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// import React, { useState, useEffect } from "react";
// import axios from "axios";

// export default function CreateBillEntry() {
//   const [crlCounter, setCrlCounter] = useState(10001);
//   const [form, setForm] = useState({
//     partyName: "",
//     billNumber: "",
//     billDate: "",
//     receivedDate: "",
//     crlNumber: "",
//     vendorName: "",
//     poNumber: "",
//     address: "",
//     state: "",
//     phone: "",
//     billType: "",
//   });

//   const [products, setProducts] = useState([]);
//   const [poLoading, setPoLoading] = useState(false);
//   const [poError, setPoError] = useState("");
//   const [vendorOptions, setVendorOptions] = useState([]);
//   const [vendorDetails, setVendorDetails] = useState(null);

//   // Fetch vendors on component mount
//   useEffect(() => {
//     const fetchVendors = async () => {
//       try {
//         const response = await axios.get('http://localhost:8080/api/master/vendors');
//         const supplierVendors = response.data.filter(
//           vendor => vendor.category === "Supplier"
//         );
//         setVendorOptions(supplierVendors);
//       } catch (error) {
//         console.error("Failed to fetch vendors:", error);
//       }
//     };

//     fetchVendors();
//     setForm(f => ({ ...f, crlNumber: crlCounter }));
//   }, [crlCounter]);

//   const handleFormChange = (field, val) => {
//     setForm(f => ({ ...f, [field]: val }));
//   };

//   // Handle vendor selection from dropdown
//   const handleVendorSelect = (vendorId) => {
//     const selectedVendor = vendorOptions.find(v => v._id === vendorId);
//     if (selectedVendor) {
//       setVendorDetails(selectedVendor);
//       setForm(f => ({
//         ...f,
//         vendorName: selectedVendor.name || "",
//         address: selectedVendor.address || "",
//         state: selectedVendor.state || "",
//         phone: selectedVendor.mobile_number || "",
//       }));
//     }
//   };

//   // Fetch PO data when PO number is entered
//   const fetchPOData = async (poId) => {
//     if (!poId) return;

//     setPoLoading(true);
//     setPoError("");

//     try {
//       const response = await axios.get(`http://localhost:8080/api/po/${poId}`);
//       const poData = response.data;

//       // Update vendor details and form fields
//       setVendorDetails(poData.vendor);
//       setForm(f => ({
//         ...f,
//         vendorName: poData.vendor?.name || "",
//         address: poData.vendor?.address || "",
//         state: poData.vendor?.state || "",
//         phone: poData.vendor?.mobile_number || "",
//         partyName: poData.vendor?.name || "", // Map vendor name to party name
//       }));

//       // Update products list
//       if (poData.items && poData.items.length > 0) {
//         setProducts(
//           poData.items.map((p, idx) => {
//             const amount = (p.quantity || 0) * (p.rate || 0);
//             const gstPercent = p.gst_percent || 0;
//             const gRate = (amount * gstPercent) / 100;
//             return {
//               id: idx + 1,
//               poProduct: p, // Store original PO product data
//               productName: p.product_name || "",
//               unit: p.unit || "",
//               shade: "",
//               lot: "",
//               mill: "",
//               qty: p.quantity || 0,
//               rate: p.rate || 0,
//               gst: `${gstPercent || 0}%`,
//               amount: amount.toFixed(2),
//               gRate: gRate.toFixed(2),
//             };
//           })
//         );
//       }
//     } catch (err) {
//       console.error("Error fetching PO:", err);
//       setPoError("Failed to fetch PO data. Please check the PO ID.");
//     } finally {
//       setPoLoading(false);
//     }
//   };

//   const handlePOBlur = () => {
//     if (form.poNumber) {
//       fetchPOData(form.poNumber);
//     }
//   };

//   const addRow = () => {
//     setProducts(ps => [
//       ...ps,
//       {
//         id: ps.length + 1,
//         productName: "",
//         unit: "",
//         shade: "",
//         lot: "",
//         mill: "",
//         qty: 1,
//         rate: 0,
//         gst: "18%",
//         amount: "0.00",
//         gRate: "0.00",
//       },
//     ]);
//   };

//   const removeRow = id => {
//     setProducts(ps => (ps.length > 1 ? ps.filter(p => p.id !== id) : ps));
//   };

//   const updateProduct = (id, field, val) => {
//     setProducts(ps =>
//       ps.map(p => {
//         if (p.id !== id) return p;

//         const updated = { ...p, [field]: val };

//         // Recalculate amounts if quantity, rate, or GST changes
//         if (["qty", "rate", "gst"].includes(field)) {
//           const quantity = field === "qty" ? Number(val) : Number(p.qty);
//           const rate = field === "rate" ? Number(val) : Number(p.rate);
//           const gstPercent = parseFloat(updated.gst) || 0;

//           const amount = quantity * rate;
//           const gRate = (amount * gstPercent) / 100;

//           updated.amount = amount.toFixed(2);
//           updated.gRate = gRate.toFixed(2);
//         }

//         return updated;
//       })
//     );
//   };

//   // Updated handleSubmit function
//   const handleSubmit = async () => {
//     try {
//       // Prepare vendor data
//       const vendorData = vendorDetails ? {
//         ...vendorDetails,
//         name: form.vendorName,
//         address: form.address,
//         state: form.state,
//         mobile_number: form.phone,
//       } : {
//         name: form.vendorName,
//         address: form.address,
//         state: form.state,
//         mobile_number: form.phone,
//       };

//       // Prepare products data with ALL fields
//       const productsData = products.map(p => {
//         // Extract GST percentage (remove % sign if present)
//         const gstPercent = parseFloat(p.gst.replace(/%/g, '')) || 0;

//         // Calculate amounts if not already calculated
//         const quantity = parseFloat(p.qty) || 0;
//         const rate = parseFloat(p.rate) || 0;
      
//         const amount = quantity * rate;
//         const gRate = (amount * gstPercent) / 100;
        

//         return {
//           product_id: p.poProduct?.product_id || "",
//           product_name: p.productName,
//           hsn_code: p.poProduct?.hsn_code || "",
//           unit: p.unit,
//           shade: p.shade,               // Manually entered field
//           lot_no: p.lot,                // Manually entered field
//           mill_name: p.mill,
//           quantity: quantity,
//           rate: rate,            // Manually entered field
//           gst_percent: gstPercent,
//           amount: amount,                // Calculated amount
//           gst_amount: gRate,             // GST amount
//         };
//       });

//       // Prepare bill data
//       const billData = {
//         party_name: form.partyName,
//         bill_number: form.billNumber,
//         bill_date: form.billDate,
//         received_date: form.receivedDate,
//         crl_number: form.crlNumber.toString(),
//         mode: form.billType,
//         vendor: vendorData,
//         products: productsData,
//       };
//       console.log(productsData)

//       // Submit to backend
//       const response = await axios.post("http://localhost:8080/api/purchase-bill/", billData);
//       alert(`Bill created successfully! ID: ${response.data.bill_id}`);

//       // Reset form
//       setForm({
//         partyName: "",
//         billNumber: "",
//         billDate: "",
//         receivedDate: "",
//         crlNumber: crlCounter + 1,
//         vendorName: "",
//         poNumber: "",
//         address: "",
//         state: "",
//         phone: "",
//         billType: "",
//       });
//       setProducts([]);
//       setVendorDetails(null);
//       setCrlCounter(prev => prev + 1);
//     } catch (error) {
//       console.error("Bill creation failed:", error);
//       alert(`Failed to create bill: ${error.response?.data?.error || error.message}`);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//         <div className="bg-[#2f3c4f] text-white p-4 flex justify-between items-center">
//           <h1 className="text-lg font-semibold">+ Create Purchase Bill Entry</h1>
//           <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-1 rounded">← Back</button>
//         </div>

//         <div className="p-6 space-y-6">
//           {/* Purchase Bill Details Section */}
//           <section>
//             <h2 className="font-medium mb-2">Purchase Bill Details</h2>
//             <div className="grid grid-cols-4 gap-4 mb-4">
//               {[
//                 "partyName",
//                 "billNumber",
//                 "billDate",
//                 "receivedDate",
//               ].map(field => (
//                 <div key={field}>
//                   <label className="block text-sm mb-1">
//                     {field.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}
//                   </label>
//                   <input
//                     type={field.toLowerCase().includes("date") ? "date" : "text"}
//                     value={form[field]}
//                     onChange={e => handleFormChange(field, e.target.value)}
//                     className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//                   />
//                 </div>
//               ))}
//             </div>
//             <div className="w-1/3">
//               <label className="block text-sm mb-1">CRL Number</label>
//               <input
//                 type="text"
//                 value={form.crlNumber}
//                 readOnly
//                 className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50"
//               />
//             </div>
//           </section>

//           {/* Vendor Information Section */}
//           <section>
//             <h2 className="font-medium mb-2">Vendor Information</h2>
//             <div className="grid grid-cols-4 gap-4 mb-4">
//               {/* Vendor Dropdown */}
//               <div>
//                 <label className="block text-sm mb-1">Vendor Name</label>
//                 <select
//                   value={form.vendorName}
//                   onChange={e => handleVendorSelect(e.target.value)}
//                   className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//                 >
//                   <option value="">Select Vendor</option>
//                   {vendorOptions.map(vendor => (
//                     <option key={vendor._id} value={vendor._id}>
//                       {vendor.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* PO Number Field */}
//               <div>
//                 <label className="block text-sm mb-1">PO Number</label>
//                 <input
//                   type="text"
//                   value={form.poNumber}
//                   onChange={e => handleFormChange("poNumber", e.target.value)}
//                   onBlur={handlePOBlur}
//                   className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//                 />
//                 {poLoading && <p className="text-xs text-blue-500">Loading PO data...</p>}
//                 {poError && <p className="text-xs text-red-500">{poError}</p>}
//               </div>

//               {/* Other Fields */}
//               {["grnNumber", "billType"].map(field => (
//                 <div key={field}>
//                   <label className="block text-sm mb-1">
//                     {field.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}
//                   </label>
//                   <input
//                     type="text"
//                     value={form[field]}
//                     onChange={e => handleFormChange(field, e.target.value)}
//                     className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//                   />
//                 </div>
//               ))}
//             </div>
//             <div className="grid grid-cols-3 gap-4">
//               {["address", "state", "phone"].map(field => (
//                 <div key={field}>
//                   <label className="block text-sm mb-1">
//                     {field.charAt(0).toUpperCase() + field.slice(1)}
//                   </label>
//                   <input
//                     type="text"
//                     value={form[field]}
//                     onChange={e => handleFormChange(field, e.target.value)}
//                     className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//                   />
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* Products Section */}
//           <section>
//             <h2 className="font-medium mb-2">Products</h2>
//             <div className="overflow-x-auto bg-white shadow rounded-lg">
//               <table className="w-full text-sm text-left">
//                 <thead className="bg-[#2f3c4f] text-white">
//                   <tr>
//                     {["Product Name", "Unit", "Shade", "Lot No.", "Mill Name", "Product Qty", "Rate", "GST%", "Amount", "GRate", "Action"].map(
//                       h => (
//                         <th key={h} className="px-4 py-2 font-medium">
//                           {h}
//                         </th>
//                       )
//                     )}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {products.map(row => (
//                     <tr key={row.id} className="even:bg-gray-50">
//                       {["productName", "unit", "shade", "lot", "mill", "qty", "rate", "gst", "amount", "gRate"].map(field => (
//                         <td key={field} className="px-3 py-2">
//                           <input
//                             type={["qty", "rate"].includes(field) ? "number" : "text"}
//                             value={row[field]}
//                             readOnly={field === "amount" || field === "gRate"}
//                             onChange={e => updateProduct(row.id, field, e.target.value)}
//                             className={`w-full border border-gray-300 rounded px-2 py-1 text-sm ${field === "amount" || field === "gRate" ? "bg-gray-100" : ""
//                               }`}
//                           />
//                         </td>
//                       ))}
//                       <td className="px-3 py-2">
//                         <button
//                           onClick={() => removeRow(row.id)}
//                           className="text-red-500 hover:underline"
//                         >
//                           Remove
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             <button
//               onClick={addRow}
//               className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
//             >
//               + Add Row
//             </button>
//           </section>

//           <div className="pt-6">
//             <button
//               onClick={handleSubmit}
//               className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded shadow"
//             >
//               Submit Bill Entry
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import axios from "axios";

export default function CreateBillEntry() {
  const [crlCounter, setCrlCounter] = useState(10001);
  const [form, setForm] = useState({
    partyName: "",
    billNumber: "",
    billDate: "",
    receivedDate: "",
    crlNumber: "",
    vendorName: "",
    poNumber: "",
    grnNumber: "",
    address: "",
    state: "",
    phone: "",
    billType: "",
  });

  const [products, setProducts] = useState([]);
  const [poLoading, setPoLoading] = useState(false);
  const [poError, setPoError] = useState("");
  const [vendorOptions, setVendorOptions] = useState([]);
  const [vendorDetails, setVendorDetails] = useState(null);

  // Fetch vendors on component mount
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/master/vendors');
        const supplierVendors = response.data.filter(
          vendor => vendor.category === "Supplier"
        );
        setVendorOptions(supplierVendors);
      } catch (error) {
        console.error("Failed to fetch vendors:", error);
      }
    };

    fetchVendors();
    setForm(f => ({ ...f, crlNumber: crlCounter }));
  }, [crlCounter]);

  const handleFormChange = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
  };

  // Handle vendor selection from dropdown
  const handleVendorSelect = (vendorId) => {
    const selectedVendor = vendorOptions.find(v => v._id === vendorId);
    if (selectedVendor) {
      setVendorDetails(selectedVendor);
      setForm(f => ({
        ...f,
        vendorName: selectedVendor.name || "",
        address: selectedVendor.address || "",
        state: selectedVendor.state || "",
        phone: selectedVendor.mobile_number || "",
      }));
    }
  };

  // Fetch PO data when PO number is entered
  const fetchPOData = async (poId) => {
    if (!poId) return;

    setPoLoading(true);
    setPoError("");

    try {
      const response = await axios.get(`http://localhost:8080/api/po/${poId}`);
      const poData = response.data;

      // Update vendor details and form fields
      setVendorDetails(poData.vendor);
      setForm(f => ({
        ...f,
        vendorName: poData.vendor?.name || "",
        address: poData.vendor?.address || "",
        state: poData.vendor?.state || "",
        phone: poData.vendor?.mobile_number || "",
        partyName: poData.vendor?.name || "", // Map vendor name to party name
      }));

      // Update products list
      if (poData.items && poData.items.length > 0) {
        setProducts(
          poData.items.map((p, idx) => {
            const amount = (p.quantity || 0) * (p.rate || 0);
            const gstPercent = p.gst_percent || 0;
            const gRate = (amount * gstPercent) / 100;
            return {
              id: idx + 1,
              poProduct: p, // Store original PO product data
              productName: p.product_name || "",
              unit: p.unit || "",
              shade: "",
              lot: "",
              mill: "",
              qty: p.quantity || 0,
              rate: p.rate || 0,
              gst: `${gstPercent || 0}%`,
              amount: amount.toFixed(2),
              gRate: gRate.toFixed(2),
            };
          })
        );
      }
    } catch (err) {
      console.error("Error fetching PO:", err);
      setPoError("Failed to fetch PO data. Please check the PO ID.");
    } finally {
      setPoLoading(false);
    }
  };

  const handlePOBlur = () => {
    if (form.poNumber) {
      fetchPOData(form.poNumber);
    }
  };

  const addRow = () => {
    setProducts(ps => [
      ...ps,
      {
        id: ps.length + 1,
        productName: "",
        unit: "",
        shade: "",
        lot: "",
        mill: "",
        qty: 1,
        rate: 0,
        gst: "18%",
        amount: "0.00",
        gRate: "0.00",
      },
    ]);
  };

  const removeRow = id => {
    setProducts(ps => (ps.length > 1 ? ps.filter(p => p.id !== id) : ps));
  };

  const updateProduct = (id, field, val) => {
    setProducts(ps =>
      ps.map(p => {
        if (p.id !== id) return p;

        const updated = { ...p, [field]: val };

        // Recalculate amounts if quantity, rate, or GST changes
        if (["qty", "rate", "gst"].includes(field)) {
          const quantity = field === "qty" ? Number(val) : Number(p.qty);
          const rate = field === "rate" ? Number(val) : Number(p.rate);
          const gstPercent = parseFloat(updated.gst) || 0;

          const amount = quantity * rate;
          const gRate = (amount * gstPercent) / 100;

          updated.amount = amount.toFixed(2);
          updated.gRate = gRate.toFixed(2);
        }

        return updated;
      })
    );
  };

  const handleSubmit = async () => {
    try {
      // Prepare vendor data according to backend VendorInfo struct
      const vendorData = {
        vendor_id: vendorDetails?._id || "",
        vendor_name: form.vendorName,
        po_number: form.poNumber,
        grn_number: form.grnNumber,
        bill_type: form.billType,
        address: form.address,
        state: form.state,
        phone: form.phone,
      };

      // Prepare products data with ALL fields
      const productsData = products.map(p => {
        // Extract GST percentage (remove % sign if present)
        const gstPercent = parseFloat(p.gst.replace(/%/g, '')) || 0;
        
        // Parse quantities and rates
        const quantity = parseFloat(p.qty) || 0;
        const rate = parseFloat(p.rate) || 0;
        
        // Calculate amounts
        const amount = quantity * rate;
        const gstAmount = (amount * gstPercent) / 100;
        
        return {
          product_id: p.poProduct?.product_id || "",
          product_name: p.productName,
          hsn_code: p.poProduct?.hsn_code || "",
          unit: p.unit,
          shade: p.shade,
          lot_no: p.lot,
          mill_name: p.mill,
          quantity: quantity,
          rate: rate,
          gst_percent: gstPercent,
          amount: amount,
          gst_amount: gstAmount,
        };
      });

      // Prepare bill data
      const billData = {
        party_name: form.partyName,
        bill_number: form.billNumber,
        bill_date: form.billDate,
        received_date: form.receivedDate,
        crl_number: form.crlNumber.toString(),
        mode: form.billType,
        vendor: vendorData,
        products: productsData,
      };

      // Submit to backend
      const response = await axios.post("http://localhost:8080/api/purchase-bill/", billData);
      alert(`Bill created successfully! ID: ${response.data.bill_id}`);

      // Reset form
      setForm({
        partyName: "",
        billNumber: "",
        billDate: "",
        receivedDate: "",
        crlNumber: crlCounter + 1,
        vendorName: "",
        poNumber: "",
        grnNumber: "",
        address: "",
        state: "",
        phone: "",
        billType: "",
      });
      setProducts([]);
      setVendorDetails(null);
      setCrlCounter(prev => prev + 1);
    } catch (error) {
      console.error("Bill creation failed:", error);
      alert(`Failed to create bill: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-[#2f3c4f] text-white p-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold">+ Create Purchase Bill Entry</h1>
          <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-1 rounded">← Back</button>
        </div>

        <div className="p-6 space-y-6">
          {/* Purchase Bill Details Section */}
          <section>
            <h2 className="font-medium mb-2">Purchase Bill Details</h2>
            <div className="grid grid-cols-4 gap-4 mb-4">
              {[
                "partyName",
                "billNumber",
                "billDate",
                "receivedDate",
              ].map(field => (
                <div key={field}>
                  <label className="block text-sm mb-1">
                    {field.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}
                  </label>
                  <input
                    type={field.toLowerCase().includes("date") ? "date" : "text"}
                    value={form[field]}
                    onChange={e => handleFormChange(field, e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              ))}
            </div>
            <div className="w-1/3">
              <label className="block text-sm mb-1">CRL Number</label>
              <input
                type="text"
                value={form.crlNumber}
                readOnly
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50"
              />
            </div>
          </section>

          {/* Vendor Information Section */}
          <section>
            <h2 className="font-medium mb-2">Vendor Information</h2>
            <div className="grid grid-cols-4 gap-4 mb-4">
              {/* Vendor Dropdown */}
              <div>
                <label className="block text-sm mb-1">Vendor Name</label>
                <select
                  value={form.vendorName}
                  onChange={e => handleVendorSelect(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="">Select Vendor</option>
                  {vendorOptions.map(vendor => (
                    <option key={vendor._id} value={vendor._id}>
                      {vendor.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* PO Number Field */}
              <div>
                <label className="block text-sm mb-1">PO Number</label>
                <input
                  type="text"
                  value={form.poNumber}
                  onChange={e => handleFormChange("poNumber", e.target.value)}
                  onBlur={handlePOBlur}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
                {poLoading && <p className="text-xs text-blue-500">Loading PO data...</p>}
                {poError && <p className="text-xs text-red-500">{poError}</p>}
              </div>

              {/* GRN Number Field */}
              <div>
                <label className="block text-sm mb-1">GRN Number</label>
                <input
                  type="text"
                  value={form.grnNumber}
                  onChange={e => handleFormChange("grnNumber", e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>

              {/* Bill Type Field */}
              <div>
                <label className="block text-sm mb-1">Bill Type</label>
                <input
                  type="text"
                  value={form.billType}
                  onChange={e => handleFormChange("billType", e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {["address", "state", "phone"].map(field => (
                <div key={field}>
                  <label className="block text-sm mb-1">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type="text"
                    value={form[field]}
                    onChange={e => handleFormChange(field, e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Products Section */}
          <section>
            <h2 className="font-medium mb-2">Products</h2>
            <div className="overflow-x-auto bg-white shadow rounded-lg">
              <table className="w-full text-sm text-left">
                <thead className="bg-[#2f3c4f] text-white">
                  <tr>
                    {["Product Name", "Unit", "Shade", "Lot No.", "Mill Name", "Product Qty", "Rate", "GST%", "Amount", "GRate", "Action"].map(
                      h => (
                        <th key={h} className="px-4 py-2 font-medium">
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {products.map(row => (
                    <tr key={row.id} className="even:bg-gray-50">
                      {["productName", "unit", "shade", "lot", "mill", "qty", "rate", "gst", "amount", "gRate"].map(field => (
                        <td key={field} className="px-3 py-2">
                          <input
                            type={["qty", "rate"].includes(field) ? "number" : "text"}
                            value={row[field]}
                            readOnly={field === "amount" || field === "gRate"}
                            onChange={e => updateProduct(row.id, field, e.target.value)}
                            className={`w-full border border-gray-300 rounded px-2 py-1 text-sm ${
                              field === "amount" || field === "gRate" ? "bg-gray-100" : ""
                            }`}
                          />
                        </td>
                      ))}
                      <td className="px-3 py-2">
                        <button 
                          onClick={() => removeRow(row.id)} 
                          className="text-red-500 hover:underline"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={addRow}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              + Add Row
            </button>
          </section>

          <div className="pt-6">
            <button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded shadow"
            >
              Submit Bill Entry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
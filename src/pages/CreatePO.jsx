// // import React, { useState } from 'react';
// // import { ArrowLeft, Plus, Trash2, ChevronDown } from 'lucide-react';
// // import { useNavigate } from 'react-router-dom';

// // const CreatePO = () => {
// //     const [products, setProducts] = useState([
// //         {
// //             id: 1,
// //             productCode: '',
// //             description: '',
// //             hsn: '',
// //             qty: 1,
// //             unit: 'Meter',
// //             rate: 0.00,
// //             gst: '18%',
// //             amount: 0.00
// //         }
// //     ]);

// //     const [formData, setFormData] = useState({
// //         poNumber: 'PO-202507-214',
// //         poDate: '22/07/2025',
// //         deliveryDate: '29/07/2025',
// //         paymentTerms: 'Select Terms',
// //         vendorName: '',
// //         contactPerson: '',
// //         phone: '',
// //         email: '',
// //         address: '',
// //         gstin: ''
// //     });

// //     const addNewRow = () => {
// //         const newProduct = {
// //             id: products.length + 1,
// //             productCode: '',
// //             description: '',
// //             hsn: '',
// //             qty: 1,
// //             unit: 'Meter',
// //             rate: 0.00,
// //             gst: '18%',
// //             amount: 0.00
// //         };
// //         setProducts([...products, newProduct]);
// //     };
// //     const navigate = useNavigate
// //     const removeProduct = (id) => {
// //         if (products.length > 1) {
// //             setProducts(products.filter(product => product.id !== id));
// //         }
// //     };
// //     const vendorOptions = ['ABC Textile Mills', 'Premium Cotton Suppliers', 'Silk Weavers Ltd', 'Dye & Chemical Co'];
// //     const [vendorDropdownOpen, setVendorDropdownOpen] = useState(false);

// //     const filteredVendors = vendorOptions.filter((vendor) =>
// //         vendor.toLowerCase().includes(formData.vendorName.toLowerCase())
// //     );
// //     const updateProduct = (id, field, value) => {
// //         setProducts(products.map(product => {
// //             if (product.id === id) {
// //                 const updated = { ...product, [field]: value };
// //                 if (field === 'qty' || field === 'rate') {
// //                     updated.amount = (parseFloat(updated.qty) * parseFloat(updated.rate)).toFixed(2);
// //                 }
// //                 return updated;
// //             }
// //             return product;
// //         }));
// //     };


// //     const calculateTotals = () => {
// //         const subtotal = products.reduce((sum, product) => sum + parseFloat(product.amount || 0), 0);
// //         const gstAmount = subtotal * 0.18; // Assuming 18% GST
// //         const grandTotal = subtotal + gstAmount;

// //         return {
// //             subtotal: subtotal.toFixed(2),
// //             gst: gstAmount.toFixed(2),
// //             grandTotal: grandTotal.toFixed(2)
// //         };
// //     };

// //     const totals = calculateTotals();

// //     return (
// //         <div className="min-h-screen rounded-2xl shadow-sm bg-gray-100 ">
// //             {/* Header */}
// //             <div className="bg-[#1f2a40] px-4 py-4 rounded-t-2xl shadow-sm border-b">
// //                 <div className="flex   items-center justify-between">
// //                     <div className="flex items-center space-x-2 justify-start">
// //                         <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-md">
// //                             <Plus className="w-4 h-4 text-[#1f2a40]" />
// //                         </div>
// //                         <p className="text-white font-medium">Create Purchase Order</p>
// //                     </div>
// //                     <button
// //                         onClick={() => navigate(-1)}
// //                         className="  text-amber-50 px-2 py-1 rounded-lg bg-white/30 backdrop-blur-sm mr-6 hover:bg-white/40 transition"
// //                     >
// //                         ← Back
// //                     </button>
// //                 </div>
// //             </div>

// //             {/* Company Header */}
// //             <div className="bg-gradient-to-r from-slate-600 to-blue-600 text-white  m-4.5 px-8 py-6 w-[95%] mx-auto rounded-xl">
// //                 <div className="flex justify-between items-start">
// //                     <div className="flex flex-col items-center text-center">
// //                         <h1 className="text-2xl font-bold mb-1">Kaushal Fabric</h1>
// //                         <p className="text-blue-100">Ludhiana</p>
// //                         <p className="text-blue-100 text-sm">
// //                             Phone: 9855119907 | Email: info@company.com | GSTIN: 29ABCDE1234F2Z5
// //                         </p>
// //                     </div>
// //                     <div className="text-right">
// //                         <div className="flex flex-col items-right text-right mt-2 ">
// //                             <p className=" text-xl font-semibold">PURCHASE ORDER</p>
// //                             <p className="text-sm">PO #: PO-202507-214</p>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>

// //             {/* Form Content */}
// //             <div className="p-4">
// //                 <div className="">
// //                     <div className="p-6">
// //                         <h3 className="text-lg font-semibold mb-6">Purchase Order Details</h3>

// //                         {/* Basic Details */}
// //                         <div className="grid grid-cols-4 gap-6 mb-8">
// //                             <div>
// //                                 <label className="block text-sm font-medium text-gray-700 mb-2">PO Number</label>
// //                                 <input
// //                                     type="text"
// //                                     value={formData.poNumber}
// //                                     onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })}
// //                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                                 />
// //                             </div>
// //                             <div>
// //                                 <label className="block text-sm font-medium text-gray-700 mb-2">PO Date</label>
// //                                 <input
// //                                     type="text"
// //                                     value={formData.poDate}
// //                                     onChange={(e) => setFormData({ ...formData, poDate: e.target.value })}
// //                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                                 />
// //                             </div>
// //                             <div>
// //                                 <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Date</label>
// //                                 <input
// //                                     type="text"
// //                                     value={formData.deliveryDate}
// //                                     onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
// //                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                                 />
// //                             </div>
// //                             <div>
// //                                 <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
// //                                 <select
// //                                     value={formData.paymentTerms}
// //                                     onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
// //                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                                 >
// //                                     <option>Select Terms</option>
// //                                     <option>Net 30</option>
// //                                     <option>Net 60</option>
// //                                     <option>Due on Receipt</option>
// //                                 </select>
// //                             </div>
// //                         </div>

// //                         {/* Vendor Information */}
// //                         <h3 className="text-lg font-semibold mb-4">Vendor Information</h3>
// //                         <div className="grid grid-cols-2 gap-6 mb-8">
// //                             <div className="grid grid-cols-2 gap-4">
// //                                 <div className="relative">
// //                                     <label className="block text-sm font-medium text-gray-700 mb-2">Vendor Name</label>

// //                                     {/* Input + Icon */}
// //                                     <div className="relative">
// //                                         <input
// //                                             type="text"
// //                                             placeholder="Search and select vendor..."
// //                                             value={formData.vendorName}
// //                                             onChange={(e) => {
// //                                                 setFormData({ ...formData, vendorName: e.target.value });
// //                                                 setVendorDropdownOpen(true);
// //                                             }}
// //                                             onFocus={() => setVendorDropdownOpen(true)}
// //                                             onBlur={() => setTimeout(() => setVendorDropdownOpen(false), 100)}
// //                                             className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                                         />

// //                                         {/* Dropdown arrow */}
// //                                         <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
// //                                             {/* If you're using lucide-react: */}
// //                                             <ChevronDown className="w-4 h-4 text-gray-500" />

// //                                             {/* If not using icons, replace with:
// //       <span className="text-gray-500 text-sm">▼</span> 
// //       */}
// //                                         </div>
// //                                     </div>

// //                                     {/* Dropdown list */}
// //                                     {vendorDropdownOpen && filteredVendors.length > 0 && (
// //                                         <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-md max-h-48 overflow-y-auto mt-1">
// //                                             {filteredVendors.map((vendor, index) => (
// //                                                 <li
// //                                                     key={index}
// //                                                     onClick={() => {
// //                                                         setFormData({ ...formData, vendorName: vendor });
// //                                                         setVendorDropdownOpen(false);
// //                                                     }}
// //                                                     className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
// //                                                 >
// //                                                     {vendor}
// //                                                 </li>
// //                                             ))}
// //                                         </ul>
// //                                     )}
// //                                 </div>

// //                                 <div>
// //                                     <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
// //                                     <input
// //                                         type="text"
// //                                         value={formData.contactPerson}
// //                                         onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
// //                                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                                     />
// //                                 </div>
// //                             </div>
// //                             <div className="grid grid-cols-2 gap-4">
// //                                 <div>
// //                                     <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
// //                                     <input
// //                                         type="text"
// //                                         value={formData.phone}
// //                                         onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
// //                                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                                     />
// //                                 </div>
// //                                 <div>
// //                                     <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
// //                                     <input
// //                                         type="email"
// //                                         value={formData.email}
// //                                         onChange={(e) => setFormData({ ...formData, email: e.target.value })}
// //                                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                                     />
// //                                 </div>
// //                             </div>
// //                         </div>

// //                         <div className="grid grid-cols-2 gap-6 mb-8">
// //                             <div>
// //                                 <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
// //                                 <textarea
// //                                     value={formData.address}
// //                                     onChange={(e) => setFormData({ ...formData, address: e.target.value })}
// //                                     rows="3"
// //                                     className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                                 />
// //                             </div>
// //                             <div>
// //                                 <label className="block text-sm font-medium text-gray-700 mb-2">GSTIN</label>
// //                                 <input
// //                                     type="text"
// //                                     value={formData.gstin}
// //                                     onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
// //                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                                 />
// //                             </div>
// //                         </div>

// //                         {/* Products Section */}
// //                         <div className="flex justify-between items-center mb-4">
// //                             <h3 className="text-lg font-semibold">Products</h3>
// //                             <button
// //                                 onClick={addNewRow}
// //                                 className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
// //                             >
// //                                 <Plus className="w-4 h-4 mr-2" />
// //                                 Add Row
// //                             </button>
// //                         </div>

// //                         {/* Products Table */}
// //                         <div className="overflow-x-auto  rounded-3xl mb-6">
// //                             <table className="w-full px-6 py-6 border-collapse">
// //                                 <thead>
// //                                     <tr className="bg-gray-700 text-white">
// //                                         <th className="border border-gray-300 px-3 py-2 text-left">#</th>
// //                                         <th className="border border-gray-300 px-3 py-2 text-left">Product Code</th>
// //                                         <th className="border border-gray-300 px-3 py-2 text-left">Description</th>
// //                                         <th className="border border-gray-300 px-3 py-2 text-left">HSN</th>
// //                                         <th className="border border-gray-300 px-3 py-2 text-left">Qty</th>
// //                                         <th className="border border-gray-300 px-3 py-2 text-left">Unit</th>
// //                                         <th className="border border-gray-300 px-3 py-2 text-left">Rate</th>
// //                                         <th className="border border-gray-300 px-3 py-2 text-left">GST%</th>
// //                                         <th className="border border-gray-300 px-3 py-2 text-left">Amount</th>
// //                                         <th className="border border-gray-300 px-3 py-2 text-left">Action</th>
// //                                     </tr>
// //                                 </thead>
// //                                 <tbody>
// //                                     {products.map((product, index) => (
// //                                         <tr key={product.id} className="hover:bg-gray-50">
// //                                             <td className="border border-gray-300 px-3 py-2">{index + 1}</td>

// //                                             {/* Product Code Dropdown */}
// //                                             <td className="border border-gray-300 px-3 py-2">
// //                                                 <select
// //                                                     value={product.productCode}
// //                                                     onChange={(e) => updateProduct(product.id, 'productCode', e.target.value)}
// //                                                     className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
// //                                                 >
// //                                                     <option value="">Search products</option>
// //                                                     <option>COT001-Premium Cotton Fabric-White</option>
// //                                                     <option>COT001-Premium Cotton Fabric-Blue</option>
// //                                                     <option>SLK001-Pure Silk fabri-Golden</option>
// //                                                     <option>SLK001-Pure Silk fabri-Red</option>
// //                                                     <option>POL002 Polyster Blend-Grey</option>
// //                                                     <option>DYE001-Reavtive Dye-Red</option>
// //                                                     <option>DYE001-Reavtive Dye-Blue</option>
// //                                                     <option> THR001-Cotton Thread-White</option>
// //                                                     <option> THR002- Polyster Thread-Blak</option>
// //                                                 </select>
// //                                             </td>

// //                                             {/* Description */}
// //                                             <td className="border border-gray-300 px-3 py-2">
// //                                                 <input
// //                                                     type="text"
// //                                                     placeholder="Product description"
// //                                                     value={product.description}
// //                                                     onChange={(e) => updateProduct(product.id, 'description', e.target.value)}
// //                                                     className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
// //                                                 />
// //                                             </td>

// //                                             {/* HSN */}
// //                                             <td className="border border-gray-300 px-3 py-2">
// //                                                 <input
// //                                                     type="text"
// //                                                     placeholder="HSN/SAC"
// //                                                     value={product.hsn}
// //                                                     onChange={(e) => updateProduct(product.id, 'hsn', e.target.value)}
// //                                                     className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
// //                                                 />
// //                                             </td>

// //                                             {/* Qty */}
// //                                             <td className="border border-gray-300 px-3 py-2">
// //                                                 <input
// //                                                     type="number"
// //                                                     value={product.qty}
// //                                                     onChange={(e) => updateProduct(product.id, 'qty', e.target.value)}
// //                                                     className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
// //                                                 />
// //                                             </td>

// //                                             {/* Unit Dropdown */}
// //                                             <td className="border border-gray-300 px-3 py-2">
// //                                                 <select
// //                                                     value={product.unit}
// //                                                     onChange={(e) => updateProduct(product.id, 'unit', e.target.value)}
// //                                                     className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
// //                                                 >
// //                                                     <option>Meter</option>
// //                                                     <option>Kg</option>
// //                                                     <option>Nos</option>
// //                                                     <option>Ltr</option>
// //                                                     <option>Box</option>
// //                                                     <option>Set</option>

// //                                                 </select>
// //                                             </td>

// //                                             {/* Rate */}
// //                                             <td className="border border-gray-300 px-3 py-2">
// //                                                 <input
// //                                                     type="number"
// //                                                     step="0.01"
// //                                                     value={product.rate}
// //                                                     onChange={(e) => updateProduct(product.id, 'rate', e.target.value)}
// //                                                     className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
// //                                                 />
// //                                             </td>

// //                                             {/* GST Dropdown */}
// //                                             <td className="border border-gray-300 px-3 py-2">
// //                                                 <select
// //                                                     value={product.gst}
// //                                                     onChange={(e) => updateProduct(product.id, 'gst', e.target.value)}
// //                                                     className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
// //                                                 >
// //                                                     <option>0%</option>
// //                                                     <option>5%</option>
// //                                                     <option>12%</option>
// //                                                     <option>18%</option>
// //                                                     <option>28%</option>
// //                                                 </select>
// //                                             </td>

// //                                             {/* Amount */}
// //                                             <td className="border border-gray-300 px-3 py-2 font-semibold">
// //                                                 ₹{product.amount}
// //                                             </td>

// //                                             {/* Action */}
// //                                             <td className="border border-gray-300 px-3 py-2">
// //                                                 <button
// //                                                     onClick={() => removeProduct(product.id)}
// //                                                     className="text-red-600 hover:text-red-800"
// //                                                     disabled={products.length === 1}
// //                                                 >
// //                                                     <Trash2 className="w-4 h-4" />
// //                                                 </button>
// //                                             </td>
// //                                         </tr>
// //                                     ))}
// //                                 </tbody>
// //                             </table>
// //                         </div>


// //                         {/* Totals */}
// //                         <div className="flex  mb-6">
// //                             <div className="w-full border-l-4 border-green-500 bg-green-50 p-4 rounded">
// //                                 <div className="space-y-2">
// //                                     <div className="flex justify-between">
// //                                         <span>Subtotal:</span>
// //                                         <span className="font-semibold">₹{totals.subtotal}</span>
// //                                     </div>
// //                                     <div className="flex justify-between">
// //                                         <span>Total GST:</span>
// //                                         <span className="font-semibold">₹{totals.gst}</span>
// //                                     </div>
// //                                     <div className="border-t pt-2">
// //                                         <div className="flex justify-between text-lg font-bold text-green-700">
// //                                             <span>Grand Total:</span>
// //                                             <span>₹{totals.grandTotal}</span>
// //                                         </div>
// //                                     </div>
// //                                 </div>
// //                             </div>
// //                         </div>

// //                         {/* Action Buttons */}
// //                         <div className="flex justify-center space-x-4">
// //                             <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md">
// //                                 💾 Save PO
// //                             </button>
// //                             <button className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-md">
// //                                 📄 Generate PDF
// //                             </button>
// //                             <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md">
// //                                 📧 Email PO
// //                             </button>
// //                             <button className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md">
// //                                 🗑️ Clear
// //                             </button>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>
// //         </div >
// //     );
// // };

// // export default CreatePO;  

// import React, { useState, useEffect } from 'react';
// import { ArrowLeft, Plus, Trash2, ChevronDown } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const CreatePO = () => {
//     const [products, setProducts] = useState([
//         {
//             id: 1,
//             productId: '',
//             productCode: '',
//             description: '',
//             hsn: '',
//             qty: 1,
//             unit: 'Meter',
//             rate: 0.00,
//             gst: '18%',
//             amount: 0.00
//         }
//     ]);

//     const [formData, setFormData] = useState({
//         poNumber: '',
//         poDate: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
//         deliveryDate: '',
//         paymentTerms: '',
//         vendorName: '',
//         vendorId: '',
//         contactPerson: '',
//         phone: '',
//         email: '',
//         address: '',
//         gstin: '',
//         notes: ''
//     });

//     const [vendorOptions, setVendorOptions] = useState([]);
//     const [productOptions, setProductOptions] = useState([]);
//     const [vendorDropdownOpen, setVendorDropdownOpen] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const [errors, setErrors] = useState({});
//     const navigate = useNavigate();

//     // Fetch data on component mount
//     useEffect(() => {
//         const fetchInitialData = async () => {
//             try {
//                 setIsLoading(true);

//                 // Fetch PO number
//                 const poNumberResponse = await fetch('https://textile-admin-panel.onrender.com/api/po/generate-number');
//                 const poNumberData = await poNumberResponse.json();
//                 setFormData(prev => ({ ...prev, poNumber: poNumberData.po_number }));

//                 // Fetch vendors
//                 const vendorsResponse = await fetch('https://textile-admin-panel.onrender.com/api/master/vendors');
//                 const vendorsData = await vendorsResponse.json();
//                 setVendorOptions(vendorsData);

//                 // Fetch products
//                 const productsResponse = await fetch('https://textile-admin-panel.onrender.com/api/master/products');
//                 const productsData = await productsResponse.json();
//                 setProductOptions(productsData);

//             } catch (error) {
//                 console.error('Failed to fetch initial data:', error);
//                 alert('Failed to load initial data. Please refresh the page.');
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchInitialData();
//     }, []);

//     const addNewRow = () => {
//         const newProduct = {
//             id: products.length + 1,
//             productId: '',
//             productCode: '',
//             description: '',
//             hsn: '',
//             qty: 1,
//             unit: 'Meter',
//             rate: 0.00,
//             gst: '18%',
//             amount: 0.00
//         };
//         setProducts([...products, newProduct]);
//     };

//     const removeProduct = (id) => {
//         if (products.length > 1) {
//             setProducts(products.filter(product => product.id !== id));
//         }
//     };

//     const filteredVendors = vendorOptions.filter(vendor =>
//         vendor.name.toLowerCase().includes(formData.vendorName.toLowerCase())
//     );

//     const updateProduct = (id, field, value) => {
//         setProducts(products.map(product => {
//             if (product.id === id) {
//                 const updated = { ...product, [field]: value };

//                 // Auto-fill product details when product is selected
//                 if (field === 'productId') {
//                     const selectedProduct = productOptions.find(p => p._id === value);
//                     if (selectedProduct) {
//                         updated.productCode = selectedProduct.name || '';
//                         updated.description = selectedProduct.name || '';
//                         updated.hsn = selectedProduct.hsn_code || '';
//                         updated.unit = selectedProduct.unit || 'Meter';
//                         updated.gst = selectedProduct.gst_percent ? `${selectedProduct.gst_percent}%` : '18%';
//                     }
//                 }

//                 if (field === 'qty' || field === 'rate') {
//                     updated.amount = (parseFloat(updated.qty || 0) * parseFloat(updated.rate || 0));
//                 }
//                 return updated;
//             }
//             return product;
//         }));
//     };

//     const validateForm = () => {
//         const newErrors = {};

//         // Vendor validation
//         if (!formData.vendorName.trim()) {
//             newErrors.vendorName = 'Vendor is required';
//         }

//         // Products validation
//         products.forEach((product, index) => {
//             if (!product.productId) {
//                 newErrors[`product-${index}`] = 'Product selection is required';
//             }
//             if (product.qty <= 0 || isNaN(product.qty)) {
//                 newErrors[`qty-${index}`] = 'Quantity must be greater than 0';
//             }
//             if (product.rate <= 0 || isNaN(product.rate)) {
//                 newErrors[`rate-${index}`] = 'Rate must be greater than 0';
//             }
//         });

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const calculateTotals = () => {
//         const subtotal = products.reduce((sum, product) => sum + (parseFloat(product.amount) || 0), 0);
//         const gstAmount = subtotal * 0.18; // Assuming 18% GST
//         const grandTotal = subtotal + gstAmount;

//         return {
//             subtotal: subtotal.toFixed(2),
//             gst: gstAmount.toFixed(2),
//             grandTotal: grandTotal.toFixed(2)
//         };
//     };

//     const totals = calculateTotals();

//     const handleSavePO = async () => {
//         if (!validateForm()) {
//             return;
//         }

//         setIsLoading(true);

//         // Find the selected vendor to get the ID
//         const selectedVendor = vendorOptions.find(v => v.name === formData.vendorName);
//         if (!selectedVendor) {
//             alert('Selected vendor not found');
//             setIsLoading(false);
//             return;
//         }

//         // Prepare payload for backend
//         const payload = {
//             vendor_name: formData.vendorName,
//             date: formData.poDate,
//             payment_terms: formData.paymentTerms || undefined,
//             delivery_date: formData.deliveryDate || undefined,
//             notes: formData.notes || undefined,
//             items: products.map(product => ({
//                 product_id: product.productId,
//                 quantity: parseInt(product.qty),
//                 rate: parseFloat(product.rate)
//             }))
//         };

//         try {
//             const response = await fetch('https://textile-admin-panel.onrender.com/api/po/', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(payload)
//             });

//             const data = await response.json();
//             if (response.ok) {
//                 alert(`PO created successfully! PO Number: ${data.po_number}`);
//                 navigate('/purchase-orders');
//             } else {
//                 alert(`Error: ${data.error || 'Failed to create PO'}`);
//             }
//         } catch (error) {
//             console.error('Error creating PO:', error);
//             alert('Failed to create PO. Please try again.');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleVendorSelect = (vendor) => {
//         setFormData({
//             ...formData,
//             vendorName: vendor.name,
//             vendorId: vendor._id,
//             contactPerson: vendor.contact_person || '',
//             phone: vendor.mobile_number || '',
//             email: vendor.email || '',
//             address: vendor.address || '',
//             gstin: vendor.gst_number || ''
//         });
//         setVendorDropdownOpen(false);
//     };

//     return (
//         <div className="min-h-screen rounded-2xl shadow-sm bg-gray-100">
//             {/* Header */}
//             <div className="bg-[#1f2a40] px-4 py-4 rounded-t-2xl shadow-sm border-b">
//                 <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-2 justify-start">
//                         <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-md">
//                             <Plus className="w-4 h-4 text-[#1f2a40]" />
//                         </div>
//                         <p className="text-white font-medium">Create Purchase Order</p>
//                     </div>
//                     <button
//                         onClick={() => navigate(-1)}
//                         className="text-amber-50 px-2 py-1 rounded-lg bg-white/30 backdrop-blur-sm mr-6 hover:bg-white/40 transition"
//                     >
//                         ← Back
//                     </button>
//                 </div>
//             </div>

//             {/* Company Header */}
//             <div className="bg-gradient-to-r from-slate-600 to-blue-600 text-white m-4.5 px-8 py-6 w-[95%] mx-auto rounded-xl">
//                 <div className="flex justify-between items-start">
//                     <div className="flex flex-col items-center text-center">
//                         <h1 className="text-2xl font-bold mb-1">Kaushal Fabric</h1>
//                         <p className="text-blue-100">Ludhiana</p>
//                         <p className="text-blue-100 text-sm">
//                             Phone: 9855119907 | Email: info@company.com | GSTIN: 29ABCDE1234F2Z5
//                         </p>
//                     </div>
//                     <div className="text-right">
//                         <div className="flex flex-col items-right text-right mt-2">
//                             <p className="text-xl font-semibold">PURCHASE ORDER</p>
//                             <p className="text-sm">PO #: {formData.poNumber}</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Form Content */}
//             <div className="p-4">
//                 <div className="p-6">
//                     <h3 className="text-lg font-semibold mb-6">Purchase Order Details</h3>

//                     {/* Basic Details */}
//                     <div className="grid grid-cols-4 gap-6 mb-8">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">PO Number</label>
//                             <input
//                                 type="text"
//                                 value={formData.poNumber}
//                                 readOnly
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">PO Date</label>
//                             <input
//                                 type="date"
//                                 value={formData.poDate}
//                                 onChange={(e) => setFormData({ ...formData, poDate: e.target.value })}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Date</label>
//                             <input
//                                 type="date"
//                                 value={formData.deliveryDate}
//                                 onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
//                             <select
//                                 value={formData.paymentTerms}
//                                 onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             >
//                                 <option value="">Select Terms</option>
//                                 <option value="Net 30">Net 30</option>
//                                 <option value="Net 60">Net 60</option>
//                                 <option value="Due on Receipt">Due on Receipt</option>
//                             </select>
//                         </div>
//                     </div>

//                     {/* Vendor Information */}
//                     <h3 className="text-lg font-semibold mb-4">Vendor Information</h3>
//                     <div className="grid grid-cols-2 gap-6 mb-8">
//                         <div className="grid grid-cols-2 gap-4">
//                             <div className="relative">
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">Vendor Name</label>
//                                 <div className="relative">
//                                     <input
//                                         type="text"
//                                         placeholder="Search and select vendor..."
//                                         value={formData.vendorName}
//                                         onChange={(e) => {
//                                             setFormData({ ...formData, vendorName: e.target.value });
//                                             setVendorDropdownOpen(true);
//                                         }}
//                                         onFocus={() => setVendorDropdownOpen(true)}
//                                         onBlur={() => setTimeout(() => setVendorDropdownOpen(false), 100)}
//                                         className={`w-full px-3 py-2 pr-10 border ${errors.vendorName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
//                                     />
//                                     <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
//                                         <ChevronDown className="w-4 h-4 text-gray-500" />
//                                     </div>
//                                 </div>
//                                 {errors.vendorName && (
//                                     <p className="mt-1 text-sm text-red-600">{errors.vendorName}</p>
//                                 )}
//                                 {vendorDropdownOpen && filteredVendors.length > 0 && (
//                                     <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-md max-h-48 overflow-y-auto mt-1">
//                                         {filteredVendors.map((vendor) => (
//                                             <li
//                                                 key={vendor._id}
//                                                 onClick={() => handleVendorSelect(vendor)}
//                                                 className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
//                                             >
//                                                 {vendor.name}
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 )}
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
//                                 <input
//                                     type="text"
//                                     value={formData.contactPerson}
//                                     onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 />
//                             </div>
//                         </div>
//                         <div className="grid grid-cols-2 gap-4">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
//                                 <input
//                                     type="text"
//                                     value={formData.phone}
//                                     onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
//                                 <input
//                                     type="email"
//                                     value={formData.email}
//                                     onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 />
//                             </div>
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-6 mb-8">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
//                             <textarea
//                                 value={formData.address}
//                                 onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//                                 rows="3"
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">GSTIN</label>
//                             <input
//                                 type="text"
//                                 value={formData.gstin}
//                                 onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                         </div>
//                     </div>

//                     {/* Notes Field */}
//                     <div className="mb-8">
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
//                         <textarea
//                             value={formData.notes}
//                             onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
//                             rows="2"
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     {/* Products Section */}
//                     <div className="flex justify-between items-center mb-4">
//                         <h3 className="text-lg font-semibold">Products</h3>
//                         <button
//                             onClick={addNewRow}
//                             className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
//                         >
//                             <Plus className="w-4 h-4 mr-2" />
//                             Add Row
//                         </button>
//                     </div>

//                     {/* Products Table */}
//                     <div className="overflow-x-auto rounded-3xl mb-6">
//                         <table className="w-full border-collapse">
//                             <thead>
//                                 <tr className="bg-gray-700 text-white">
//                                     <th className="border border-gray-300 px-3 py-2 text-left">#</th>
//                                     <th className="border border-gray-300 px-3 py-2 text-left">Product</th>
//                                     <th className="border border-gray-300 px-3 py-2 text-left">Description</th>
//                                     <th className="border border-gray-300 px-3 py-2 text-left">HSN</th>
//                                     <th className="border border-gray-300 px-3 py-2 text-left">Qty</th>
//                                     <th className="border border-gray-300 px-3 py-2 text-left">Unit</th>
//                                     <th className="border border-gray-300 px-3 py-2 text-left">Rate</th>
//                                     <th className="border border-gray-300 px-3 py-2 text-left">GST%</th>
//                                     <th className="border border-gray-300 px-3 py-2 text-left">Amount</th>
//                                     <th className="border border-gray-300 px-3 py-2 text-left">Action</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {products.map((product, index) => (
//                                     <tr key={product.id} className="hover:bg-gray-50">
//                                         <td className="border border-gray-300 px-3 py-2">{index + 1}</td>

//                                         {/* Product Selection */}
//                                         <td className="border border-gray-300 px-3 py-2">
//                                             <select
//                                                 value={product.productId}
//                                                 onChange={(e) => updateProduct(product.id, 'productId', e.target.value)}
//                                                 className={`w-full px-2 py-1 border ${errors[`product-${index}`] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none`}
//                                             >
//                                                 <option value="">Select product</option>
//                                                 {productOptions.map(prod => (
//                                                     <option key={prod._id} value={prod._id}>
//                                                         {prod.name}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                             {errors[`product-${index}`] && (
//                                                 <p className="mt-1 text-sm text-red-600">{errors[`product-${index}`]}</p>
//                                             )}
//                                         </td>

//                                         {/* Description */}
//                                         <td className="border border-gray-300 px-3 py-2">
//                                             <input
//                                                 type="text"
//                                                 value={product.description}
//                                                 readOnly
//                                                 className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-100"
//                                             />
//                                         </td>

//                                         {/* HSN */}
//                                         <td className="border border-gray-300 px-3 py-2">
//                                             <input
//                                                 type="text"
//                                                 value={product.hsn}
//                                                 readOnly
//                                                 className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-100"
//                                             />
//                                         </td>

//                                         {/* Qty */}
//                                         <td className="border border-gray-300 px-3 py-2">
//                                             <input
//                                                 type="number"
//                                                 min="1"
//                                                 value={product.qty}
//                                                 onChange={(e) => updateProduct(product.id, 'qty', e.target.value)}
//                                                 className={`w-full px-2 py-1 border ${errors[`qty-${index}`] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none`}
//                                             />
//                                             {errors[`qty-${index}`] && (
//                                                 <p className="mt-1 text-sm text-red-600">{errors[`qty-${index}`]}</p>
//                                             )}
//                                         </td>

//                                         {/* Unit */}
//                                         <td className="border border-gray-300 px-3 py-2">
//                                             <input
//                                                 type="text"
//                                                 value={product.unit}
//                                                 readOnly
//                                                 className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-100"
//                                             />
//                                         </td>

//                                         {/* Rate */}
//                                         <td className="border border-gray-300 px-3 py-2">
//                                             <input
//                                                 type="number"
//                                                 step="0.01"
//                                                 min="0.01"
//                                                 value={product.rate}
//                                                 onChange={(e) => updateProduct(product.id, 'rate', e.target.value)}
//                                                 className={`w-full px-2 py-1 border ${errors[`rate-${index}`] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none`}
//                                             />
//                                             {errors[`rate-${index}`] && (
//                                                 <p className="mt-1 text-sm text-red-600">{errors[`rate-${index}`]}</p>
//                                             )}
//                                         </td>

//                                         {/* GST */}
//                                         <td className="border border-gray-300 px-3 py-2">
//                                             <input
//                                                 type="text"
//                                                 value={product.gst}
//                                                 readOnly
//                                                 className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-100"
//                                             />
//                                         </td>

//                                         {/* Amount */}
//                                         <td className="border border-gray-300 px-3 py-2 font-semibold">
//                                             ₹{product.amount.toFixed(2)}
//                                         </td>

//                                         {/* Action */}
//                                         <td className="border border-gray-300 px-3 py-2">
//                                             <button
//                                                 onClick={() => removeProduct(product.id)}
//                                                 className="text-red-600 hover:text-red-800"
//                                                 disabled={products.length === 1}
//                                             >
//                                                 <Trash2 className="w-4 h-4" />
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>

//                     {/* Totals */}
//                     <div className="flex mb-6">
//                         <div className="w-full border-l-4 border-green-500 bg-green-50 p-4 rounded">
//                             <div className="space-y-2">
//                                 <div className="flex justify-between">
//                                     <span>Subtotal:</span>
//                                     <span className="font-semibold">₹{totals.subtotal}</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span>Total GST:</span>
//                                     <span className="font-semibold">₹{totals.gst}</span>
//                                 </div>
//                                 <div className="border-t pt-2">
//                                     <div className="flex justify-between text-lg font-bold text-green-700">
//                                         <span>Grand Total:</span>
//                                         <span>₹{totals.grandTotal}</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="flex justify-center space-x-4">
//                         <button 
//                             onClick={handleSavePO}
//                             disabled={isLoading}
//                             className={`bg-green-600 text-white px-6 py-2 rounded-md ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
//                         >
//                             {isLoading ? 'Saving...' : '💾 Save PO'}
//                         </button>
//                         <button 
//                             className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-md"
//                             disabled
//                         >
//                             📄 Generate PDF
//                         </button>
//                         <button 
//                             className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md"
//                             disabled
//                         >
//                             📧 Email PO
//                         </button>
//                         <button 
//                             className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md"
//                             onClick={() => window.location.reload()}
//                         >
//                             🗑️ Clear
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CreatePO;

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreatePO = () => {
    const [products, setProducts] = useState([
        {
            id: 1,
            productId: '',
            productCode: '',
            description: '',
            hsn: '',
            qty: 1,
            unit: 'Meter',
            rate: 0.00,
            gst: '18%',
            amount: 0.00
        }
    ]);

    const [formData, setFormData] = useState({
        poNumber: '',
        poDate: new Date().toISOString().split('T')[0],
        deliveryDate: '',
        paymentTerms: '',
        vendorName: '',
        vendorId: '',
        contactPerson: '',
        phone: '',
        email: '',
        address: '',
        gstin: '',
        notes: ''
    });

    const [vendorOptions, setVendorOptions] = useState([]);
    const [productOptions, setProductOptions] = useState([]);
    const [vendorDropdownOpen, setVendorDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Fetch data on component mount
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setIsLoading(true);

                // Fetch PO number
                const poNumberResponse = await fetch('https://textile-admin-panel.onrender.com/api/po/generate-number');
                const poNumberData = await poNumberResponse.json();
                setFormData(prev => ({ ...prev, poNumber: poNumberData.po_number }));

                // Fetch vendors - filter by "Supplier" category and handle null values
                const vendorsResponse = await fetch('https://textile-admin-panel.onrender.com/api/master/vendors');
                const vendorsData = await vendorsResponse.json();
                const supplierVendors = vendorsData.filter(vendor =>
                    vendor.category === "Supplier"
                );
                setVendorOptions(supplierVendors);

                // Fetch products
                const productsResponse = await fetch('https://textile-admin-panel.onrender.com/api/master/products');
                const productsData = await productsResponse.json();
                setProductOptions(productsData);

            } catch (error) {
                console.error('Failed to fetch initial data:', error);
                alert('Failed to load initial data. Please refresh the page.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const addNewRow = () => {
        const newProduct = {
            id: products.length + 1,
            productId: '',
            productCode: '',
            description: '',
            hsn: '',
            qty: 1,
            unit: 'Meter',
            rate: 0.00,
            gst: '18%',
            amount: 0.00
        };
        setProducts([...products, newProduct]);
    };

    const removeProduct = (id) => {
        if (products.length > 1) {
            setProducts(products.filter(product => product.id !== id));
        }
    };

    const filteredVendors = vendorOptions.filter(vendor =>
        vendor.name.toLowerCase().includes(formData.vendorName.toLowerCase())
    );

    const updateProduct = (id, field, value) => {
        setProducts(products.map(product => {
            if (product.id === id) {
                const updated = { ...product, [field]: value };

                // Auto-fill product details when product is selected
                if (field === 'productId') {
                    const selectedProduct = productOptions.find(p => p.id === value);
                    if (selectedProduct) {
                        updated.productCode = selectedProduct.name || '';
                        updated.description = selectedProduct.name || '';
                        updated.hsn = selectedProduct.hsn_code || '';
                        updated.unit = selectedProduct.unit || 'Meter';
                        updated.gst = selectedProduct.gst_percent ? `${selectedProduct.gst_percent}%` : '18%';
                    }
                }

                if (field === 'qty' || field === 'rate') {
                    updated.amount = (parseFloat(updated.qty || 0) * parseFloat(updated.rate || 0));
                }
                return updated;
            }
            return product;
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        // Vendor validation
        if (!formData.vendorName.trim()) {
            newErrors.vendorName = 'Vendor is required';
        }

        // Products validation
        products.forEach((product, index) => {
            if (!product.productId) {
                newErrors[`product-${index}`] = 'Product selection is required';
            }
            if (product.qty <= 0 || isNaN(product.qty)) {
                newErrors[`qty-${index}`] = 'Quantity must be greater than 0';
            }
            if (product.rate <= 0 || isNaN(product.rate)) {
                newErrors[`rate-${index}`] = 'Rate must be greater than 0';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const calculateTotals = () => {
        const subtotal = products.reduce((sum, product) => sum + (parseFloat(product.amount) || 0), 0);

        // Calculate GST based on product-specific rates
        const gstAmount = products.reduce((sum, product) => {
            const gstPercent = parseFloat(product.gst) || 18;
            return sum + (parseFloat(product.amount) * (gstPercent / 100));
        }, 0);

        const grandTotal = subtotal + gstAmount;

        return {
            subtotal: subtotal.toFixed(2),
            gst: gstAmount.toFixed(2),
            grandTotal: grandTotal.toFixed(2)
        };
    };

    const totals = calculateTotals();

    const handleSavePO = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        // Find the selected vendor to get the ID
        const selectedVendor = vendorOptions.find(v => v.name === formData.vendorName);
        if (!selectedVendor) {
            alert('Selected vendor not found');
            setIsLoading(false);
            return;
        }

        // Prepare payload for backend
        const payload = {
            po_number: formData.poNumber,
            vendor_id: selectedVendor.id,
            vendor_name: formData.vendorName,
            date: formData.poDate,
            delivery_date: formData.deliveryDate || undefined,
            payment_terms: formData.paymentTerms || undefined,
            notes: formData.notes || undefined,
            items: products.map(product => ({
                product_id: product.productId,
                product_name: product.description,
                hsn_code: product.hsn,
                quantity: parseInt(product.qty),
                unit: product.unit,
                rate: parseFloat(product.rate),
                gst_percent: parseFloat(product.gst),
                amount: parseFloat(product.amount)
            })),
            subtotal: parseFloat(totals.subtotal),
            gst_amount: parseFloat(totals.gst),
            grand_total: parseFloat(totals.grandTotal)
        };

        try {
            const response = await fetch('https://textile-admin-panel.onrender.com/api/po/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            if (response.ok) {
                alert(`PO created successfully! PO Number: ${data.po_number}`);
                navigate('/purchase-orders');
            } else {
                alert(`Error: ${data.error || 'Failed to create PO'}`);
            }
        } catch (error) {
            console.error('Error creating PO:', error);
            alert('Failed to create PO. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVendorSelect = (vendor) => {
        setFormData({
            ...formData,
            vendorName: vendor.name,
            vendorId: vendor.id,
            contactPerson: vendor.contact_person || '',
            phone: vendor.mobile_number || '',
            email: vendor.email || '',
            address: `${vendor.address || ''}, ${vendor.city || ''}, ${vendor.state || ''}`,
            gstin: vendor.gst_number || ''
        });
        setVendorDropdownOpen(false);
    };

    return (
        <div className="min-h-screen rounded-2xl shadow-sm bg-gray-100">
            {/* Header */}
            <div className="bg-[#1f2a40] px-4 py-4 rounded-t-2xl shadow-sm border-b">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 justify-start">
                        <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-md">
                            <Plus className="w-4 h-4 text-[#1f2a40]" />
                        </div>
                        <p className="text-white font-medium">Create Purchase Order</p>
                    </div>
                    <button
                        onClick={() => navigate(-1)}
                        className="text-amber-50 px-2 py-1 rounded-lg bg-white/30 backdrop-blur-sm mr-6 hover:bg-white/40 transition"
                    >
                        ← Back
                    </button>
                </div>
            </div>

            {/* Company Header */}
            <div className="bg-gradient-to-r from-slate-600 to-blue-600 text-white m-4.5 px-8 py-6 w-[95%] mx-auto rounded-xl">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col items-center text-center">
                        <h1 className="text-2xl font-bold mb-1">Kaushal Fabric</h1>
                        <p className="text-blue-100">Ludhiana</p>
                        <p className="text-blue-100 text-sm">
                            Phone: 9855119907 | Email: info@company.com | GSTIN: 29ABCDE1234F2Z5
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="flex flex-col items-right text-right mt-2">
                            <p className="text-xl font-semibold">PURCHASE ORDER</p>
                            <p className="text-sm">PO #: {formData.poNumber}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Content */}
            <div className="p-4">
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-6">Purchase Order Details</h3>

                    {/* Basic Details */}
                    <div className="grid grid-cols-4 gap-6 mb-8">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">PO Number</label>
                            <input
                                type="text"
                                value={formData.poNumber}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">PO Date</label>
                            <input
                                type="date"
                                value={formData.poDate}
                                onChange={(e) => setFormData({ ...formData, poDate: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Date</label>
                            <input
                                type="date"
                                value={formData.deliveryDate}
                                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
                            <select
                                value={formData.paymentTerms}
                                onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Terms</option>
                                <option value="Net 30">Cash</option>
                                <option value="Due on Receipt">Credit</option>
                            </select>
                        </div>
                    </div>

                    {/* Vendor Information */}
                    <h3 className="text-lg font-semibold mb-4">Vendor Information</h3>
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Vendor Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search and select vendor..."
                                        value={formData.vendorName}
                                        onChange={(e) => {
                                            setFormData({ ...formData, vendorName: e.target.value });
                                            setVendorDropdownOpen(true);
                                        }}
                                        onFocus={() => setVendorDropdownOpen(true)}
                                        onBlur={() => setTimeout(() => setVendorDropdownOpen(false), 200)} // Increased delay
                                        className={`w-full px-3 py-2 pr-10 border ${errors.vendorName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                    <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                                        <ChevronDown className="w-4 h-4 text-gray-500" />
                                    </div>
                                </div>
                                {errors.vendorName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.vendorName}</p>
                                )}
                                {vendorDropdownOpen && filteredVendors.length > 0 && (
                                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-md max-h-48 overflow-y-auto mt-1">
                                        {filteredVendors.map((vendor) => (
                                            <li
                                                key={vendor.id}
                                                onMouseDown={(e) => e.preventDefault()} // Prevent blur from firing
                                                onClick={() => handleVendorSelect(vendor)}
                                                className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                                            >
                                                {vendor.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                                <input
                                    type="text"
                                    value={formData.contactPerson}
                                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                            <textarea
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">GSTIN</label>
                            <input
                                type="text"
                                value={formData.gstin}
                                onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Notes Field */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows="2"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Products Section */}
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Products</h3>
                        <button
                            onClick={addNewRow}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Row
                        </button>
                    </div>

                    {/* Products Table */}
                    <div className="overflow-x-auto rounded-3xl mb-6">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-700 text-white">
                                    <th className="border border-gray-300 px-3 py-2 text-left">#</th>
                                    <th className="border border-gray-300 px-3 py-2 text-left">Product</th>
                                    <th className="border border-gray-300 px-3 py-2 text-left">Description</th>
                                    <th className="border border-gray-300 px-3 py-2 text-left">HSN</th>
                                    <th className="border border-gray-300 px-3 py-2 text-left">Qty</th>
                                    <th className="border border-gray-300 px-3 py-2 text-left">Unit</th>
                                    <th className="border border-gray-300 px-3 py-2 text-left">Rate</th>
                                    <th className="border border-gray-300 px-3 py-2 text-left">GST%</th>
                                    <th className="border border-gray-300 px-3 py-2 text-left">Amount</th>
                                    <th className="border border-gray-300 px-3 py-2 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product, index) => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="border border-gray-300 px-3 py-2">{index + 1}</td>

                                        {/* Product Selection */}
                                        <td className="border border-gray-300 px-3 py-2">
                                            <select
                                                value={product.productId}
                                                onChange={(e) => updateProduct(product.id, 'productId', e.target.value)}
                                                className={`w-full px-2 py-1 border ${errors[`product-${index}`] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none`}
                                            >
                                                <option value="">Select product</option>
                                                {productOptions.map(prod => (
                                                    <option key={prod.id} value={prod.id}>
                                                        {prod.name} ({prod.hsn_code})
                                                    </option>
                                                ))}
                                            </select>
                                            {errors[`product-${index}`] && (
                                                <p className="mt-1 text-sm text-red-600">{errors[`product-${index}`]}</p>
                                            )}
                                        </td>

                                        {/* Description */}
                                        <td className="border border-gray-300 px-3 py-2">
                                            <input
                                                type="text"
                                                value={product.description}
                                                readOnly
                                                className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-100"
                                            />
                                        </td>

                                        {/* HSN */}
                                        <td className="border border-gray-300 px-3 py-2">
                                            <input
                                                type="text"
                                                value={product.hsn}
                                                readOnly
                                                className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-100"
                                            />
                                        </td>

                                        {/* Qty */}
                                        <td className="border border-gray-300 px-3 py-2">
                                            <input
                                                type="number"
                                                min="1"
                                                value={product.qty}
                                                onChange={(e) => updateProduct(product.id, 'qty', e.target.value)}
                                                className={`w-full px-2 py-1 border ${errors[`qty-${index}`] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none`}
                                            />
                                            {errors[`qty-${index}`] && (
                                                <p className="mt-1 text-sm text-red-600">{errors[`qty-${index}`]}</p>
                                            )}
                                        </td>

                                        {/* Unit */}
                                        <td className="border border-gray-300 px-3 py-2">
                                            <input
                                                type="text"
                                                value={product.unit}
                                                readOnly
                                                className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-100"
                                            />
                                        </td>

                                        {/* Rate */}
                                        <td className="border border-gray-300 px-3 py-2">
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0.01"
                                                value={product.rate}
                                                onChange={(e) => updateProduct(product.id, 'rate', e.target.value)}
                                                className={`w-full px-2 py-1 border ${errors[`rate-${index}`] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none`}
                                            />
                                            {errors[`rate-${index}`] && (
                                                <p className="mt-1 text-sm text-red-600">{errors[`rate-${index}`]}</p>
                                            )}
                                        </td>

                                        {/* GST */}
                                        <td className="border border-gray-300 px-3 py-2">
                                            <input
                                                type="text"
                                                value={product.gst}
                                                readOnly
                                                className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-100"
                                            />
                                        </td>

                                        {/* Amount */}
                                        <td className="border border-gray-300 px-3 py-2 font-semibold">
                                            ₹{product.amount.toFixed(2)}
                                        </td>

                                        {/* Action */}
                                        <td className="border border-gray-300 px-3 py-2">
                                            <button
                                                onClick={() => removeProduct(product.id)}
                                                className="text-red-600 hover:text-red-800"
                                                disabled={products.length === 1}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="flex mb-6">
                        <div className="w-full border-l-4 border-green-500 bg-green-50 p-4 rounded">
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span className="font-semibold">₹{totals.subtotal}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total GST:</span>
                                    <span className="font-semibold">₹{totals.gst}</span>
                                </div>
                                <div className="border-t pt-2">
                                    <div className="flex justify-between text-lg font-bold text-green-700">
                                        <span>Grand Total:</span>
                                        <span>₹{totals.grandTotal}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={handleSavePO}
                            disabled={isLoading}
                            className={`bg-green-600 text-white px-6 py-2 rounded-md ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
                        >
                            {isLoading ? 'Saving...' : '💾 Save PO'}
                        </button>
                        <button
                            className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-md"
                            disabled
                        >
                            📄 Generate PDF
                        </button>
                        <button
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md"
                            disabled
                        >
                            📧 Email PO
                        </button>
                        <button
                            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md"
                            onClick={() => window.location.reload()}
                        >
                            🗑️ Clear
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePO;
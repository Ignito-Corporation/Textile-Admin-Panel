import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreatePO = () => {
    const [products, setProducts] = useState([
        {
            id: 1,
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
        poNumber: 'PO-202507-214',
        poDate: '22/07/2025',
        deliveryDate: '29/07/2025',
        paymentTerms: 'Select Terms',
        vendorName: '',
        contactPerson: '',
        phone: '',
        email: '',
        address: '',
        gstin: ''
    });

    const addNewRow = () => {
        const newProduct = {
            id: products.length + 1,
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
    const navigate = useNavigate
    const removeProduct = (id) => {
        if (products.length > 1) {
            setProducts(products.filter(product => product.id !== id));
        }
    };
    const vendorOptions = ['ABC Textile Mills', 'Premium Cotton Suppliers', 'Silk Weavers Ltd', 'Dye & Chemical Co'];
    const [vendorDropdownOpen, setVendorDropdownOpen] = useState(false);

    const filteredVendors = vendorOptions.filter((vendor) =>
        vendor.toLowerCase().includes(formData.vendorName.toLowerCase())
    );
    const updateProduct = (id, field, value) => {
        setProducts(products.map(product => {
            if (product.id === id) {
                const updated = { ...product, [field]: value };
                if (field === 'qty' || field === 'rate') {
                    updated.amount = (parseFloat(updated.qty) * parseFloat(updated.rate)).toFixed(2);
                }
                return updated;
            }
            return product;
        }));
    };


    const calculateTotals = () => {
        const subtotal = products.reduce((sum, product) => sum + parseFloat(product.amount || 0), 0);
        const gstAmount = subtotal * 0.18; // Assuming 18% GST
        const grandTotal = subtotal + gstAmount;

        return {
            subtotal: subtotal.toFixed(2),
            gst: gstAmount.toFixed(2),
            grandTotal: grandTotal.toFixed(2)
        };
    };

    const totals = calculateTotals();

    return (
        <div className="min-h-screen rounded-2xl shadow-sm bg-gray-100 ">
            {/* Header */}
            <div className="bg-[#1f2a40] px-4 py-4 rounded-t-2xl shadow-sm border-b">
                <div className="flex   items-center justify-between">
                    <div className="flex items-center space-x-2 justify-start">
                        <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-md">
                            <Plus className="w-4 h-4 text-[#1f2a40]" />
                        </div>
                        <p className="text-white font-medium">Create Purchase Order</p>
                    </div>
                    <button
                        onClick={() => navigate(-1)}
                        className="  text-amber-50 px-2 py-1 rounded-lg bg-white/30 backdrop-blur-sm mr-6 hover:bg-white/40 transition"
                    >
                        ← Back
                    </button>
                </div>
            </div>

            {/* Company Header */}
            <div className="bg-gradient-to-r from-slate-600 to-blue-600 text-white  m-4.5 px-8 py-6 w-[95%] mx-auto rounded-xl">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col items-center text-center">
                        <h1 className="text-2xl font-bold mb-1">Kaushal Fabric</h1>
                        <p className="text-blue-100">Ludhiana</p>
                        <p className="text-blue-100 text-sm">
                            Phone: 9855119907 | Email: info@company.com | GSTIN: 29ABCDE1234F2Z5
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="flex flex-col items-right text-right mt-2 ">
                            <p className=" text-xl font-semibold">PURCHASE ORDER</p>
                            <p className="text-sm">PO #: PO-202507-214</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Content */}
            <div className="p-4">
                <div className="">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-6">Purchase Order Details</h3>

                        {/* Basic Details */}
                        <div className="grid grid-cols-4 gap-6 mb-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">PO Number</label>
                                <input
                                    type="text"
                                    value={formData.poNumber}
                                    onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">PO Date</label>
                                <input
                                    type="text"
                                    value={formData.poDate}
                                    onChange={(e) => setFormData({ ...formData, poDate: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Date</label>
                                <input
                                    type="text"
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
                                    <option>Select Terms</option>
                                    <option>Net 30</option>
                                    <option>Net 60</option>
                                    <option>Due on Receipt</option>
                                </select>
                            </div>
                        </div>

                        {/* Vendor Information */}
                        <h3 className="text-lg font-semibold mb-4">Vendor Information</h3>
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Vendor Name</label>

                                    {/* Input + Icon */}
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
                                            onBlur={() => setTimeout(() => setVendorDropdownOpen(false), 100)}
                                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />

                                        {/* Dropdown arrow */}
                                        <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                                            {/* If you're using lucide-react: */}
                                            <ChevronDown className="w-4 h-4 text-gray-500" />

                                            {/* If not using icons, replace with:
      <span className="text-gray-500 text-sm">▼</span> 
      */}
                                        </div>
                                    </div>

                                    {/* Dropdown list */}
                                    {vendorDropdownOpen && filteredVendors.length > 0 && (
                                        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-md max-h-48 overflow-y-auto mt-1">
                                            {filteredVendors.map((vendor, index) => (
                                                <li
                                                    key={index}
                                                    onClick={() => {
                                                        setFormData({ ...formData, vendorName: vendor });
                                                        setVendorDropdownOpen(false);
                                                    }}
                                                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                                                >
                                                    {vendor}
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
                                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        <div className="overflow-x-auto  rounded-3xl mb-6">
                            <table className="w-full px-6 py-6 border-collapse">
                                <thead>
                                    <tr className="bg-gray-700 text-white">
                                        <th className="border border-gray-300 px-3 py-2 text-left">#</th>
                                        <th className="border border-gray-300 px-3 py-2 text-left">Product Code</th>
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

                                            {/* Product Code Dropdown */}
                                            <td className="border border-gray-300 px-3 py-2">
                                                <select
                                                    value={product.productCode}
                                                    onChange={(e) => updateProduct(product.id, 'productCode', e.target.value)}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
                                                >
                                                    <option value="">Search products</option>
                                                    <option>COT001-Premium Cotton Fabric-White</option>
                                                    <option>COT001-Premium Cotton Fabric-Blue</option>
                                                    <option>SLK001-Pure Silk fabri-Golden</option>
                                                    <option>SLK001-Pure Silk fabri-Red</option>
                                                    <option>POL002 Polyster Blend-Grey</option>
                                                    <option>DYE001-Reavtive Dye-Red</option>
                                                    <option>DYE001-Reavtive Dye-Blue</option>
                                                    <option> THR001-Cotton Thread-White</option>
                                                    <option> THR002- Polyster Thread-Blak</option>
                                                </select>
                                            </td>

                                            {/* Description */}
                                            <td className="border border-gray-300 px-3 py-2">
                                                <input
                                                    type="text"
                                                    placeholder="Product description"
                                                    value={product.description}
                                                    onChange={(e) => updateProduct(product.id, 'description', e.target.value)}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
                                                />
                                            </td>

                                            {/* HSN */}
                                            <td className="border border-gray-300 px-3 py-2">
                                                <input
                                                    type="text"
                                                    placeholder="HSN/SAC"
                                                    value={product.hsn}
                                                    onChange={(e) => updateProduct(product.id, 'hsn', e.target.value)}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
                                                />
                                            </td>

                                            {/* Qty */}
                                            <td className="border border-gray-300 px-3 py-2">
                                                <input
                                                    type="number"
                                                    value={product.qty}
                                                    onChange={(e) => updateProduct(product.id, 'qty', e.target.value)}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
                                                />
                                            </td>

                                            {/* Unit Dropdown */}
                                            <td className="border border-gray-300 px-3 py-2">
                                                <select
                                                    value={product.unit}
                                                    onChange={(e) => updateProduct(product.id, 'unit', e.target.value)}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
                                                >
                                                    <option>Meter</option>
                                                    <option>Kg</option>
                                                    <option>Nos</option>
                                                    <option>Ltr</option>
                                                    <option>Box</option>
                                                    <option>Set</option>

                                                </select>
                                            </td>

                                            {/* Rate */}
                                            <td className="border border-gray-300 px-3 py-2">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={product.rate}
                                                    onChange={(e) => updateProduct(product.id, 'rate', e.target.value)}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
                                                />
                                            </td>

                                            {/* GST Dropdown */}
                                            <td className="border border-gray-300 px-3 py-2">
                                                <select
                                                    value={product.gst}
                                                    onChange={(e) => updateProduct(product.id, 'gst', e.target.value)}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
                                                >
                                                    <option>0%</option>
                                                    <option>5%</option>
                                                    <option>12%</option>
                                                    <option>18%</option>
                                                    <option>28%</option>
                                                </select>
                                            </td>

                                            {/* Amount */}
                                            <td className="border border-gray-300 px-3 py-2 font-semibold">
                                                ₹{product.amount}
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
                        <div className="flex  mb-6">
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
                            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md">
                                💾 Save PO
                            </button>
                            <button className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-md">
                                📄 Generate PDF
                            </button>
                            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md">
                                📧 Email PO
                            </button>
                            <button className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md">
                                🗑️ Clear
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default CreatePO;  
import React, { useState } from 'react';
import { FileDown } from 'lucide-react';

export default function FinalStock() {
    const [finalProduct, setFinalProduct] = useState({
        productName: '',
        quantity: '',
        voucherNumber: '',
        date: ''
    });

    const [outProduct, setOutProduct] = useState({
        productName: '',
        quantity: '',
        partyName: '',
        process: '',
        date: ''
    });

    const handleFinalChange = (e) => {
        setFinalProduct({ ...finalProduct, [e.target.name]: e.target.value });
    };

    const handleOutChange = (e) => {
        setOutProduct({ ...outProduct, [e.target.name]: e.target.value });
    };

    return (
        <div className="p-8 w-full">
            <h2 className="text-2xl font-bold mb-6">All final product</h2>

            <div className="mb-6">
                <h3 className="font-semibold mb-2">Enter Details</h3>
                <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="flex flex-col">
                        <label htmlFor="productName" className="mb-1 font-sm">Product Name*</label>
                        <input id="productName" name="productName" onChange={handleFinalChange} placeholder="Enter product name" className="p-2 border rounded" />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="quantity" className="mb-1 font-sm">Quantity</label>
                        <input id="quantity" name="quantity" onChange={handleFinalChange} placeholder="Enter quantity" className="p-2 border rounded" />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="voucherNumber" className="mb-1 font-sm">Voucher Number</label>
                        <input id="voucherNumber" name="voucherNumber" onChange={handleFinalChange} placeholder="Enter voucher number" className="p-2 border rounded" />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="date" className="mb-1 font-sm">Date</label>
                        <input id="date" type="date" name="date" onChange={handleFinalChange} className="p-2 border rounded" />
                    </div>
                </div>
                <div className="flex justify-end">
                    <button className="bg-green-700 text-white px-4 py-2 rounded-sm">Save Data</button>
                </div>
            </div>

            <table className="w-full border-collapse rounded-2xl overflow-hidden shadow">
                <thead>
                    <tr className="bg-[#2f3c4f] text-white">
                        <th className="p-2 border">Product Name</th>
                        <th className="p-2 border">Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {Array(7).fill(0).map((_, index) => (
                        <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>
                            <td className="p-2 border text-center">-</td>
                            <td className="p-2 border text-center">-</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-start mb-10 mt-4">
                <button className="bg-green-700 text-white px-4 py-2 rounded-sm flex items-center gap-2">
                    <FileDown size={18} />
                    Generate Pdf
                </button>
            </div>

            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Out Product</h2>
                <h3 className="font-semibold mb-2">Enter Details</h3>
                <div className="grid grid-cols-5 gap-4 mb-4">
                    <div className="flex flex-col">
                        <label htmlFor="outProductName" className="mb-1 font-sm">Product Name*</label>
                        <input id="outProductName" name="productName" onChange={handleOutChange} placeholder="Enter product name" className="p-2 border rounded" />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="outQuantity" className="mb-1 font-sm">Quantity</label>
                        <input id="outQuantity" name="quantity" onChange={handleOutChange} placeholder="Enter quantity" className="p-2 border rounded" />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="partyName" className="mb-1 font-sm">Party Name</label>
                        <input id="partyName" name="partyName" onChange={handleOutChange} placeholder="Enter party name" className="p-2 border rounded" />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="process" className="mb-1 font-sm">Process</label>
                        <input id="process" name="process" onChange={handleOutChange} placeholder="Enter process" className="p-2 border rounded" />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="outDate" className="mb-1 font-sm">Date</label>
                        <input id="outDate" type="date" name="date" onChange={handleOutChange} className="p-2 border rounded" />
                    </div>
                </div>
                <div className="flex justify-end">
                    <button className="bg-green-700 text-white px-4 py-2 rounded-sm">Save Data</button>
                </div>
            </div>

            <table className="w-full border-collapse rounded-2xl overflow-hidden shadow">
                <thead>
                    <tr className="bg-[#2f3c4f] text-white">
                        <th className="p-2 border">Product Name</th>
                        <th className="p-2 border">Quantity</th>
                        <th className="p-2 border">Party Name</th>
                        <th className="p-2 border">Process</th>
                        <th className="p-2 border">Date</th>
                        <th className="p-2 border">Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {Array(3).fill(0).map((_, index) => (
                        <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>
                            <td className="p-2 border text-center">-</td>
                            <td className="p-2 border text-center">-</td>
                            <td className="p-2 border text-center">-</td>
                            <td className="p-2 border text-center">-</td>
                            <td className="p-2 border text-center">-</td>
                            <td className="p-2 border text-center">-</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-start mb-10 mt-4">
                <button className="bg-green-700 text-white px-4 py-2 rounded-sm flex items-center gap-2">
                    <FileDown size={18} />
                    Generate Pdf
                </button>
            </div>
        </div>
    );
}

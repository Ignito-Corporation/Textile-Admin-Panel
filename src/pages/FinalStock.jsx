'use client';

import React, { useState, useEffect } from 'react';
import { FileDown } from 'lucide-react';

const API_URL = 'http://localhost:8080/api/';

export default function FinalStock() {
    // State for final products
    const [finalStockList, setFinalStockList] = useState([]);
    const [finalProduct, setFinalProduct] = useState({
        product_name: '',
        quantity: '',
        voucher_number: '',
        date: ''
    });

    // State for out products
    const [outProductList, setOutProductList] = useState([]);
    const [outProduct, setOutProduct] = useState({
        product_name: '',
        quantity: '',
        party_name: '',
        process: '',
        date: ''
    });

    const [loading, setLoading] = useState(false);

    // Fetch data on component mount
    useEffect(() => {
        fetchFinalStock();
        fetchOutProducts();
    }, []);

    const fetchFinalStock = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/finalstock`);
            if (!response.ok) throw new Error('Failed to fetch final stock');
            const data = await response.json();
            setFinalStockList(data || []);
        } catch (error) {
            console.error("Error fetching final stock:", error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchOutProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/outproducts`);
            if (!response.ok) throw new Error('Failed to fetch out products');
            const data = await response.json();
            setOutProductList(data || []);
        } catch (error) {
            console.error("Error fetching out products:", error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFinalChange = (e) => {
        setFinalProduct({ ...finalProduct, [e.target.name]: e.target.value });
    };

    const handleOutChange = (e) => {
        setOutProduct({ ...outProduct, [e.target.name]: e.target.value });
    };

    const handleSaveFinalStock = async () => {
        if (!finalProduct.product_name || !finalProduct.quantity) {
            alert('Product Name and Quantity are required for Final Stock.');
            return;
        }
        setLoading(true);
        try {
            const payload = {
                ...finalProduct,
                quantity: parseFloat(finalProduct.quantity)
            };
            const response = await fetch(`${API_URL}/finalstock`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Failed to save final stock');
            alert('Final stock saved successfully!');
            setFinalProduct({ product_name: '', quantity: '', voucher_number: '', date: '' });
            fetchFinalStock(); // Refresh list
        } catch (error) {
            console.error("Error saving final stock:", error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveOutProduct = async () => {
        if (!outProduct.product_name || !outProduct.quantity) {
            alert('Product Name and Quantity are required for Out Product.');
            return;
        }
        setLoading(true);
        try {
            const payload = {
                ...outProduct,
                quantity: parseFloat(outProduct.quantity)
            };
            const response = await fetch(`${API_URL}/outproducts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Failed to save out product');
            alert('Out product saved successfully!');
            setOutProduct({ product_name: '', quantity: '', party_name: '', process: '', date: '' });
            fetchOutProducts(); // Refresh list
        } catch (error) {
            console.error("Error saving out product:", error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 w-full">
            {/* Final Product Section */}
            <h2 className="text-2xl font-bold mb-6">All Final Product</h2>
            <div className="mb-6 p-4 border rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2">Enter Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex flex-col">
                        <label htmlFor="product_name" className="mb-1 font-sm">Product Name*</label>
                        <input id="product_name" name="product_name" value={finalProduct.product_name} onChange={handleFinalChange} placeholder="Enter product name" className="p-2 border rounded" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="quantity" className="mb-1 font-sm">Quantity*</label>
                        <input id="quantity" name="quantity" type="number" value={finalProduct.quantity} onChange={handleFinalChange} placeholder="Enter quantity" className="p-2 border rounded" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="voucher_number" className="mb-1 font-sm">Voucher Number</label>
                        <input id="voucher_number" name="voucher_number" value={finalProduct.voucher_number} onChange={handleFinalChange} placeholder="Enter voucher number" className="p-2 border rounded" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="date" className="mb-1 font-sm">Date</label>
                        <input id="date" type="date" name="date" value={finalProduct.date} onChange={handleFinalChange} className="p-2 border rounded" />
                    </div>
                </div>
                <div className="flex justify-end">
                    <button onClick={handleSaveFinalStock} disabled={loading} className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 disabled:bg-gray-400">
                        {loading ? 'Saving...' : 'Save Data'}
                    </button>
                </div>
            </div>

            <table className="w-full border-collapse rounded-lg overflow-hidden shadow mb-10">
                <thead>
                    <tr className="bg-[#2f3c4f] text-white">
                        <th className="p-3 border text-left">Product Name</th>
                        <th className="p-3 border text-left">Quantity</th>
                        <th className="p-3 border text-left">Voucher No.</th>
                        <th className="p-3 border text-left">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {loading && <tr><td colSpan="4" className="p-3 border text-center">Loading...</td></tr>}
                    {!loading && finalStockList.map((item, index) => (
                        <tr key={item.id || index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                            <td className="p-3 border">{item.product_name}</td>
                            <td className="p-3 border">{item.quantity}</td>
                            <td className="p-3 border">{item.voucher_number || '-'}</td>
                            <td className="p-3 border">{item.date ? new Date(item.date).toLocaleDateString() : '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {/* Out Product Section */}
            <h2 className="text-2xl font-bold mb-4">Out Product</h2>
            <div className="mb-6 p-4 border rounded-lg shadow-sm">
                <h3 className="font-semibold mb-2">Enter Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                    <div className="flex flex-col">
                        <label htmlFor="out_product_name" className="mb-1 font-sm">Product Name*</label>
                        <input id="out_product_name" name="product_name" value={outProduct.product_name} onChange={handleOutChange} placeholder="Enter product name" className="p-2 border rounded" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="out_quantity" className="mb-1 font-sm">Quantity*</label>
                        <input id="out_quantity" name="quantity" type="number" value={outProduct.quantity} onChange={handleOutChange} placeholder="Enter quantity" className="p-2 border rounded" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="party_name" className="mb-1 font-sm">Party Name</label>
                        <input id="party_name" name="party_name" value={outProduct.party_name} onChange={handleOutChange} placeholder="Enter party name" className="p-2 border rounded" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="process" className="mb-1 font-sm">Process</label>
                        <input id="process" name="process" value={outProduct.process} onChange={handleOutChange} placeholder="Enter process" className="p-2 border rounded" />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="out_date" className="mb-1 font-sm">Date</label>
                        <input id="out_date" type="date" name="date" value={outProduct.date} onChange={handleOutChange} className="p-2 border rounded" />
                    </div>
                </div>
                <div className="flex justify-end">
                    <button onClick={handleSaveOutProduct} disabled={loading} className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 disabled:bg-gray-400">
                        {loading ? 'Saving...' : 'Save Data'}
                    </button>
                </div>
            </div>

            <table className="w-full border-collapse rounded-lg overflow-hidden shadow">
                <thead>
                    <tr className="bg-[#2f3c4f] text-white">
                        <th className="p-3 border text-left">Product Name</th>
                        <th className="p-3 border text-left">Quantity</th>
                        <th className="p-3 border text-left">Party Name</th>
                        <th className="p-3 border text-left">Process</th>
                        <th className="p-3 border text-left">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {loading && <tr><td colSpan="5" className="p-3 border text-center">Loading...</td></tr>}
                    {!loading && outProductList.map((item, index) => (
                        <tr key={item.id || index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                            <td className="p-3 border">{item.product_name}</td>
                            <td className="p-3 border">{item.quantity}</td>
                            <td className="p-3 border">{item.party_name || '-'}</td>
                            <td className="p-3 border">{item.process || '-'}</td>
                            <td className="p-3 border">{item.date ? new Date(item.date).toLocaleDateString() : '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

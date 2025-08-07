import React, { useState } from 'react';

export default function Setting() {
    const [formData, setFormData] = useState({
        companyName: 'Kaushal Fabric',
        address: 'Ludhiana',
        phone: '9855119907',
        email: 'info@company.com',
        gstin: '29ABCDE1234F2Z5',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

    };

    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md">
                <div className="bg-[#2d3e50] text-white px-6 py-6 rounded-t-xl flex justify-between items-center">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <span className="inline-block">⚙️</span> Settings
                    </h2>
                    <button className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1 rounded-md">
                        ← Back
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Company Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Company Name</label>
                            <input
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">GSTIN</label>
                            <input
                                type="text"
                                name="gstin"
                                value={formData.gstin}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            />
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md flex items-center justify-center gap-2"
                        >
                            💾 Save Settings
                        </button>
                    </div>
                </form>
            </div>
        </div >
    );
}

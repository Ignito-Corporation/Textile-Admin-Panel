import React, { useState, useEffect } from "react";

const vendorCategories = ["Supplier", "Job Worker"];
const paymentModes = ["Cash", "Check"];
const productList = ["Cotton", "Silk", "Linen", "Wool"];
const units = ["Meter", "Kilogram"];

const ProductEntryForm = () => {
    const [formData, setFormData] = useState({
        productName: "",
        hsnCode: "",
        price: "",
        gst: "",
        vendorName: "",
        vendorCategory: "",
        address: "",
        city: "",
        state: "",
        mobile: "",
        gstNumber: "",
        creditDays: "",
        paymentTerm: "",
        paymentMode: "",
        shadeName: "",
        shadeCode: "",
        finalProductName: "",
        stockProduct: "",
        stockUnit: "",
        stockQuantity: "",
    });

    // Fetch server routes when component mounts
    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const response = await fetch(
                    "https://textile-admin-panel-6k2c.onrender.com/ping"
                );
                const data = await response.json();
                console.log("Server Routes:", data);
            } catch (error) {
                console.error("Error fetching routes:", error);
            }
        };

        fetchRoutes();
    }, []); // Empty dependency array ensures this runs only once on mount

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data:", formData);
        alert("Data Saved!");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white w-full px-8 py-5 mt-0 rounded-md shadow"
        >
            <h2 className="text-2xl font-bold mb-6 text-gray-700">Product Entry</h2>

            {/* ===== Enter Details ===== */}
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Enter Details</h3>
            <div className="grid grid-cols-4 gap-6 mb-6">
                <input type="text" name="productName" value={formData.productName} onChange={handleChange} placeholder="Product Name *" className="single-input" />
                <input type="text" name="hsnCode" value={formData.hsnCode} onChange={handleChange} placeholder="HSN Code *" className="single-input" />
                <input type="text" name="price" value={formData.price} onChange={handleChange} placeholder="Price *" className="single-input" />
                <input type="text" name="gst" value={formData.gst} onChange={handleChange} placeholder="GST % *" className="single-input" />
            </div>
            <hr className="mb-6" />

            {/* ===== Vendor Details ===== */}
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Vendor Details</h3>
            <div className="grid grid-cols-4 gap-6 mb-6">
                <input type="text" name="vendorName" value={formData.vendorName} onChange={handleChange} placeholder="Vendor Name *" className="single-input" />
                <select name="vendorCategory" value={formData.vendorCategory} onChange={handleChange} className="single-input">
                    <option value="">Vendor Category *</option>
                    {vendorCategories.map((v) => <option key={v}>{v}</option>)}
                </select>
                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address *" className="single-input" />
                <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City *" className="single-input" />

                <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State *" className="single-input" />
                <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile Number *" className="single-input" />
                <input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleChange} placeholder="GST Number *" className="single-input" />
                <input type="text" name="creditDays" value={formData.creditDays} onChange={handleChange} placeholder="Credit Days *" className="single-input" />

                <input type="text" name="paymentTerm" value={formData.paymentTerm} onChange={handleChange} placeholder="Payment Term *" className="single-input" />
                <select name="paymentMode" value={formData.paymentMode} onChange={handleChange} className="single-input">
                    <option value="">Payment Mode *</option>
                    {paymentModes.map((p) => <option key={p}>{p}</option>)}
                </select>
            </div>
            <hr className="mb-6" />

            {/* ===== Shade ===== */}
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Shade</h3>
            <div className="grid grid-cols-4 gap-6 mb-6">
                <input type="text" name="shadeName" value={formData.shadeName} onChange={handleChange} placeholder="Shade Name *" className="single-input" />
                <input type="text" name="shadeCode" value={formData.shadeCode} onChange={handleChange} placeholder="Shade Code (Optional)" className="single-input" />
            </div>
            <hr className="mb-6" />

            {/* ===== Add Final Product ===== */}
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Add Final Product</h3>
            <div className="grid grid-cols-4 gap-6 mb-6">
                <input type="text" name="finalProductName" value={formData.finalProductName} onChange={handleChange} placeholder="Name *" className="single-input" />
            </div>
            <hr className="mb-6" />

            {/* ===== Add Final Product Stock ===== */}
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Add Final Product Stock</h3>
            <div className="grid grid-cols-4 gap-6 mb-6">
                <select name="stockProduct" value={formData.stockProduct} onChange={handleChange} className="single-input">
                    <option value="">Product *</option>
                    {productList.map((p) => <option key={p}>{p}</option>)}
                </select>
                <select name="stockUnit" value={formData.stockUnit} onChange={handleChange} className="single-input">
                    <option value="">Unit *</option>
                    {units.map((u) => <option key={u}>{u}</option>)}
                </select>
                <input type="text" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} placeholder="Quantity *" className="single-input" />
            </div>

            {/* ===== Save Button ===== */}
            <div className="text-right mt-10">
                <button type="submit" className="bg-green-600 text-white font-semibold px-8 py-3 rounded hover:bg-green-700">
                    Save Data
                </button>
            </div>
        </form>
    );
};

export default ProductEntryForm;
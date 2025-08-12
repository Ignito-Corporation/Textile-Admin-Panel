// // import React, { useState } from "react";

// // const vendorCategories = ["Supplier", "Job Worker"];
// // const paymentModes = ["Cash", "Check"];
// // const productList = ["Cotton", "Silk", "Linen", "Wool"];
// // const units = ["Meter", "Kilogram"];

// // const ProductEntryForm = () => {
// //     const [formData, setFormData] = useState({
// //         productName: "",
// //         hsnCode: "",
// //         price: "",
// //         gst: "",
// //         vendorName: "",
// //         vendorCategory: "",
// //         address: "",
// //         city: "",
// //         state: "",
// //         mobile: "",
// //         gstNumber: "",
// //         creditDays: "",
// //         paymentTerm: "",
// //         paymentMode: "",
// //         shadeName: "",
// //         shadeCode: "",
// //         finalProductName: "",
// //         stockProduct: "",
// //         stockUnit: "",
// //         stockQuantity: "",
// //     });

// //     const handleChange = (e) => {
// //         const { name, value } = e.target;
// //         setFormData((prev) => ({ ...prev, [name]: value }));
// //     };

// //     const handleSubmit = (e) => {
// //         e.preventDefault();
// //         console.log("Form Data:", formData);
// //         alert("Data Saved!");
// //     };

// //     return (
// //         <form
// //             onSubmit={handleSubmit}
// //             className="bg-white w-full px-8 py-5 mt-0 rounded-md shadow"
// //         >
// //             <h2 className="text-2xl font-bold mb-6 text-gray-700">Product Entry</h2>

// //             {/* ===== Enter Details ===== */}
// //             <h3 className="text-lg font-semibold text-gray-800 mb-3">Enter Details</h3>
// //             <div className="grid grid-cols-4 gap-6 mb-6">
// //                 <input type="text" name="productName" value={formData.productName} onChange={handleChange} placeholder="Product Name *" className="single-input" />
// //                 <input type="text" name="hsnCode" value={formData.hsnCode} onChange={handleChange} placeholder="HSN Code *" className="single-input" />
// //                 <input type="text" name="price" value={formData.price} onChange={handleChange} placeholder="Price *" className="single-input" />
// //                 <input type="text" name="gst" value={formData.gst} onChange={handleChange} placeholder="GST % *" className="single-input" />
// //             </div>
// //             <hr className="mb-6" />

// //             {/* ===== Vendor Details ===== */}
// //             <h3 className="text-lg font-semibold text-gray-800 mb-3">Vendor Details</h3>
// //             <div className="grid grid-cols-4 gap-6 mb-6">
// //                 <input type="text" name="vendorName" value={formData.vendorName} onChange={handleChange} placeholder="Vendor Name *" className="single-input" />
// //                 <select name="vendorCategory" value={formData.vendorCategory} onChange={handleChange} className="single-input">
// //                     <option value="">Vendor Category *</option>
// //                     {vendorCategories.map((v) => <option key={v}>{v}</option>)}
// //                 </select>
// //                 <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address *" className="single-input" />
// //                 <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City *" className="single-input" />

// //                 <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State *" className="single-input" />
// //                 <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile Number *" className="single-input" />
// //                 <input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleChange} placeholder="GST Number *" className="single-input" />
// //                 <input type="text" name="creditDays" value={formData.creditDays} onChange={handleChange} placeholder="Credit Days *" className="single-input" />

// //                 <input type="text" name="paymentTerm" value={formData.paymentTerm} onChange={handleChange} placeholder="Payment Term *" className="single-input" />
// //                 <select name="paymentMode" value={formData.paymentMode} onChange={handleChange} className="single-input">
// //                     <option value="">Payment Mode *</option>
// //                     {paymentModes.map((p) => <option key={p}>{p}</option>)}
// //                 </select>
// //             </div>
// //             <hr className="mb-6" />

// //             {/* ===== Shade ===== */}
// //             <h3 className="text-lg font-semibold text-gray-800 mb-3">Shade</h3>
// //             <div className="grid grid-cols-4 gap-6 mb-6">
// //                 <input type="text" name="shadeName" value={formData.shadeName} onChange={handleChange} placeholder="Shade Name *" className="single-input" />
// //                 <input type="text" name="shadeCode" value={formData.shadeCode} onChange={handleChange} placeholder="Shade Code (Optional)" className="single-input" />
// //             </div>
// //             <hr className="mb-6" />

// //             {/* ===== Add Final Product ===== */}
// //             <h3 className="text-lg font-semibold text-gray-800 mb-3">Add Final Product</h3>
// //             <div className="grid grid-cols-4 gap-6 mb-6">
// //                 <input type="text" name="finalProductName" value={formData.finalProductName} onChange={handleChange} placeholder="Name *" className="single-input" />
// //             </div>
// //             <hr className="mb-6" />

// //             {/* ===== Add Final Product Stock ===== */}
// //             <h3 className="text-lg font-semibold text-gray-800 mb-3">Add Final Product Stock</h3>
// //             <div className="grid grid-cols-4 gap-6 mb-6">
// //                 <select name="stockProduct" value={formData.stockProduct} onChange={handleChange} className="single-input">
// //                     <option value="">Product *</option>
// //                     {productList.map((p) => <option key={p}>{p}</option>)}
// //                 </select>
// //                 <select name="stockUnit" value={formData.stockUnit} onChange={handleChange} className="single-input">
// //                     <option value="">Unit *</option>
// //                     {units.map((u) => <option key={u}>{u}</option>)}
// //                 </select>
// //                 <input type="text" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} placeholder="Quantity *" className="single-input" />
// //             </div>

// //             {/* ===== Save Button ===== */}
// //             <div className="text-right mt-10">
// //                 <button type="submit" className="bg-green-600 text-white font-semibold px-8 py-3 rounded hover:bg-green-700">
// //                     Save Data
// //                 </button>
// //             </div>
// //         </form>
// //     );
// // };

// // export default ProductEntryForm;


// import React, { useState } from "react";

// const vendorCategories = ["Supplier", "Job Worker"];
// const paymentModes = ["Cash", "Check"];
// const productList = ["Cotton", "Silk", "Linen", "Wool"];
// const units = ["Meter", "Kilogram"];

// const ProductEntryForm = () => {
//     const [formData, setFormData] = useState({
//         productName: "",
//         hsnCode: "",
//         price: "",
//         gst: "",
//         vendorName: "",
//         vendorCategory: "",
//         address: "",
//         city: "",
//         state: "",
//         mobile: "",
//         gstNumber: "",
//         creditDays: "",
//         paymentTerm: "",
//         paymentMode: "",
//         shadeName: "",
//         shadeCode: "",
//         finalProductName: "",
//         stockProduct: "",
//         stockUnit: "",
//         stockQuantity: "",
//     });

//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsLoading(true);
//         setError(null);

//         try {
//             // Prepare data for each endpoint
//             const productData = {
//                 name: formData.productName || null,
//                 hsn_code: formData.hsnCode || null,
//                 price: formData.price ? parseFloat(formData.price) : null,
//                 gst_percent: formData.gst ? parseFloat(formData.gst) : null,
//                 unit: formData.stockUnit || null
//             };

//             const vendorData = {
//                 name: formData.vendorName || null,
//                 category: formData.vendorCategory || null,
//                 address: formData.address || null,
//                 city: formData.city || null,
//                 state: formData.state || null,
//                 mobile_number: formData.mobile || null,
//                 gst_number: formData.gstNumber || null,
//                 credit_days: formData.creditDays ? parseInt(formData.creditDays) : null,
//                 payment_term: formData.paymentTerm || null,
//                 payment_mode: formData.paymentMode || null
//             };

//             const shadeData = {
//                 name: formData.shadeName || null,
//                 shade_code: formData.shadeCode || null
//             };

//             const finalProductData = {
//                 name: formData.finalProductName || null
//             };

//             const finalProductStockData = {
//                 product_name: formData.stockProduct || null,
//                 unit: formData.stockUnit || null,
//                 quantity: formData.stockQuantity ? parseFloat(formData.stockQuantity) : null
//             };

//             // Make API calls
//             const baseUrl = "https://textile-admin-panel.onrender.com";

//             // First test the connection
//             // try {
//             //     const pingResponse = await fetch(`${baseUrl}/ping`);
//             //     if (!pingResponse.ok) {
//             //         throw new Error("Backend server is not responding");
//             //     }
//             // } catch (pingErr) {
//             //     console.error("Ping error:", pingErr); // 🔍 inspect full error
//             //     throw new Error(`Cannot connect to server: ${pingErr.message}`);
//             // }

//             // Product
//             if (formData.productName) {
//                 const productResponse = await fetch(`${baseUrl}/api/master/products`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify(productData)
//                 });
//                 const productResult = await productResponse.json();
//                 if (!productResponse.ok) {
//                     throw new Error(productResult.error || 'Failed to save product');
//                 }
//             }

//             // Vendor
//             if (formData.vendorName) {
//                 const vendorResponse = await fetch(`${baseUrl}/api/master/vendors`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify(vendorData)
//                 });
//                 const vendorResult = await vendorResponse.json();
//                 if (!vendorResponse.ok) {
//                     throw new Error(vendorResult.error || 'Failed to save vendor');
//                 }
//             }

//             // Shade
//             if (formData.shadeName) {
//                 const shadeResponse = await fetch(`${baseUrl}/api/master/shades`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify(shadeData)
//                 });
//                 const shadeResult = await shadeResponse.json();
//                 if (!shadeResponse.ok) {
//                     throw new Error(shadeResult.error || 'Failed to save shade');
//                 }
//             }

//             // Final Product
//             if (formData.finalProductName) {
//                 const finalProductResponse = await fetch(`${baseUrl}/api/master/final-product`, {  // Note: singular
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify(finalProductData)
//                 });
//                 const finalProductResult = await finalProductResponse.json();
//                 if (!finalProductResponse.ok) {
//                     throw new Error(finalProductResult.error || 'Failed to save final product');
//                 }
//             }

//             // Final Product Stock
//             if (formData.stockProduct) {
//                 const finalProductStockResponse = await fetch(`${baseUrl}/api/master/final-product-stock`, {  // Note: singular
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify(finalProductStockData)
//                 });
//                 const finalProductStockResult = await finalProductStockResponse.json();
//                 if (!finalProductStockResponse.ok) {
//                     throw new Error(finalProductStockResult.error || 'Failed to save final product stock');
//                 }
//             }

//             alert("Data saved successfully!");
//             // Reset form after successful submission
//             setFormData({
//                 productName: "",
//                 hsnCode: "",
//                 price: "",
//                 gst: "",
//                 vendorName: "",
//                 vendorCategory: "",
//                 address: "",
//                 city: "",
//                 state: "",
//                 mobile: "",
//                 gstNumber: "",
//                 creditDays: "",
//                 paymentTerm: "",
//                 paymentMode: "",
//                 shadeName: "",
//                 shadeCode: "",
//                 finalProductName: "",
//                 stockProduct: "",
//                 stockUnit: "",
//                 stockQuantity: "",
//             });

//         } catch (err) {
//             console.error("API Error:", err);
//             setError(err.message);
//             alert(`Error: ${err.message}`);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <form
//             onSubmit={handleSubmit}
//             className="bg-white w-full px-8 py-5 mt-0 rounded-md shadow"
//         >
//             <h2 className="text-2xl font-bold mb-6 text-gray-700">Product Entry</h2>

//             {error && (
//                 <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
//                     {error}
//                 </div>
//             )}

//             {/* Rest of your form JSX remains the same */}
//             {/* ===== Enter Details ===== */}
//             <h3 className="text-lg font-semibold text-gray-800 mb-3">Enter Details</h3>
//             <div className="grid grid-cols-4 gap-6 mb-6">
//                 <input type="text" name="productName" value={formData.productName} onChange={handleChange} placeholder="Product Name *" className="single-input" />
//                 <input type="text" name="hsnCode" value={formData.hsnCode} onChange={handleChange} placeholder="HSN Code *" className="single-input" />
//                 <input type="text" name="price" value={formData.price} onChange={handleChange} placeholder="Price *" className="single-input" />
//                 <input type="text" name="gst" value={formData.gst} onChange={handleChange} placeholder="GST % *" className="single-input" />
//             </div>
//             <hr className="mb-6" />

//             {/* ===== Vendor Details ===== */}
//             <h3 className="text-lg font-semibold text-gray-800 mb-3">Vendor Details</h3>
//             <div className="grid grid-cols-4 gap-6 mb-6">
//                 <input type="text" name="vendorName" value={formData.vendorName} onChange={handleChange} placeholder="Vendor Name *" className="single-input" />
//                 <select name="vendorCategory" value={formData.vendorCategory} onChange={handleChange} className="single-input">
//                     <option value="">Vendor Category *</option>
//                     {vendorCategories.map((v) => <option key={v}>{v}</option>)}
//                 </select>
//                 <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address *" className="single-input" />
//                 <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City *" className="single-input" />

//                 <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State *" className="single-input" />
//                 <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile Number *" className="single-input" />
//                 <input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleChange} placeholder="GST Number *" className="single-input" />
//                 <input type="text" name="creditDays" value={formData.creditDays} onChange={handleChange} placeholder="Credit Days *" className="single-input" />

//                 <input type="text" name="paymentTerm" value={formData.paymentTerm} onChange={handleChange} placeholder="Payment Term *" className="single-input" />
//                 <select name="paymentMode" value={formData.paymentMode} onChange={handleChange} className="single-input">
//                     <option value="">Payment Mode *</option>
//                     {paymentModes.map((p) => <option key={p}>{p}</option>)}
//                 </select>
//             </div>
//             <hr className="mb-6" />

//             {/* ===== Shade ===== */}
//             <h3 className="text-lg font-semibold text-gray-800 mb-3">Shade</h3>
//             <div className="grid grid-cols-4 gap-6 mb-6">
//                 <input type="text" name="shadeName" value={formData.shadeName} onChange={handleChange} placeholder="Shade Name *" className="single-input" />
//                 <input type="text" name="shadeCode" value={formData.shadeCode} onChange={handleChange} placeholder="Shade Code (Optional)" className="single-input" />
//             </div>
//             <hr className="mb-6" />

//             {/* ===== Add Final Product ===== */}
//             <h3 className="text-lg font-semibold text-gray-800 mb-3">Add Final Product</h3>
//             <div className="grid grid-cols-4 gap-6 mb-6">
//                 <input type="text" name="finalProductName" value={formData.finalProductName} onChange={handleChange} placeholder="Name *" className="single-input" />
//             </div>
//             <hr className="mb-6" />

//             {/* ===== Add Final Product Stock ===== */}
//             <h3 className="text-lg font-semibold text-gray-800 mb-3">Add Final Product Stock</h3>
//             <div className="grid grid-cols-4 gap-6 mb-6">
//                 <select name="stockProduct" value={formData.stockProduct} onChange={handleChange} className="single-input">
//                     <option value="">Product *</option>
//                     {productList.map((p) => <option key={p}>{p}</option>)}
//                 </select>
//                 <select name="stockUnit" value={formData.stockUnit} onChange={handleChange} className="single-input">
//                     <option value="">Unit *</option>
//                     {units.map((u) => <option key={u}>{u}</option>)}
//                 </select>
//                 <input type="text" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} placeholder="Quantity *" className="single-input" />
//             </div>

//             {/* ===== Save Button ===== */}
//             <div className="text-right mt-10">
//                 <button
//                     type="submit"
//                     className="bg-green-600 text-white font-semibold px-8 py-3 rounded hover:bg-green-700"
//                     disabled={isLoading}
//                 >
//                     {isLoading ? 'Saving...' : 'Save Data'}
//                 </button>
//             </div>
//         </form>
//     );
// };

// export default ProductEntryForm;


import React, { useState } from "react";

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

    const [isLoading, setIsLoading] = useState({
        product: false,
        vendor: false,
        shade: false,
        finalProduct: false,
        finalProductStock: false
    });
    
    const [error, setError] = useState({
        product: null,
        vendor: null,
        shade: null,
        finalProduct: null,
        finalProductStock: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const baseUrl = "https://textile-admin-panel.onrender.com";

    // ===== Product Details Save =====
    const saveProductDetails = async () => {
        setIsLoading(prev => ({ ...prev, product: true }));
        setError(prev => ({ ...prev, product: null }));

        try {
            const productData = {
                name: formData.productName || null,
                hsn_code: formData.hsnCode || null,
                price: formData.price ? parseFloat(formData.price) : null,
                gst_percent: formData.gst ? parseFloat(formData.gst) : null,
                unit: formData.stockUnit || null
            };

            if (!formData.productName) {
                throw new Error("Product Name is required");
            }

            const response = await fetch(`${baseUrl}/api/master/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Failed to save product');
            }

            alert("Product details saved successfully!");
        } catch (err) {
            setError(prev => ({ ...prev, product: err.message }));
            console.error("Product Save Error:", err);
        } finally {
            setIsLoading(prev => ({ ...prev, product: false }));
        }
    };

    // ===== Vendor Details Save =====
    const saveVendorDetails = async () => {
        setIsLoading(prev => ({ ...prev, vendor: true }));
        setError(prev => ({ ...prev, vendor: null }));

        try {
            const vendorData = {
                name: formData.vendorName || null,
                category: formData.vendorCategory || null,
                address: formData.address || null,
                city: formData.city || null,
                state: formData.state || null,
                mobile_number: formData.mobile || null,
                gst_number: formData.gstNumber || null,
                credit_days: formData.creditDays ? parseInt(formData.creditDays) : null,
                payment_term: formData.paymentTerm || null,
                payment_mode: formData.paymentMode || null
            };

            if (!formData.vendorName) {
                throw new Error("Vendor Name is required");
            }

            const response = await fetch(`${baseUrl}/api/master/vendors`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(vendorData)
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Failed to save vendor');
            }

            alert("Vendor details saved successfully!");
        } catch (err) {
            setError(prev => ({ ...prev, vendor: err.message }));
            console.error("Vendor Save Error:", err);
        } finally {
            setIsLoading(prev => ({ ...prev, vendor: false }));
        }
    };

    // ===== Shade Details Save =====
    const saveShadeDetails = async () => {
        setIsLoading(prev => ({ ...prev, shade: true }));
        setError(prev => ({ ...prev, shade: null }));

        try {
            const shadeData = {
                name: formData.shadeName || null,
                shade_code: formData.shadeCode || null
            };

            if (!formData.shadeName) {
                throw new Error("Shade Name is required");
            }

            const response = await fetch(`${baseUrl}/api/master/shades`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(shadeData)
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Failed to save shade');
            }

            alert("Shade details saved successfully!");
        } catch (err) {
            setError(prev => ({ ...prev, shade: err.message }));
            console.error("Shade Save Error:", err);
        } finally {
            setIsLoading(prev => ({ ...prev, shade: false }));
        }
    };

    // ===== Final Product Save =====
    // const saveFinalProduct = async () => {
    //     setIsLoading(prev => ({ ...prev, finalProduct: true }));
    //     setError(prev => ({ ...prev, finalProduct: null }));

    //     try {
    //         const finalProductData = {
    //             name: formData.finalProductName || null
    //         };

    //         if (!formData.finalProductName) {
    //             throw new Error("Final Product Name is required");
    //         }

    //         const response = await fetch(`${baseUrl}/api/finalstock`, {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify(finalProductData)
    //         });

    //         const result = await response.json();
    //         if (!response.ok) {
    //             throw new Error(result.error || 'Failed to save final product');
    //         }

    //         alert("Final Product saved successfully!");
    //     } catch (err) {
    //         setError(prev => ({ ...prev, finalProduct: err.message }));
    //         console.error("Final Product Save Error:", err);
    //     } finally {
    //         setIsLoading(prev => ({ ...prev, finalProduct: false }));
    //     }
    // };

    // ===== Final Product Stock Save =====
    // const saveFinalProductStock = async () => {
    //     setIsLoading(prev => ({ ...prev, finalProductStock: true }));
    //     setError(prev => ({ ...prev, finalProductStock: null }));

    //     try {
    //         const finalProductStockData = {
    //             product_name: formData.stockProduct || null,
    //             unit: formData.stockUnit || null,
    //             quantity: formData.stockQuantity ? parseFloat(formData.stockQuantity) : null
    //         };

    //         if (!formData.stockProduct || !formData.stockQuantity) {
    //             throw new Error("Product and Quantity are required");
    //         }

    //         const response = await fetch(`${baseUrl}/api/master/final-product-stock`, {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify(finalProductStockData)
    //         });

    //         const result = await response.json();
    //         if (!response.ok) {
    //             throw new Error(result.error || 'Failed to save final product stock');
    //         }

    //         alert("Final Product Stock saved successfully!");
    //     } catch (err) {
    //         setError(prev => ({ ...prev, finalProductStock: err.message }));
    //         console.error("Final Product Stock Save Error:", err);
    //     } finally {
    //         setIsLoading(prev => ({ ...prev, finalProductStock: false }));
    //     }
    // };

    return (
        <div className="bg-white w-full px-8 py-5 mt-0 rounded-md shadow">
            <h2 className="text-2xl font-bold mb-6 text-gray-700">Product Entry</h2>

            {/* ===== Enter Details ===== */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Enter Details</h3>
                <div className="grid grid-cols-4 gap-6 mb-4">
                    <input type="text" name="productName" value={formData.productName} onChange={handleChange} placeholder="Product Name *" className="single-input" />
                    <input type="text" name="hsnCode" value={formData.hsnCode} onChange={handleChange} placeholder="HSN Code *" className="single-input" />
                    <input type="text" name="price" value={formData.price} onChange={handleChange} placeholder="Price *" className="single-input" />
                    <input type="text" name="gst" value={formData.gst} onChange={handleChange} placeholder="GST % *" className="single-input" />
                </div>
                {error.product && <div className="mb-3 p-2 bg-red-100 text-red-700 rounded text-sm">{error.product}</div>}
                <div className="text-right mb-6">
                    <button
                        type="button"
                        onClick={saveProductDetails}
                        className="bg-green-600 text-white font-semibold px-4 py-2 rounded hover:bg-green-700"
                        disabled={isLoading.product}
                    >
                        {isLoading.product ? 'Saving...' : 'Save Product'}
                    </button>
                </div>
                <hr className="mb-6" />
            </div>

            {/* ===== Vendor Details ===== */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Vendor Details</h3>
                <div className="grid grid-cols-4 gap-6 mb-4">
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
                {error.vendor && <div className="mb-3 p-2 bg-red-100 text-red-700 rounded text-sm">{error.vendor}</div>}
                <div className="text-right mb-6">
                    <button
                        type="button"
                        onClick={saveVendorDetails}
                        className="bg-green-600 text-white font-semibold px-4 py-2 rounded hover:bg-green-700"
                        disabled={isLoading.vendor}
                    >
                        {isLoading.vendor ? 'Saving...' : 'Save Vendor'}
                    </button>
                </div>
                <hr className="mb-6" />
            </div>

            {/* ===== Shade ===== */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Shade</h3>
                <div className="grid grid-cols-4 gap-6 mb-4">
                    <input type="text" name="shadeName" value={formData.shadeName} onChange={handleChange} placeholder="Shade Name *" className="single-input" />
                    <input type="text" name="shadeCode" value={formData.shadeCode} onChange={handleChange} placeholder="Shade Code (Optional)" className="single-input" />
                </div>
                {error.shade && <div className="mb-3 p-2 bg-red-100 text-red-700 rounded text-sm">{error.shade}</div>}
                <div className="text-right mb-6">
                    <button
                        type="button"
                        onClick={saveShadeDetails}
                        className="bg-green-600 text-white font-semibold px-4 py-2 rounded hover:bg-green-700"
                        disabled={isLoading.shade}
                    >
                        {isLoading.shade ? 'Saving...' : 'Save Shade'}
                    </button>
                </div>
                <hr className="mb-6" />
            </div>

            {/* ===== Add Final Product =====
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Add Final Product</h3>
                <div className="grid grid-cols-4 gap-6 mb-4">
                    <input type="text" name="finalProductName" value={formData.finalProductName} onChange={handleChange} placeholder="Name *" className="single-input" />
                </div>
                {error.finalProduct && <div className="mb-3 p-2 bg-red-100 text-red-700 rounded text-sm">{error.finalProduct}</div>}
                <div className="text-right mb-6">
                    <button
                        type="button"
                        onClick={saveFinalProduct}
                        className="bg-green-600 text-white font-semibold px-4 py-2 rounded hover:bg-green-700"
                        disabled={isLoading.finalProduct}
                    >
                        {isLoading.finalProduct ? 'Saving...' : 'Save Final Product'}
                    </button>
                </div>
                <hr className="mb-6" />
            </div>

            ===== Add Final Product Stock =====
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Add Final Product Stock</h3>
                <div className="grid grid-cols-4 gap-6 mb-4">
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
                {error.finalProductStock && <div className="mb-3 p-2 bg-red-100 text-red-700 rounded text-sm">{error.finalProductStock}</div>}
                <div className="text-right">
                    <button
                        type="button"
                        onClick={saveFinalProductStock}
                        className="bg-green-600 text-white font-semibold px-4 py-2 rounded hover:bg-green-700"
                        disabled={isLoading.finalProductStock}
                    >
                        {isLoading.finalProductStock ? 'Saving...' : 'Save Stock'}
                    </button>
                </div>
            </div> */}
        </div>
    );
};

export default ProductEntryForm;
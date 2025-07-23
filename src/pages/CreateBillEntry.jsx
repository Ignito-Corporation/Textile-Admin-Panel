import React, { useState, useEffect } from "react";

const vendorData = {
  "PO-202507-214": {
    vendorName: "ABC Textile Mills",
    address: "123 Cotton St, Mumbai",
    state: "Maharashtra",
    phone: "022-12345678",
    products: [
      { productName: "Cotton Roll", unit: "kg", qty: 100, rate: 200, gst: "5%" },
      { productName: "Cotton Sheet", unit: "m", qty: 50, rate: 300, gst: "12%" },
    ],
  },
  "PO-202507-215": {
    vendorName: "Premium Cotton Suppliers",
    address: "45 Silk Rd, Delhi",
    state: "Delhi",
    phone: "011-87654321",
    products: [
      { productName: "Premium Cotton", unit: "kg", qty: 200, rate: 250, gst: "5%" },
    ],
  },
  "PO-202507-216": {
    vendorName: "Silk Weavers Ltd",
    address: "78 Weave Ave, Chennai",
    state: "Tamil Nadu",
    phone: "044-11223344",
    products: [
      { productName: "Silk Roll", unit: "kg", qty: 120, rate: 500, gst: "18%" },
      { productName: "Silk Yarn", unit: "m", qty: 90, rate: 450, gst: "12%" },
    ],
  },
};

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
    billType: "",
    address: "",
    state: "",
    phone: "",
  });

  const [products, setProducts] = useState([]);

  useEffect(() => {
    setForm(f => ({ ...f, crlNumber: crlCounter }));
  }, [crlCounter]);

  useEffect(() => {
    const info = vendorData[form.poNumber];
    if (info) {
      setForm(f => ({
        ...f,
        vendorName: info.vendorName,
        address: info.address,
        state: info.state,
        phone: info.phone,
      }));
      setProducts(
        info.products.map((p, idx) => {
          const amount = p.qty * p.rate;
          const gstPercent = parseFloat(p.gst);
          const gRate = ((amount * gstPercent) / 100).toFixed(2);
          return {
            id: idx + 1,
            ...p,
            shade: "",
            lot: "",
            mill: "",
            amount: amount.toFixed(2),
            gRate,
          };
        })
      );
    }
  }, [form.poNumber]);

  const handleFormChange = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
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
        amount: 0,
        gRate: 0,
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
        const updated = { ...p, [field]: field === "qty" || field === "rate" ? Number(val) : val };
        updated.amount = (updated.qty * updated.rate).toFixed(2);
        const gstPercent = parseFloat(updated.gst);
        updated.gRate = ((updated.qty * updated.rate * gstPercent) / 100).toFixed(2);
        return updated;
      })
    );
  };

  const handleSubmit = () => {
    console.log("Submitted Data:", { form, products });
    alert("Form submitted. Check console for data.");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-[#2f3c4f] text-white p-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold">+ Create Purchase Bill Entry</h1>
          <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-1 rounded">← Back</button>
        </div>

        <div className="p-6 space-y-6">
          {/* Form Sections */}

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
                    placeholder="Input to be displayed here"
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

          <section>
            <h2 className="font-medium mb-2">Vendor Information</h2>
            <div className="grid grid-cols-4 gap-4 mb-4">
              {["vendorName", "poNumber", "grnNumber", "billType"].map(field => (
                <div key={field}>
                  <label className="block text-sm mb-1">
                    {field.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}
                  </label>
                  <input
                    type="text"
                    value={form[field]}
                    onChange={e => handleFormChange(field, e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    placeholder="Input to be displayed here"
                  />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4">
              {["address", "state", "phone"].map(field => (
                <div key={field}>
                  <label className="block text-sm mb-1">
                    {field.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}
                  </label>
                  <input
                    type="text"
                    value={form[field]}
                    onChange={e => handleFormChange(field, e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    placeholder="Input to be displayed here"
                  />
                </div>
              ))}
            </div>
          </section>

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
                            type={field === "qty" || field === "rate" ? "number" : "text"}
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
                        <button onClick={() => removeRow(row.id)} className="text-red-500 hover:underline">
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

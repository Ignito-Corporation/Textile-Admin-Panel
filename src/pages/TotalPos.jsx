import { useState, useEffect } from 'react';
import {
  CircleDollarSign,
  FileText,
  PackageCheck,
  ShoppingCart,
  Pencil,
  Eye,
  Download,
  Trash,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function AllPOs() {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null); // Track deleting PO
  const [downloading, setDownloading] = useState(null); // Track downloading PO
  
  // Calculate card data - UPDATED to use is_closed for active status
  const totalPOs = purchaseOrders.length;
  const activePOs = purchaseOrders.filter(po => !po.is_closed).length;
  const totalValue = purchaseOrders.reduce((sum, po) => sum + po.total, 0);
  const thisMonthCount = purchaseOrders.filter(po => {
    const poDate = new Date(po.date);
    const now = new Date();
    return poDate.getMonth() === now.getMonth() && 
           poDate.getFullYear() === now.getFullYear();
  }).length;

  const cards = [
    {
      title: "Total POs",
      value: totalPOs,
      icon: <ShoppingCart className="text-[#2f3c4f]" />,
    },
    {
      title: "Active POs",
      value: activePOs,
      icon: <FileText className="text-green-600" />,
    },
    {
      title: "Total Value",
      value: new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(totalValue),
      icon: <CircleDollarSign className="text-yellow-500" />,
    },
    {
      title: "This Month",
      value: thisMonthCount,
      icon: <PackageCheck className="text-blue-600" />,
    },
  ];

  // Fetch purchase orders from API
  useEffect(() => {
    const fetchPOs = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/po/');
        //const response = await fetch('https://textile-admin-panel.onrender.com/api/po/get-po');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setPurchaseOrders(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching purchase orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPOs();
  }, []);

  // Handle PO deletion with confirmation
  const handleDeletePO = async (poNumber) => {
    if (!window.confirm(`Are you sure you want to delete PO ${poNumber}? This action cannot be undone.`)) {
      return;
    }

    setDeleting(poNumber);
    try {
      /*const response = await fetch(`https://textile-admin-panel.onrender.com/api/po/${poNumber}`, {
        method: 'DELETE'
      });*/

      const response = await fetch(`http://localhost:8080/api/po/purchase-delete/${poNumber}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Failed to delete PO: ${response.status}`);
      }

      // Remove deleted PO from state
      setPurchaseOrders(prev => prev.filter(po => po.po_number !== poNumber));
    } catch (err) {
      console.error('Error deleting PO:', err);
      alert(`Failed to delete PO: ${err.message}`);
    } finally {
      setDeleting(null);
    }
  };

  const handleDownloadPO = async (poNumber) => {
  setDownloading(poNumber);
  try {
    // Step 1: Fetch PO details
    const response = await fetch(`https://textile-admin-panel.onrender.com/api/po/${poNumber}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch PO: ${response.status} - ${errorText}`);
    }
    const poData = await response.json();

    // Step 2: Generate PDF directly in frontend
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(18);
    doc.text(`Purchase Order: ${poData.po_number}`, 14, 15);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Date: ${new Date(poData.date).toLocaleDateString('en-IN')}`, 14, 23);
    
    // Add vendor details
    const vendor = poData.vendor || {};
    doc.setFontSize(14);
    doc.text('Vendor Information:', 14, 35);
    doc.setFontSize(10);
    doc.text(`Name: ${vendor.name || '-'}`, 14, 43);
    doc.text(`Address: ${vendor.address || '-'}`, 14, 51);
    doc.text(`City: ${vendor.city || '-'}, State: ${vendor.state || '-'}`, 14, 59);
    doc.text(`GST: ${vendor.gst_number || '-'}`, 14, 67);
    doc.text(`Contact: ${vendor.mobile_number || '-'}`, 14, 75);
    
    // Add PO details
    doc.setFontSize(14);
    doc.text('PO Details:', 130, 35);
    doc.setFontSize(10);
    doc.text(`Status: ${poData.status || '-'}`, 130, 43);
    doc.text(`Delivery Date: ${new Date(poData.delivery_date).toLocaleDateString('en-IN')}`, 130, 51);
    doc.text(`Payment Terms: ${poData.payment_terms || '-'}`, 130, 59);
    doc.text(`Total: ₹${(poData.total || 0).toLocaleString('en-IN')}`, 130, 67);
    
    // Add items table
    const startY = 90;
    doc.setFontSize(14);
    doc.text('Items:', 14, startY);
    
    // Prepare items data
    const itemsData = (poData.items || []).map(item => [
      item.product_name || '-',
      item.hsn_code || '-',
      `${item.gst_percent || 0}%`,
      item.quantity || 0,
      `₹${(item.rate || 0).toLocaleString('en-IN')}`,
      `₹${((item.quantity || 0) * (item.rate || 0)).toLocaleString('en-IN')}`
    ]);
    
    // Create table using autoTable directly
    autoTable(doc, {
      startY: startY + 5,
      head: [['Product', 'HSN Code', 'GST %', 'Qty', 'Rate', 'Amount']],
      body: itemsData,
      theme: 'grid',
      headStyles: { 
        fillColor: [47, 60, 79],
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: { 
        fontSize: 10,
        cellPadding: 3
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 25 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20, halign: 'right' },
        4: { cellWidth: 25, halign: 'right' },
        5: { cellWidth: 30, halign: 'right' }
      }
    });
    
    // Add notes
    const tableEndY = doc.lastAutoTable.finalY || startY + 50;
    const notesY = tableEndY + 10;
    
    if (poData.notes) {
      doc.setFontSize(14);
      doc.text('Notes:', 14, notesY);
      doc.setFontSize(10);
      const splitNotes = doc.splitTextToSize(poData.notes, 180);
      doc.text(splitNotes, 14, notesY + 8);
    }
    
    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() / 2, 287, { align: 'center' });
      doc.text(`Generated on ${new Date().toLocaleString()}`, 14, 287);
    }

    // Save PDF
    doc.save(`PO_${poNumber}.pdf`);

  } catch (err) {
    console.error('Error downloading PO:', err);
    alert(`Failed to download PO: ${err.message}`);
  } finally {
    setDownloading(null);
  }
};

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading purchase orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong>Error loading data:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="text-xl font-semibold text-gray-800 mb-4">
        Dashboard <span className="text-blue-600">› Total PO’s</span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((card, idx) => (
          <Card key={idx} className="shadow">
            <CardContent className="p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{card.title}</span>
                {card.icon}
              </div>
              <div className="text-xl font-bold text-black">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Purchase Orders Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full min-w-[600px] text-sm text-left">
          <thead className="bg-[#2f3c4f] text-white">
            <tr>
              <th className="px-6 py-3 font-medium text-left">PO Number</th>
              <th className="px-6 py-3 font-medium text-left">Vendor</th>
              <th className="px-6 py-3 font-medium text-left">Receiving Date</th>
              <th className="px-6 py-3 font-medium text-left">Amount</th>
              <th className="px-6 py-3 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {purchaseOrders.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No purchase orders found
                </td>
              </tr>
            ) : (
              purchaseOrders.map((po) => (
                <tr
                  key={po.id}
                  className={`even:bg-gray-50 border-b hover:bg-gray-50 transition ${
                    po.is_closed ? 'opacity-70' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap align-middle text-sm text-gray-800 font-medium">
                    <div>{po.po_number || '-'}</div>
                    {!po.is_closed && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle text-sm text-gray-700">
                    {po.vendor?.name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle text-sm text-gray-700">
                    {po.delivery_date 
                      ? new Date(po.delivery_date).toLocaleDateString('en-IN') 
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle text-sm text-green-600 font-semibold">
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }).format(po.total || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap align-middle">
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 p-1 text-gray-700"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 p-1 text-green-600"
                        title="Edit PO"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 p-1 text-blue-600"
                        title="Download"
                        onClick={() => handleDownloadPO(po.po_number)}
                        disabled={downloading === po.po_number}
                      >
                        {downloading === po.po_number ? (
                          <span className="animate-spin">⏳</span>
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 p-1 text-red-600"
                        title="Delete"
                        onClick={() => handleDeletePO(po.po_number)}
                        disabled={deleting === po.po_number}
                      >
                        {deleting === po.po_number ? (
                          <span className="animate-spin">⏳</span>
                        ) : (
                          <Trash className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
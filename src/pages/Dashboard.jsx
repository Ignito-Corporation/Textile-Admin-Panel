


// // import { useState, useEffect } from 'react';
// // import { Card, CardContent } from "@/components/ui/card";
// // import {
// //   ShoppingCart,
// //   FileText,
// //   CircleDollarSign,
// //   PackageCheck,
// // } from "lucide-react";
// // import { useNavigate } from "react-router-dom";

// // export default function Dashboard() {
// //   const navigate = useNavigate();
// //   const [cards, setCards] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchDashboardData = async () => {
// //       try {
// //         // Fetch all data in parallel
// //         const [poResponse, billResponse, knittingResponse, dyeingResponse] = 
// //           await Promise.all([
// //             fetch('http://localhost:8080/api/po/'),
// //             fetch('http://localhost:8080/api/purchase-bill/'),
// //             fetch('http://localhost:8080/api/jobwork/get-items/Knitting'),
// //             fetch('http://localhost:8080/api/jobwork/get-items/Dyeing')
// //           ]);

// //         // Handle responses
// //         const purchaseOrders = await poResponse.json();
// //         const bills = await billResponse.json();
// //         const knittingItems = await knittingResponse.json();
// //         const dyeingItems = await dyeingResponse.json();

// //         // Calculate values
// //         const totalPOs = purchaseOrders.length;
        
// //         const totalBillValue = bills.reduce((sum, bill) => 
// //           sum + bill.products.reduce((productSum, product) => 
// //             productSum + product.amount, 0
// //           ), 0
// //         );
        
// //         const totalOut = [
// //           ...(Array.isArray(knittingItems) ? knittingItems : []),
// //           ...(Array.isArray(dyeingItems) ? dyeingItems : [])
// //         ].length;

// //         // Format currency for bill value
// //         const formattedBillValue = new Intl.NumberFormat('en-IN', {
// //           style: 'currency',
// //           currency: 'INR',
// //           maximumFractionDigits: 1
// //         }).format(totalBillValue);

// //         // Update cards with dynamic data
// //         setCards([
// //           {
// //             icon: <ShoppingCart className="text-[#2f3c4f]" />,
// //             title: "Total POs",
// //             value: totalPOs,
// //             route: "/dashboard/all-pos",
// //           },
// //           {
// //             icon: <FileText className="text-green-600" />,
// //             title: "Bill Entry Purchase",
// //             value: formattedBillValue,
// //             route: "/dashboard/bill-entry",
// //           },
// //           {
// //             icon: <CircleDollarSign className="text-yellow-500" />,
// //             title: "Out Entry",
// //             value: totalOut,
// //             route: "/dashboard/out-entry",
// //           },
// //           {
// //             icon: <PackageCheck className="text-blue-600" />,
// //             title: "In Entry",
// //             value: 0, // Placeholder for future implementation
// //             route: "/dashboard/in-entry",
// //           },
// //         ]);
        
// //       } catch (err) {
// //         console.error('Dashboard data fetch error:', err);
// //         // Fallback to default cards on error
// //         setCards(getDefaultCards());
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchDashboardData();
// //   }, []);

// //   const getDefaultCards = () => ([
// //     {
// //       icon: <ShoppingCart className="text-[#2f3c4f]" />,
// //       title: "Total POs",
// //       value: 0,
// //       route: "/dashboard/all-pos",
// //     },
// //     {
// //       icon: <FileText className="text-green-600" />,
// //       title: "Bill Entry Purchase",
// //       value: '₹0',
// //       route: "/dashboard/bill-entry",
// //     },
// //     {
// //       icon: <CircleDollarSign className="text-yellow-500" />,
// //       title: "Out Entry",
// //       value: 0,
// //       route: "/dashboard/out-entry",
// //     },
// //     {
// //       icon: <PackageCheck className="text-blue-600" />,
// //       title: "In Entry",
// //       value: 0,
// //       route: "/dashboard/in-entry",
// //     },
// //   ]);

// //   const handleCardClick = (route) => {
// //     if (route) navigate(route);
// //   };

// //   if (loading) {
// //     return (
// //       <div className="p-4">
// //         <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
// //           {getDefaultCards().map((card, i) => (
// //             <Card key={i} className="shadow">
// //               <CardContent className="p-4 flex flex-col gap-2">
// //                 <div className="flex items-center justify-between">
// //                   <span className="text-sm text-gray-700">{card.title}</span>
// //                   {card.icon}
// //                 </div>
// //                 <div className="text-xl font-bold text-black">Loading...</div>
// //               </CardContent>
// //             </Card>
// //           ))}
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="p-4">
// //       <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
// //         {cards.map((card, i) => (
// //           <Card
// //             key={i}
// //             className={`shadow cursor-pointer transition hover:shadow-md ${card.route ? "hover:bg-gray-100" : ""
// //               }`}
// //             onClick={() => handleCardClick(card.route)}
// //           >
// //             <CardContent className="p-4 flex flex-col gap-2">
// //               <div className="flex items-center justify-between">
// //                 <span className="text-sm text-gray-700">{card.title}</span>
// //                 {card.icon}
// //               </div>
// //               <div className="text-xl font-bold text-black">{card.value}</div>
// //             </CardContent>
// //           </Card>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }

// import { useState, useEffect } from 'react';
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   ShoppingCart,
//   FileText,
//   CircleDollarSign,
//   PackageCheck,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// export default function Dashboard() {
//   const navigate = useNavigate();
//   const [cards, setCards] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         // Fetch all data in parallel
//         const [poResponse, billResponse, knittingResponse, dyeingResponse, inEntryResponse] = 
//           await Promise.all([
//             fetch('https://textile-admin-panel.onrender.com/api/po/'),
//             fetch('https://textile-admin-panel.onrender.com/api/purchase-bill/'),
//             fetch('https://textile-admin-panel.onrender.com/api/jobwork/get-items/Knitting'),
//             fetch('https://textile-admin-panel.onrender.com/api/jobwork/get-items/Dyeing'),
//             fetch('https://textile-admin-panel.onrender.com/api/jobwork/api/in-quantities/')
//           ]);

//         // Handle responses
//         const purchaseOrders = await poResponse.json();
//         const bills = await billResponse.json();
//         const knittingItems = await knittingResponse.json();
//         const dyeingItems = await dyeingResponse.json();
//         const inEntries = await inEntryResponse.json();

//         // Calculate values
//         const totalPOs = purchaseOrders.length;
        
//         const totalBillValue = bills.reduce((sum, bill) => 
//           sum + bill.products.reduce((productSum, product) => 
//             productSum + product.amount, 0
//           ), 0
//         );
        
//         const totalOut = [
//           ...(Array.isArray(knittingItems) ? knittingItems : []),
//           ...(Array.isArray(dyeingItems) ? dyeingItems : [])
//         ].length;

//         const totalIn = Array.isArray(inEntries) ? inEntries.length : 0;

//         // Format currency for bill value
//         const formattedBillValue = new Intl.NumberFormat('en-IN', {
//           style: 'currency',
//           currency: 'INR',
//           maximumFractionDigits: 1
//         }).format(totalBillValue);

//         // Update cards with dynamic data
//         setCards([
//           {
//             icon: <ShoppingCart className="text-[#2f3c4f]" />,
//             title: "Total POs",
//             value: totalPOs,
//             route: "/dashboard/all-pos",
//           },
//           {
//             icon: <FileText className="text-green-600" />,
//             title: "Bill Entry Purchase",
//             value: formattedBillValue,
//             route: "/dashboard/bill-entry",
//           },
//           {
//             icon: <CircleDollarSign className="text-yellow-500" />,
//             title: "Out Entry",
//             value: totalOut,
//             route: "/dashboard/out-entry",
//           },
//           {
//             icon: <PackageCheck className="text-blue-600" />,
//             title: "In Entry",
//             value: totalIn,
//             route: "/dashboard/in-entry",
//           },
//         ]);
        
//       } catch (err) {
//         console.error('Dashboard data fetch error:', err);
//         // Fallback to default cards on error
//         setCards(getDefaultCards());
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   const getDefaultCards = () => ([
//     {
//       icon: <ShoppingCart className="text-[#2f3c4f]" />,
//       title: "Total POs",
//       value: 0,
//       route: "/dashboard/all-pos",
//     },
//     {
//       icon: <FileText className="text-green-600" />,
//       title: "Bill Entry Purchase",
//       value: '₹0',
//       route: "/dashboard/bill-entry",
//     },
//     {
//       icon: <CircleDollarSign className="text-yellow-500" />,
//       title: "Out Entry",
//       value: 0,
//       route: "/dashboard/out-entry",
//     },
//     {
//       icon: <PackageCheck className="text-blue-600" />,
//       title: "In Entry",
//       value: 0,
//       route: "/dashboard/in-entry",
//     },
//   ]);

//   const handleCardClick = (route) => {
//     if (route) navigate(route);
//   };

//   if (loading) {
//     return (
//       <div className="p-4">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           {getDefaultCards().map((card, i) => (
//             <Card key={i} className="shadow">
//               <CardContent className="p-4 flex flex-col gap-2">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-gray-700">{card.title}</span>
//                   {card.icon}
//                 </div>
//                 <div className="text-xl font-bold text-black">Loading...</div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         {cards.map((card, i) => (
//           <Card
//             key={i}
//             className={`shadow cursor-pointer transition hover:shadow-md ${card.route ? "hover:bg-gray-100" : ""
//               }`}
//             onClick={() => handleCardClick(card.route)}
//           >
//             <CardContent className="p-4 flex flex-col gap-2">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-700">{card.title}</span>
//                 {card.icon}
//               </div>
//               <div className="text-xl font-bold text-black">{card.value}</div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import {
  ShoppingCart,
  FileText,
  CircleDollarSign,
  PackageCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Base URL
        const baseUrl = 'https://textile-admin-panel.onrender.com';
        
        // Fetch all data in parallel
        const [poResponse, billResponse, knittingResponse, dyeingResponse, inEntryResponse] = 
          await Promise.all([
            fetch(`${baseUrl}/api/po/`),
            fetch(`${baseUrl}/api/purchase-bill/`),
            fetch(`${baseUrl}/api/jobwork/get-items/Knitting`),
            fetch(`${baseUrl}/api/jobwork/get-items/Dyeing`),
            fetch(`${baseUrl}/api/in-quantities/`) // Fixed the URL here
          ]);

        // Check for errors in responses
        const responses = [poResponse, billResponse, knittingResponse, dyeingResponse, inEntryResponse];
        const errors = responses.filter(response => !response.ok);
        
        if (errors.length > 0) {
          throw new Error(`Failed to fetch data: ${errors.map(err => err.status).join(', ')}`);
        }

        // Handle responses
        const [purchaseOrders, bills, knittingItems, dyeingItems, inEntries] = await Promise.all([
          poResponse.json(),
          billResponse.json(),
          knittingResponse.json(),
          dyeingResponse.json(),
          inEntryResponse.json()
        ]);

        console.log('Fetched data:', {
          purchaseOrders,
          bills,
          knittingItems,
          dyeingItems,
          inEntries
        });

        // Calculate values
        const totalPOs = purchaseOrders.length || 0;
        
        const totalBillValue = bills.reduce((sum, bill) => {
          if (!bill.products) return sum;
          return sum + bill.products.reduce((productSum, product) => 
            productSum + (product.amount || 0), 0
          );
        }, 0);
        
        const totalOut = [
          ...(Array.isArray(knittingItems) ? knittingItems : []),
          ...(Array.isArray(dyeingItems) ? dyeingItems : [])
        ].length;

        const totalIn = Array.isArray(inEntries) ? inEntries.length : 0;

        // Format currency for bill value
        const formattedBillValue = new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 1
        }).format(totalBillValue);

        // Update cards with dynamic data
        setCards([
          {
            icon: <ShoppingCart className="text-[#2f3c4f]" />,
            title: "Total POs",
            value: totalPOs,
            route: "/dashboard/all-pos",
          },
          {
            icon: <FileText className="text-green-600" />,
            title: "Bill Entry Purchase",
            value: formattedBillValue,
            route: "/dashboard/bill-entry",
          },
          {
            icon: <CircleDollarSign className="text-yellow-500" />,
            title: "Out Entry",
            value: totalOut,
            route: "/dashboard/out-entry",
          },
          {
            icon: <PackageCheck className="text-blue-600" />,
            title: "In Entry",
            value: totalIn,
            route: "/dashboard/in-entry",
          },
        ]);
        
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        setError(err.message);
        // Fallback to default cards on error
        setCards(getDefaultCards());
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getDefaultCards = () => ([
    {
      icon: <ShoppingCart className="text-[#2f3c4f]" />,
      title: "Total POs",
      value: 0,
      route: "/dashboard/all-pos",
    },
    {
      icon: <FileText className="text-green-600" />,
      title: "Bill Entry Purchase",
      value: '₹0',
      route: "/dashboard/bill-entry",
    },
    {
      icon: <CircleDollarSign className="text-yellow-500" />,
      title: "Out Entry",
      value: 0,
      route: "/dashboard/out-entry",
    },
    {
      icon: <PackageCheck className="text-blue-600" />,
      title: "In Entry",
      value: 0,
      route: "/dashboard/in-entry",
    },
  ]);

  const handleCardClick = (route) => {
    if (route) navigate(route);
  };

  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {getDefaultCards().map((card, i) => (
            <Card key={i} className="shadow">
              <CardContent className="p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{card.title}</span>
                  {card.icon}
                </div>
                <div className="text-xl font-bold text-black">Loading...</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          Error loading data: {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <Card
            key={i}
            className={`shadow cursor-pointer transition hover:shadow-md ${card.route ? "hover:bg-gray-100" : ""
              }`}
            onClick={() => handleCardClick(card.route)}
          >
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
    </div>
  );
}
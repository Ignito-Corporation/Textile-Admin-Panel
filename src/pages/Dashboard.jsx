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

  const cards = [
    {
      icon: <ShoppingCart className="text-[#2f3c4f]" />,
      title: "Total POs",
      value: 4,
      route: "/dashboard/all-pos", // ✅ Updated route
    },
    {
      icon: <FileText className="text-green-600" />,
      title: "Bill Entry Purchase",
      value: 4,
      route: "/dashboard/bill-entry", // ✅ Updated route
    },
    {
      icon: <CircleDollarSign className="text-yellow-500" />,
      title: "Out Entry",
      value: "₹28,84,389.2",
    },
    {
      icon: <PackageCheck className="text-blue-600" />,
      title: "In Entry",
      value: 4,

    },
  ];

  const handleCardClick = (route) => {
    if (route) navigate(route);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

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

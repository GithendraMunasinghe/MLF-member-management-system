import { TrendingUp } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string;
  growth: string;
  growthColor: string;
  onView?: () => void; // optional click handler
}

export default function SummaryCard({
  title,
  value,
  growth,
  growthColor,
  onView, // 👈 destructure it here
}: SummaryCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
          <p className="text-3xl font-bold mt-2">{value}</p>

          <div className={`flex items-center mt-2 text-sm ${growthColor}`}>
            <TrendingUp size={16} className="mr-1" />
            {growth}
          </div>
        </div>

        {/* 🔹 Replace <a> with button and use onView */}
        <button
          onClick={onView}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View Directory
        </button>
      </div>
    </div>
  );
}
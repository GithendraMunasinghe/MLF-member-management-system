import SummaryCard from "@/components/adminpanel/SummaryCard";

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      
      <h1 className="text-2xl font-bold text-gray-800">
        Admin Dashboard
      </h1>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <SummaryCard
          title="Total Members"
          value="--"
          growth="--"
          growthColor="text-gray-500"
          onView={() => console.log("View clicked")}
        />

      </div>

    </div>
  );
}
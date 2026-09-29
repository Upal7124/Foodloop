import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import StatCard from "../components/dashboard/StatCard";
import FoodConsumptionChart from "../components/dashboard/FoodConsumptionChart";
import WasteCompositionChart from "../components/dashboard/WasteCompositionChart";
import SensorStatus from "../components/dashboard/SensorStatus";
import AIRecommendation from "../components/dashboard/AIRecommendation";
import RedistributionPanel from "../components/dashboard/RedistributionPanel";
import ImpactPanel from "../components/dashboard/ImpactPanel";
import RecentActivity from "../components/dashboard/RecentActivity";
import MotivationBanner from "../components/dashboard/MotivationBanner";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiFetch("/api/dashboard/stats");
        const data = await response.json();

        if (data.success) {
          setDashboardData(data.stats);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };

    fetchStats();
  }, []);
  return (
    <div className="mt-5 space-y-5">
      {/* Stat Cards Row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            id: 1,
            title: "Food Prepared",
            value: `${dashboardData?.mealsPrepared ?? 0} kg`,
          },
          {
            id: 2,
            title: "Meals Served",
            value: dashboardData?.mealsServed ?? 0,
          },
          {
            id: 3,
            title: "Food Waste",
            value: `${dashboardData?.foodWaste ?? 0} kg`,
          },
          {
            id: 4,
            title: "Food Redistributed",
            value: `${dashboardData?.foodRedistributed ?? 0} kg`,
          },
        ].map((card) => (
          <StatCard key={card.id} {...card} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-12 gap-4">
        {/* Food Consumption Chart - 7 cols */}
        <div className="col-span-7">
          <FoodConsumptionChart data={dashboardData?.consumption || []} />
        </div>
        {/* Waste Composition - 3 cols */}
        <div className="col-span-3 h-full">
          <WasteCompositionChart
            data={dashboardData?.wasteComposition || []}
            totalWaste={dashboardData?.foodWaste || 0}
          />
        </div>
        {/* Sensor Status - 2 cols */}
        <div className="col-span-2 h-full">
          <SensorStatus data={dashboardData?.sensors || []} />
        </div>
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-12 gap-4">
        {/* AI Recommendation - 4 cols */}
        <div className=" col-span-4">
          <AIRecommendation data={dashboardData?.recommendations || []} />
        </div>
        {/* Redistribution - 4 cols */}
        <div className="col-span-4">
          <RedistributionPanel data={dashboardData?.redistribution || []} />
        </div>
        {/* Impact - 4 cols */}
        <div className="col-span-4">
          <ImpactPanel data={dashboardData?.impact || []} />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-12 gap-4">
        {/* Recent Activity - 9 cols */}
        <div className="col-span-9">
          <RecentActivity data={dashboardData?.recentActivities || []} />
        </div>
        {/* Motivation Banner - 3 cols */}
        <div className="col-span-3">
          <MotivationBanner data={dashboardData?.motivation || null} />
        </div>
      </div>
    </div>
  );
}

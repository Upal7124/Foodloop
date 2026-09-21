import StatCard from '../components/dashboard/StatCard';
import FoodConsumptionChart from '../components/dashboard/FoodConsumptionChart';
import WasteCompositionChart from '../components/dashboard/WasteCompositionChart';
import SensorStatus from '../components/dashboard/SensorStatus';
import AIRecommendation from '../components/dashboard/AIRecommendation';
import RedistributionPanel from '../components/dashboard/RedistributionPanel';
import ImpactPanel from '../components/dashboard/ImpactPanel';
import RecentActivity from '../components/dashboard/RecentActivity';
import MotivationBanner from '../components/dashboard/MotivationBanner';
import { statCards } from '../data/mockData';

export default function Dashboard() {
  return (
    <div className="space-y-5">
      {/* Stat Cards Row */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map((card) => (
          <StatCard key={card.id} {...card} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-12 gap-4">
        {/* Food Consumption Chart - 7 cols */}
        <div className="col-span-7">
          <FoodConsumptionChart />
        </div>
        {/* Waste Composition - 3 cols */}
        <div className="col-span-3">
          <WasteCompositionChart />
        </div>
        {/* Sensor Status - 2 cols */}
        <div className="col-span-2">
          <SensorStatus />
        </div>
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-12 gap-4">
        {/* AI Recommendation - 4 cols */}
        <div className="col-span-4">
          <AIRecommendation />
        </div>
        {/* Redistribution - 4 cols */}
        <div className="col-span-4">
          <RedistributionPanel />
        </div>
        {/* Impact - 4 cols */}
        <div className="col-span-4">
          <ImpactPanel />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-12 gap-4">
        {/* Recent Activity - 9 cols */}
        <div className="col-span-9">
          <RecentActivity />
        </div>
        {/* Motivation Banner - 3 cols */}
        <div className="col-span-3">
          <MotivationBanner />
        </div>
      </div>
    </div>
  );
}

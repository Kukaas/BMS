
import RecentActivities from "../components/RecentActivities";
import UpcomingEvents from "../components/UpcomingEvents";
import PopulationChart from "../components/PopulationChart";
import ProjectsOverview from "../components/ProjectsOverview";
import Statistics from "../components/Statistics";

export default function DashboardSuperAdmin() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            </div>

            <Statistics />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4">
                    <RecentActivities />
                </div>
                <div className="col-span-3">
                    <UpcomingEvents />
                </div>
                <div className="col-span-4">
                    <PopulationChart />
                </div>
                <div className="col-span-3">
                    <ProjectsOverview />
                </div>
            </div>
        </div>
    );
}

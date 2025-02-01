import Statistics from "./components/Statistics";
import RecentActivities from "./components/RecentActivities";
import UpcomingEvents from "./components/UpcomingEvents";
import PopulationChart from "./components/PopulationChart";
import ProjectsOverview from "./components/ProjectsOverview";

function Overview() {
    return (
        <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Barangay Dashboard</h1>
            </div>
            <Statistics />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <RecentActivities />
                <UpcomingEvents />
                <PopulationChart />
                <ProjectsOverview />
            </div>
        </div>
    );
}

export default Overview;

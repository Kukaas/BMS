
import Statistics from "./components/Statistics";
import RecentActivities from "../components/RecentActivities";
import UpcomingEvents from "../components/UpcomingEvents";

const DashboardUser = () => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Resident Dashboard</h1>
            </div>

            <Statistics />

            <div className="grid gap-4 md:grid-cols-2">
                <div className="col-span-1">
                    <RecentActivities />
                </div>
                <div className="col-span-1">
                    <UpcomingEvents />
                </div>
            </div>
        </div>
    );
};

export default DashboardUser
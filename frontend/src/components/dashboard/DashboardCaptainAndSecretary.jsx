import Statistics from "./components/Statistics";
import Officials from "./components/Offiicials";
import UpcomingEvents from "./components/UpcomingEvents";
import { useSelector } from "react-redux";


const DashboardCaptainAndSecretary = () => {
    const { currentUser } = useSelector((state) => state.user);
    const title = currentUser.role === "secretary" ? "Secretary Dashboard" : "Captain Dashboard";

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            </div>

            <Statistics />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4">
                    <Officials />
                </div>
                <div className="col-span-3">
                    <UpcomingEvents />
                </div>
            </div>
        </div>

    );
};

export default DashboardCaptainAndSecretary
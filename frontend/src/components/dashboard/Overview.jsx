import { useSelector } from "react-redux";
import DashboardSuperAdmin from "./superAdmin/DashboardSuperAdmin";
import DashboardCaptainAndSecretary from "./DashboardCaptainAndSecretary";
import DashboardUser from "./user/DashboardUser";
import DashboardTreasurer from "./treasurer/DashboardTreasurer";

export default function Overview() {
    const { currentUser } = useSelector((state) => state.user);

    if (!currentUser) {
        return <div className="flex-1 space-y-2">Loading...</div>;
    }

    return (
        <div className="flex-1 space-y-2">
            {currentUser.role === "superAdmin" ? (
                <DashboardSuperAdmin />
            ) : currentUser.role === "chairman" || currentUser.role === "secretary" ? (
                <DashboardCaptainAndSecretary />
            ) : currentUser.role === "treasurer" ? (
                <DashboardTreasurer />
            ) : (
                <DashboardUser />
            )}
        </div>
    );
}


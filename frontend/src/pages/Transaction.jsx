import { TransactionHistoryDashboard } from "@/components/dashboard/superAdmin/TransactionHistory";
import { TransactionHistoryCaptain } from "@/components/dashboard/captain/TransactionHistoryCaptain";
import { useSelector } from "react-redux";

export default function TransactionHistoryPage() {
    const { currentUser } = useSelector((state) => state.user);
    return (
        <div className="container mx-auto">
            {currentUser.role === "superAdmin" ? (
                <TransactionHistoryDashboard />
            ) : (
                <TransactionHistoryCaptain />
            )}
        </div>
    );
}


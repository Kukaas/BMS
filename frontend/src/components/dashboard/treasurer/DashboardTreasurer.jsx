import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Receipt, CreditCard, History, AlertTriangle } from "lucide-react";
import api from "@/lib/axios";
import { useSelector } from "react-redux";

export default function DashboardTreasurer() {
    const { currentUser } = useSelector((state) => state.user);
    const [dashboardData, setDashboardData] = useState({
        barangayClearanceRequests: 0,
        businessClearanceRequests: 0,
        blotterReportsCount: 0,
        totalCollections: 0,
        recentTransactionsCount: 0,
        recentTransactions: [],
        collectionSummary: {
            barangayClearance: 0,
            businessClearance: 0,
            others: 0,
        },
        yearlyCollectionSummary: {
            barangayClearance: 0,
            businessClearance: 0,
            others: 0,
        },
        yearlyTotal: 0,
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                if (!currentUser?.barangay) return;

                const response = await api.get("/treasurer/dashboard", {
                    params: { barangay: currentUser.barangay },
                });

                if (response.data?.success) {
                    setDashboardData(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        if (currentUser?.barangay) {
            fetchDashboardData();
            // Refresh data every 5 minutes
            const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
            return () => clearInterval(interval);
        }
    }, [currentUser]);

    return (
        <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Barangay Clearance Requests
                        </CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {dashboardData.barangayClearanceRequests}
                        </div>
                        <p className="text-xs text-muted-foreground">Pending requests today</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Business Permit Applications
                        </CardTitle>
                        <Receipt className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {dashboardData.businessClearanceRequests}
                        </div>
                        <p className="text-xs text-muted-foreground">Pending applications today</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Collections Today
                        </CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ₱{dashboardData.totalCollections.toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground">From all transactions</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Blotter Reports</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {dashboardData.blotterReportsCount}
                        </div>
                        <p className="text-xs text-muted-foreground">New reports today</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity and Collection Summary Section */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {dashboardData.recentTransactions.length > 0 ? (
                            <div className="space-y-4">
                                {dashboardData.recentTransactions.map((transaction, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">
                                                {transaction.requestedDocument}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {transaction.userId?.firstName}{" "}
                                                {transaction.userId?.lastName}
                                            </p>
                                        </div>
                                        <div className="text-sm">
                                            ₱{transaction.amount?.toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No recent activity</p>
                        )}
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Collection Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {/* Today's Collections */}
                            <div>
                                <h3 className="text-sm font-semibold mb-4">Today</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-sm">Barangay Clearance</span>
                                        <span className="text-sm font-medium">
                                            ₱
                                            {dashboardData.collectionSummary.barangayClearance.toFixed(
                                                2
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Business Permit</span>
                                        <span className="text-sm font-medium">
                                            ₱
                                            {dashboardData.collectionSummary.businessClearance.toFixed(
                                                2
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Other Collections</span>
                                        <span className="text-sm font-medium">
                                            ₱{dashboardData.collectionSummary.others.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="pt-2 border-t">
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium">Total Today</span>
                                            <span className="text-sm font-medium">
                                                ₱{dashboardData.totalCollections.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Yearly Collections */}
                            <div>
                                <h3 className="text-sm font-semibold mb-4">This Year</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-sm">Barangay Clearance</span>
                                        <span className="text-sm font-medium">
                                            ₱
                                            {dashboardData.yearlyCollectionSummary.barangayClearance.toFixed(
                                                2
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Business Permit</span>
                                        <span className="text-sm font-medium">
                                            ₱
                                            {dashboardData.yearlyCollectionSummary.businessClearance.toFixed(
                                                2
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Other Collections</span>
                                        <span className="text-sm font-medium">
                                            ₱
                                            {dashboardData.yearlyCollectionSummary.others.toFixed(
                                                2
                                            )}
                                        </span>
                                    </div>
                                    <div className="pt-2 border-t">
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium">
                                                Total This Year
                                            </span>
                                            <span className="text-sm font-medium">
                                                ₱{dashboardData.yearlyTotal.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

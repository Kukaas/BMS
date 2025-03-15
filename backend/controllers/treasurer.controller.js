import BarangayClearance from "../models/barangay.clearance.model.js";
import BusinessClearance from "../models/business.clearance.model.js";
import TransactionHistory from "../models/transaction.history.model.js";
import BlotterReport from "../models/blotter.report.model.js";
import { STATUS_TYPES } from "../models/barangay.clearance.model.js";

// Get treasurer dashboard data
export const getTreasurerDashboardData = async (req, res) => {
    try {
        const { barangay } = req.user;

        if (!barangay) {
            return res.status(400).json({
                success: false,
                message: "Barangay information is required",
            });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get start of current year
        const startOfYear = new Date(today.getFullYear(), 0, 1);

        // Get all document requests for today
        const [barangayClearances, businessClearances, blotterReports] = await Promise.all([
            // Get barangay clearances
            BarangayClearance.find({
                barangay,
                createdAt: { $gte: today },
            }).populate("userId", "firstName lastName"),

            // Get business clearances
            BusinessClearance.find({
                barangay,
                createdAt: { $gte: today },
            }).populate("userId", "firstName lastName"),

            // Get blotter reports
            BlotterReport.find({
                createdAt: { $gte: today },
            }).populate("userId", "firstName lastName"),
        ]);

        // Get yearly documents
        const [yearlyBarangayClearances, yearlyBusinessClearances, yearlyBlotterReports] =
            await Promise.all([
                BarangayClearance.find({
                    barangay,
                    createdAt: { $gte: startOfYear },
                }),
                BusinessClearance.find({
                    barangay,
                    createdAt: { $gte: startOfYear },
                }),
                BlotterReport.find({
                    createdAt: { $gte: startOfYear },
                }),
            ]);

        // Count pending requests
        const barangayClearanceRequests = barangayClearances.filter(
            (doc) => doc.status === STATUS_TYPES.PENDING
        ).length;
        const businessClearanceRequests = businessClearances.filter(
            (doc) => doc.status === STATUS_TYPES.PENDING
        ).length;
        const blotterReportsCount = blotterReports.length;

        // Calculate today's collections (only from approved/completed transactions)
        const todayCollections = {
            barangayClearance: barangayClearances
                .filter((doc) =>
                    [STATUS_TYPES.APPROVED, STATUS_TYPES.COMPLETED].includes(doc.status)
                )
                .reduce((total, doc) => total + (doc.amount || 0), 0),
            businessClearance: businessClearances
                .filter((doc) =>
                    [STATUS_TYPES.APPROVED, STATUS_TYPES.COMPLETED].includes(doc.status)
                )
                .reduce((total, doc) => total + (doc.amount || 0), 0),
            others: blotterReports
                .filter((doc) => doc.status === "Resolved" || doc.status === "Closed")
                .reduce((total, doc) => total + (doc.amount || 0), 0),
        };

        // Calculate yearly collections (only from approved/completed transactions)
        const yearlyCollections = {
            barangayClearance: yearlyBarangayClearances
                .filter((doc) =>
                    [STATUS_TYPES.APPROVED, STATUS_TYPES.COMPLETED].includes(doc.status)
                )
                .reduce((total, doc) => total + (doc.amount || 0), 0),
            businessClearance: yearlyBusinessClearances
                .filter((doc) =>
                    [STATUS_TYPES.APPROVED, STATUS_TYPES.COMPLETED].includes(doc.status)
                )
                .reduce((total, doc) => total + (doc.amount || 0), 0),
            others: yearlyBlotterReports
                .filter((doc) => doc.status === "Resolved" || doc.status === "Closed")
                .reduce((total, doc) => total + (doc.amount || 0), 0),
        };

        // Calculate totals
        const totalCollections = Object.values(todayCollections).reduce((a, b) => a + b, 0);
        const yearlyTotal = Object.values(yearlyCollections).reduce((a, b) => a + b, 0);

        // Combine all recent transactions (only approved/completed)
        const allTransactions = [
            ...barangayClearances
                .filter((doc) =>
                    [STATUS_TYPES.APPROVED, STATUS_TYPES.COMPLETED].includes(doc.status)
                )
                .map((doc) => ({
                    requestedDocument: "Barangay Clearance",
                    amount: doc.amount,
                    userId: doc.userId,
                    dateRequested: doc.createdAt,
                    status: doc.status,
                })),
            ...businessClearances
                .filter((doc) =>
                    [STATUS_TYPES.APPROVED, STATUS_TYPES.COMPLETED].includes(doc.status)
                )
                .map((doc) => ({
                    requestedDocument: "Business Clearance",
                    amount: doc.amount,
                    userId: doc.userId,
                    dateRequested: doc.createdAt,
                    status: doc.status,
                })),
            ...blotterReports
                .filter((doc) => doc.status === "Resolved" || doc.status === "Closed")
                .map((doc) => ({
                    requestedDocument: "Blotter Report",
                    amount: doc.amount,
                    userId: doc.userId,
                    dateRequested: doc.createdAt,
                    status: doc.status,
                })),
        ];

        // Sort transactions by date and get the 10 most recent
        const recentTransactions = allTransactions
            .sort((a, b) => b.dateRequested - a.dateRequested)
            .slice(0, 10);

        res.status(200).json({
            success: true,
            data: {
                barangayClearanceRequests,
                businessClearanceRequests,
                blotterReportsCount,
                totalCollections,
                recentTransactions,
                collectionSummary: todayCollections,
                yearlyCollectionSummary: yearlyCollections,
                yearlyTotal,
                recentTransactionsCount: recentTransactions.length,
            },
        });
    } catch (error) {
        console.error("Error fetching treasurer dashboard data:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching treasurer dashboard data",
            error: error.message,
        });
    }
};

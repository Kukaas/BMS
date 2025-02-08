import TransactionHistory from "../models/transaction.history.model.js";

// Create a new transaction history entry
export const createTransactionHistory = async (transactionData) => {
    try {
        // Ensure transactionData is an object
        if (typeof transactionData !== "object" || transactionData === null) {
            throw new Error("Transaction data must be an object");
        }

        // Create a new document instance
        const newTransactionHistory = new TransactionHistory({
            userId: transactionData.userId,
            transactionId: transactionData.transactionId,
            residentName: transactionData.residentName,
            requestedDocument: transactionData.requestedDocument,
            dateRequested: transactionData.dateRequested,
            barangay: transactionData.barangay,
            action: transactionData.action,
            status: transactionData.status || "pending",
        });

        const savedTransactionHistory = await newTransactionHistory.save();
        return savedTransactionHistory;
    } catch (error) {
        console.error("Error creating transaction history:", error);
        throw error;
    }
};

// Get all transaction history entries
export const getAllTransactionHistory = async (req, res) => {
    try {
        const transactions = await TransactionHistory.find()
            .sort({ timestamp: -1 }) // Sort by newest first
            .populate("userId", "username email"); // Only populate userId

        // Transform the data to match frontend expectations
        const transformedTransactions = transactions.map((transaction) => ({
            _id: transaction._id,
            residentName: transaction.residentName,
            requestedDocument: transaction.requestedDocument,
            dateRequested: transaction.dateRequested,
            dateApproved: transaction.dateApproved,
            dateCompleted: transaction.dateCompleted,
            barangay: transaction.barangay,
            approvedBy: transaction.approvedBy,
            status: transaction.status,
            action: transaction.action,
            userId: transaction.userId,
        }));

        res.status(200).json(transformedTransactions);
    } catch (error) {
        console.error("Error getting transaction history:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching transaction history",
            error: error.message,
        });
    }
};

// Get transaction history by user ID
export const getUserTransactionHistory = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const transactions = await TransactionHistory.find({ userId })
            .sort({ timestamp: -1 })
            .populate("userId", "username email")
            .populate("transactionId");
        res.status(200).json(transactions);
    } catch (error) {
        next(error);
    }
};

// Update transaction status
export const updateTransactionStatus = async (transactionId, updateData) => {
    try {
        console.log("Updating transaction history:", { transactionId, updateData });

        // First try to find the transaction history
        const transactionHistory = await TransactionHistory.findOne({ transactionId });

        if (!transactionHistory) {
            console.error("No transaction history found for:", transactionId);
            throw new Error("Transaction history not found");
        }

        // Update the transaction history
        const updatedTransaction = await TransactionHistory.findByIdAndUpdate(
            transactionHistory._id,
            {
                $set: {
                    status: updateData.status,
                    dateApproved: updateData.dateApproved,
                    dateCompleted: updateData.dateCompleted,
                    action: updateData.action,
                    approvedBy: updateData.approvedBy,
                },
            },
            { new: true }
        );

        console.log("Updated transaction history:", updatedTransaction);
        return updatedTransaction;
    } catch (error) {
        console.error("Error updating transaction status:", error);
        throw error;
    }
};

// Get transaction history by barangay
export const getBarangayTransactionHistory = async (req, res, next) => {
    try {
        const { barangay } = req.params;
        const transactions = await TransactionHistory.find({ barangay }).sort({ timestamp: -1 });
        res.status(200).json({
            success: true,
            message: "Transaction history fetched successfully",
            data: transactions,
        });
    } catch (error) {
        next(error);
    }
};

// Get transaction statistics
export const getTransactionStats = async (req, res, next) => {
    try {
        const stats = await TransactionHistory.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        const totalTransactions = await TransactionHistory.countDocuments();
        const recentTransactions = await TransactionHistory.find().sort({ timestamp: -1 }).limit(5);

        res.status(200).json({
            statusDistribution: stats,
            totalTransactions,
            recentTransactions,
        });
    } catch (error) {
        next(error);
    }
};

// Delete transaction history
export const deleteTransactionHistory = async (id) => {
    try {
        const deletedTransaction = await TransactionHistory.findByIdAndDelete(id);

        if (!deletedTransaction) {
            throw new Error("Transaction not found");
        }

        return deletedTransaction;
    } catch (error) {
        console.error("Error deleting transaction history:", error);
        throw error;
    }
};

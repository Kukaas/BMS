"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import api from "@/lib/axios";
import { TransactionTableView } from "./components/TransactionTableView";
import { useSelector } from "react-redux";
// Add formatDate function at the top level
const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

function getStatusColor(status) {
    switch (status?.toLowerCase()) {
        case "completed":
            return "bg-green-100 text-green-800 hover:bg-green-100";
        case "pending":
            return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
        case "approved":
            return "bg-blue-100 text-blue-800 hover:bg-blue-100";
        case "rejected":
            return "bg-red-100 text-red-800 hover:bg-red-100";
        default:
            return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
}

export function TransactionHistoryCaptain() {
    const { currentUser } = useSelector((state) => state.user);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const [transactionsPerPage] = useState(10);

    const [searchTerm, setSearchTerm] = useState("");

    // Fetch transaction history data
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await api.get(`/transaction-history/${currentUser.barangay}`, {
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`,
                    },
                });

                if (response.data.success) {
                    const userBarangay = currentUser.barangay?.toLowerCase();
                    const filteredTransactions = response.data.data.filter(
                        (transaction) => transaction.barangay?.toLowerCase() === userBarangay
                    );
                    setTransactions(filteredTransactions);
                    setFilteredTransactions(filteredTransactions);
                } else {
                    setTransactions([]);
                    setFilteredTransactions([]);
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
                setTransactions([]);
                setFilteredTransactions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    // Apply search filter
    useEffect(() => {
        const result = transactions.filter(
            (t) =>
                t.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.requestedDocument.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredTransactions(result);
        setCurrentPage(1);
    }, [transactions, searchTerm]);

    const indexOfLastTransaction = currentPage * transactionsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
    const currentTransactions = filteredTransactions.slice(
        indexOfFirstTransaction,
        indexOfLastTransaction
    );
    const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

    if (loading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-8">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Loading transactions...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <TransactionTableView
                currentTransactions={currentTransactions}
                formatDate={formatDate}
                getStatusColor={getStatusColor}
                setSelectedTransaction={setSelectedTransaction}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                pageSize={transactionsPerPage}
                onPageSizeChange={(value) => {
                    setTransactionsPerPage(Number(value));
                    setCurrentPage(1);
                }}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
}

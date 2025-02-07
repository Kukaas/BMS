"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
// import {
//     Pagination,
//     PaginationContent,
//     PaginationItem,
//     PaginationLink,
//     PaginationNext,
//     PaginationPrevious,
// } from "@/components/ui/pagination";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Search } from "lucide-react";
import { format } from "date-fns";
import { mockTransactions } from "../secretary/mockData";

export function TransactionHistoryDashboard() {
    const [transactions, setTransactions] = useState(mockTransactions);
    const [filteredTransactions, setFilteredTransactions] = useState(transactions);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [transactionsPerPage] = useState(10);
    const [filters, setFilters] = useState({
        dateRange: {
            from: undefined,
            to: undefined,
        },
        barangay: "",
        status: "",
        search: "",
    });

    const barangays = [...new Set(transactions.map((t) => t.barangay))];
    const statuses = [...new Set(transactions.map((t) => t.status))];

    useEffect(() => {
        let result = transactions;
        if (filters.dateRange.from && filters.dateRange.to) {
            result = result.filter(
                (t) =>
                    new Date(t.dateRequested) >= filters.dateRange.from &&
                    new Date(t.dateRequested) <= filters.dateRange.to
            );
        }
        if (filters.barangay) {
            result = result.filter((t) => t.barangay === filters.barangay);
        }
        if (filters.status) {
            result = result.filter((t) => t.status === filters.status);
        }
        if (filters.search) {
            result = result.filter(
                (t) =>
                    t.residentName.toLowerCase().includes(filters.search.toLowerCase()) ||
                    t.requestedDocument.toLowerCase().includes(filters.search.toLowerCase())
            );
        }
        setFilteredTransactions(result);
        setCurrentPage(1);
    }, [transactions, filters]);

    const indexOfLastTransaction = currentPage * transactionsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
    const currentTransactions = filteredTransactions.slice(
        indexOfFirstTransaction,
        indexOfLastTransaction
    );

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "completed":
                return "bg-green-100 text-green-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "rejected":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex-1 min-w-[200px]">
                        {/* <Label>Date Range</Label> */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id="date"
                                    variant={"outline"}
                                    className={`w-full justify-start text-left font-normal ${!filters.dateRange && "text-muted-foreground"}`}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {filters.dateRange?.from ? (
                                        filters.dateRange.to ? (
                                            <>
                                                {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                                                {format(filters.dateRange.to, "LLL dd, y")}
                                            </>
                                        ) : (
                                            format(filters.dateRange.from, "LLL dd, y")
                                        )
                                    ) : (
                                        <span>Pick a date range</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={filters.dateRange?.from}
                                    selected={filters.dateRange}
                                    onSelect={(range) =>
                                        setFilters((prev) => ({ ...prev, dateRange: range }))
                                    }
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        {/* <Label htmlFor="barangay">Barangay</Label> */}
                        <Select
                            onValueChange={(value) =>
                                setFilters((prev) => ({ ...prev, barangay: value }))
                            }
                        >
                            <SelectTrigger id="barangay">
                                <SelectValue placeholder="Select barangay" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Barangays</SelectItem>
                                {barangays.map((barangay) => (
                                    <SelectItem key={barangay} value={barangay}>
                                        {barangay}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        {/* <Label htmlFor="status">Status</Label> */}
                        <Select
                            onValueChange={(value) =>
                                setFilters((prev) => ({ ...prev, status: value }))
                            }
                        >
                            <SelectTrigger id="status">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                {statuses.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        {/* <Label htmlFor="search">Search</Label> */}
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="search"
                                placeholder="Search by name or document"
                                value={filters.search}
                                onChange={(e) =>
                                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                                }
                                className="pl-8"
                            />
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Resident Name</TableHead>
                            <TableHead>Document</TableHead>
                            <TableHead>Date Requested</TableHead>
                            <TableHead>Barangay</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentTransactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell>{transaction.residentName}</TableCell>
                                <TableCell>{transaction.requestedDocument}</TableCell>
                                <TableCell>
                                    {format(
                                        new Date(transaction.dateRequested),
                                        "yyyy-MM-dd HH:mm"
                                    )}
                                </TableCell>
                                <TableCell>{transaction.barangay}</TableCell>
                                <TableCell>
                                    <Badge className={getStatusColor(transaction.status)}>
                                        {transaction.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setSelectedTransaction(transaction)}
                                            >
                                                View Details
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>Transaction Details</DialogTitle>
                                            </DialogHeader>
                                            {selectedTransaction && (
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label className="text-right">
                                                            Resident
                                                        </Label>
                                                        <div className="col-span-3">
                                                            {selectedTransaction.residentName}
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label className="text-right">
                                                            Document
                                                        </Label>
                                                        <div className="col-span-3">
                                                            {selectedTransaction.requestedDocument}
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label className="text-right">
                                                            Date Requested
                                                        </Label>
                                                        <div className="col-span-3">
                                                            {format(
                                                                new Date(
                                                                    selectedTransaction.dateRequested
                                                                ),
                                                                "yyyy-MM-dd HH:mm"
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label className="text-right">
                                                            Date Approved
                                                        </Label>
                                                        <div className="col-span-3">
                                                            {selectedTransaction.dateApproved
                                                                ? format(
                                                                      new Date(
                                                                          selectedTransaction.dateApproved
                                                                      ),
                                                                      "yyyy-MM-dd HH:mm"
                                                                  )
                                                                : "Not yet approved"}
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label className="text-right">
                                                            Barangay
                                                        </Label>
                                                        <div className="col-span-3">
                                                            {selectedTransaction.barangay}
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label className="text-right">
                                                            Approved By
                                                        </Label>
                                                        <div className="col-span-3">
                                                            {selectedTransaction.approvedBy ||
                                                                "Not yet approved"}
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label className="text-right">Status</Label>
                                                        <div className="col-span-3">
                                                            <Badge
                                                                className={getStatusColor(
                                                                    selectedTransaction.status
                                                                )}
                                                            >
                                                                {selectedTransaction.status}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    {/* <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label className="text-right">
                                                            Payment Amount
                                                        </Label>
                                                        <div className="col-span-3">
                                                            ₱
                                                            {selectedTransaction.paymentAmount.toFixed(
                                                                2
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label className="text-right">
                                                            Payment Method
                                                        </Label>
                                                        <div className="col-span-3">
                                                            {selectedTransaction.paymentMethod}
                                                        </div>
                                                    </div> */}
                                                </div>
                                            )}
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/* <Pagination className="mt-4">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                            />
                        </PaginationItem>
                        {Array.from({
                            length: Math.ceil(filteredTransactions.length / transactionsPerPage),
                        }).map((_, index) => (
                            <PaginationItem key={index}>
                                <PaginationLink
                                    onClick={() => paginate(index + 1)}
                                    isActive={currentPage === index + 1}
                                >
                                    {index + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext
                                onClick={() => paginate(currentPage + 1)}
                                disabled={
                                    currentPage ===
                                    Math.ceil(filteredTransactions.length / transactionsPerPage)
                                }
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination> */}
            </CardContent>
        </Card>
    );
}

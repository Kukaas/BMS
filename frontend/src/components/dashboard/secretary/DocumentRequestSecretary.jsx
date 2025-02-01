"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function DocumentRequestSecretary() {
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const { currentUser } = useSelector((state) => state.user);
    const API_URL = import.meta.env.VITE_API_URL;

    // Add pagination and search states
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchRequests = async () => {
        try {
            const res = await axios.get(`${API_URL}/document-requests`, {
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                },
            });

            if (res.data.success) {
                setRequests(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching requests:", error);
            toast.error(
                error.response?.data?.message ||
                "Failed to fetch requests. Please check if the server is running."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser?.token) {
            fetchRequests();
        }
    }, [currentUser]);

    const handleStatusChange = async (requestId, requestType, newStatus) => {
        try {
            setUpdating(true);
            const typeSlug = requestType.toLowerCase().replace(/ /g, "-");

            console.log("Updating document:", {
                requestId,
                requestType,
                typeSlug,
                newStatus,
            });

            const res = await axios.patch(
                `${API_URL}/document-requests/${typeSlug}/${requestId}/status`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`,
                    },
                }
            );

            if (res.data.success) {
                setRequests((prevRequests) =>
                    prevRequests.map((request) =>
                        request.id === requestId ? { ...request, status: newStatus } : request
                    )
                );

                if (selectedRequest?.id === requestId) {
                    setSelectedRequest((prev) => ({
                        ...prev,
                        status: newStatus,
                    }));
                }

                toast.success("Status updated successfully");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error(
                error.response?.data?.message || "Failed to update status. Please try again."
            );
        } finally {
            setUpdating(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Pending":
                return "bg-yellow-500";
            case "Approved":
                return "bg-green-500";
            case "Completed":
                return "bg-blue-500";
            case "Rejected":
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    };

    const getDocumentDetails = (request) => {
        switch (request.type) {
            case "Barangay Clearance":
                return [
                    { label: "Name", value: request.residentName },
                    { label: "Purpose", value: request.purpose },
                    { label: "Email", value: request.email },
                    { label: "Contact Number", value: request.contactNumber },
                ];
            case "Certificate of Indigency":
                return [
                    { label: "Name", value: request.residentName },
                    { label: "Purpose", value: request.purpose },
                    { label: "Contact Number", value: request.contactNumber },
                ];
            case "Business Clearance":
                return [
                    { label: "Owner Name", value: request.residentName },
                    { label: "Business Name", value: request.businessName },
                    { label: "Business Type", value: request.businessType },
                    { label: "Business Nature", value: request.businessNature },
                    { label: "Owner Address", value: request.ownerAddress },
                    { label: "Contact Number", value: request.contactNumber },
                    { label: "Email", value: request.email },
                ];
            case "Cedula":
                return [
                    { label: "Name", value: request.residentName },
                    { label: "Date of Birth", value: request.dateOfBirth },
                    { label: "Place of Birth", value: request.placeOfBirth },
                    { label: "Civil Status", value: request.civilStatus },
                    { label: "Occupation", value: request.occupation },
                    { label: "Tax", value: request.tax ? `₱${request.tax.toFixed(2)}` : "N/A" },
                ];
            default:
                return [];
        }
    };

    // Add this function to determine available statuses
    const getAvailableStatuses = (currentStatus) => {
        switch (currentStatus) {
            case "Pending":
                return ["Pending", "Approved", "Rejected"];
            case "Approved":
                return ["Approved", "Completed"]; // Only allow Completed when Approved
            case "Completed":
                return []; // No status changes allowed
            case "Rejected":
                return []; // No status changes allowed
            default:
                return ["Pending", "Approved", "Completed", "Rejected"];
        }
    };

    // Filter requests based on search term
    const filteredRequests = requests.filter((request) =>
        Object.values(request).join(" ").toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate pagination
    const totalRequests = filteredRequests.length;
    const totalPages = Math.ceil(totalRequests / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentRequests = filteredRequests.slice(startIndex, endIndex);

    // Handle page size change
    const handlePageSizeChange = (value) => {
        setPageSize(Number(value));
        setCurrentPage(1); // Reset to first page when changing page size
    };

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading requests...</p>
                </div>
            </div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Document Requests</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Search and Page Size Controls */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Input
                                placeholder="Search requests..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-[300px]"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Select
                                value={pageSize.toString()}
                                onValueChange={handlePageSizeChange}
                            >
                                <SelectTrigger className="w-[80px]">
                                    <SelectValue placeholder={pageSize} />
                                </SelectTrigger>
                                <SelectContent>
                                    {[5, 10, 20, 30, 40, 50].map((size) => (
                                        <SelectItem key={size} value={size.toString()}>
                                            {size}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <span className="text-sm text-muted-foreground">per page</span>
                        </div>
                    </div>

                    {/* Table */}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Resident</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentRequests.map((request) => (
                                <TableRow key={request.id}>
                                    <TableCell>
                                        {request.requestDate
                                            ? new Date(request.requestDate).toLocaleDateString()
                                            : "N/A"}
                                    </TableCell>
                                    <TableCell>{request.type}</TableCell>
                                    <TableCell>{request.residentName}</TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(request.status)}>
                                            {request.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setSelectedRequest(request)}
                                                >
                                                    View Details
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Document Request Details</DialogTitle>
                                                </DialogHeader>
                                                {selectedRequest && (
                                                    <div className="grid gap-4">
                                                        <div className="space-y-4">
                                                            <div className="grid gap-2">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex flex-col gap-1">
                                                                        <p className="text-sm font-medium leading-none">
                                                                            Request Date
                                                                        </p>
                                                                        <p className="text-sm text-muted-foreground">
                                                                            {new Date(
                                                                                selectedRequest.requestDate
                                                                            ).toLocaleDateString()}
                                                                        </p>
                                                                    </div>
                                                                    <Badge
                                                                        className={getStatusColor(
                                                                            selectedRequest.status
                                                                        )}
                                                                    >
                                                                        {selectedRequest.status}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <div className="flex flex-col gap-1">
                                                                    <p className="text-sm font-medium leading-none">
                                                                        Document Type
                                                                    </p>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        {selectedRequest.type}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            {getDocumentDetails(selectedRequest).map(
                                                                (detail, index) => (
                                                                    <div
                                                                        key={index}
                                                                        className="grid gap-2"
                                                                    >
                                                                        <div className="flex flex-col gap-1">
                                                                            <p className="text-sm font-medium leading-none">
                                                                                {detail.label}
                                                                            </p>
                                                                            <p className="text-sm text-muted-foreground">
                                                                                {detail.value || "N/A"}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>

                                                        <div className="grid gap-2">
                                                            <div className="flex flex-col gap-1">
                                                                <p className="text-sm font-medium leading-none">
                                                                    Update Status
                                                                </p>
                                                                <Select
                                                                    onValueChange={(value) =>
                                                                        handleStatusChange(
                                                                            selectedRequest.id,
                                                                            selectedRequest.type,
                                                                            value
                                                                        )
                                                                    }
                                                                    defaultValue={
                                                                        selectedRequest.status
                                                                    }
                                                                    disabled={
                                                                        updating ||
                                                                        selectedRequest.status ===
                                                                        "Completed" ||
                                                                        selectedRequest.status ===
                                                                        "Rejected"
                                                                    }
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue>
                                                                            {selectedRequest.status}
                                                                        </SelectValue>
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {getAvailableStatuses(
                                                                            selectedRequest.status
                                                                        ).map((status) => (
                                                                            <SelectItem
                                                                                key={status}
                                                                                value={status}
                                                                                className={
                                                                                    status ===
                                                                                        "Rejected"
                                                                                        ? "text-destructive"
                                                                                        : status ===
                                                                                            "Completed"
                                                                                            ? "text-primary"
                                                                                            : status ===
                                                                                                "Approved"
                                                                                                ? "text-green-500"
                                                                                                : ""
                                                                                }
                                                                            >
                                                                                {status}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pagination Controls */}
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            {searchTerm
                                ? `${filteredRequests.length} results found`
                                : `Total Requests: ${totalRequests}`}
                        </p>
                        <div className="flex items-center space-x-6 lg:space-x-8">
                            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                                Page {currentPage} of {totalPages}
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

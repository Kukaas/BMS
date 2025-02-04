import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useSelector } from "react-redux";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Loader2, Search } from "lucide-react";
import { DocumentTableView } from "./components/DocumentTableView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DocumentRequestSecretary() {
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const { currentUser } = useSelector((state) => state.user);

    // Add pagination and search states
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("all");

    const fetchRequests = async () => {
        try {
            const res = await api.get("/document-requests", {
                params: {
                    page: currentPage,
                    limit: pageSize,
                },
            });

            if (res.data.success) {
                // Transform the data to match the component's expected format
                const transformedRequests = res.data.data.map((request) => ({
                    id: request._id,
                    requestDate: request.createdAt,
                    type: request.documentType,
                    residentName: request.name || request.ownerName,
                    status: request.status,
                    purpose: request.purpose,
                    email: request.email,
                    contactNumber: request.contactNumber,
                    // Business clearance specific fields
                    businessName: request.businessName,
                    businessType: request.businessType,
                    businessNature: request.businessNature,
                    ownerAddress: request.ownerAddress,
                    // Cedula specific fields
                    dateOfBirth: request.dateOfBirth,
                    placeOfBirth: request.placeOfBirth,
                    civilStatus: request.civilStatus,
                    occupation: request.occupation,
                    tax: request.tax,
                }));

                setRequests(transformedRequests);
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
        if (currentUser) {
            fetchRequests();
        }
    }, [currentUser, currentPage, pageSize]); // Add pagination dependencies

    const handleStatusChange = async (requestId, requestType, newStatus) => {
        try {
            setUpdating(true);
            // Convert document type to route format
            const typeSlug = requestType.toLowerCase().replace(/\s+/g, "-");

            const res = await api.patch(`/document-requests/${typeSlug}/${requestId}/status`, {
                status: newStatus,
            });

            if (res.data.success) {
                // Refresh the requests after status update
                await fetchRequests();
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

    // Update the filteredRequests logic to include type filtering
    const filteredRequests = requests.filter((request) => {
        const matchesSearch = Object.values(request)
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesType = selectedType === "all" || request.type === selectedType;
        return matchesSearch && matchesType;
    });

    // Update the documentTypes constant
    const documentTypes = [
        "all",
        "Barangay Clearance",
        "Barangay Indigency",
        "Business Clearance",
        "Cedula",
    ];

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
            <Card>
                <CardContent className="flex items-center justify-center py-8">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Loading requests...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Document Requests</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Search, Filter, and Page Size Controls */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search requests..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-8"
                                />
                            </div>
                            <Select value={selectedType} onValueChange={setSelectedType}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Filter by type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {documentTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type === "all" ? "All Types" : type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                            <SelectTrigger className="w-[130px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[5, 10, 20, 30, 40, 50].map((size) => (
                                    <SelectItem key={size} value={size.toString()}>
                                        {size} per page
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Table View */}
                    <DocumentTableView
                        currentRequests={currentRequests}
                        setSelectedRequest={setSelectedRequest}
                        selectedRequest={selectedRequest}
                        getStatusColor={getStatusColor}
                        handleStatusChange={handleStatusChange}
                        updating={updating}
                        getAvailableStatuses={getAvailableStatuses}
                    />

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

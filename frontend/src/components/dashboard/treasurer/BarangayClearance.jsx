import { useState, useEffect, useRef } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { STATUS_TYPES } from "@/lib/constants";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import ClearanceDetailsView from "./components/ClearanceDetailsView";

export default function BarangayClearance() {
    const [clearanceRequests, setClearanceRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const { currentUser } = useSelector((state) => state.user);

    // Add pagination and search states
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");

    // OR Number state for approval
    const [orNumber, setOrNumber] = useState("");
    const [showORDialog, setShowORDialog] = useState(false);
    const [requestToApprove, setRequestToApprove] = useState(null);

    // Barangay chairman state
    const [barangayChairman, setBarangayChairman] = useState(null);

    const fetchClearanceRequests = async () => {
        try {
            setLoading(true);

            console.log("Fetching barangay clearance requests...");

            // Specifically request only Barangay Clearance type documents
            const res = await api.get("/document-requests", {
                params: {
                    type: "Barangay Clearance",
                    page: currentPage,
                    limit: pageSize,
                },
            });

            if (res.data.success) {
                console.log("Raw response data:", res.data.data);

                const transformedRequests = res.data.data
                    // Add an additional filter to ensure only Barangay Clearance documents are processed
                    .filter((request) => request.type === "Barangay Clearance")
                    .map((request) => {
                        // Ensure name is properly set
                        const name =
                            request.name ||
                            request.ownerName ||
                            (request.user
                                ? `${request.user.firstName} ${request.user.middleName ? request.user.middleName + " " : ""}${request.user.lastName}`
                                : "N/A");

                        // Process receipt data correctly
                        let receipt = null;
                        if (request.receipt) {
                            receipt = {
                                filename: request.receipt.filename || "receipt.jpg",
                                contentType: request.receipt.contentType || "image/jpeg",
                                data: request.receipt.data || null,
                            };
                        }

                        // Log the request to check if orNumber and receipt are present
                        console.log(`Processing request ${request._id}:`, {
                            id: request._id,
                            name,
                            status: request.status,
                            orNumber: request.orNumber,
                            hasReceipt: !!receipt,
                        });

                        return {
                            id: request._id.toString(),
                            _id: request._id.toString(),
                            requestDate: request.createdAt,
                            type: request.type || "Barangay Clearance",
                            name: name,
                            residentName: name,
                            status: request.status,
                            purpose: request.purpose,
                            age: request.age,
                            civilStatus: request.civilStatus,
                            placeOfBirth: request.placeOfBirth,

                            // Basic Information
                            email: request.email,
                            contactNumber: request.contactNumber,
                            // Address Information
                            barangay: request.barangay,
                            municipality: request.municipality,
                            province: request.province,
                            purok: request.purok,
                            // Payment Details
                            paymentMethod: request.paymentMethod,
                            amount: request.amount,
                            dateOfPayment: request.dateOfPayment,
                            referenceNumber: request.referenceNumber,
                            // Explicitly include orNumber and ensure it's not undefined
                            orNumber: request.orNumber || null,
                            treasurerName: request.treasurerName || null,
                            // Receipt data with proper handling
                            receipt: receipt,
                        };
                    });

                console.log("Transformed requests:", transformedRequests);
                setClearanceRequests(transformedRequests);
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
            fetchClearanceRequests();
        }
    }, [currentUser, currentPage, pageSize]);

    // Fetch the chairman's information
    useEffect(() => {
        const fetchChairman = async () => {
            try {
                const response = await api.get("/users/chairman/current");
                if (response.data.success) {
                    setBarangayChairman(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching chairman:", error);
                toast.error("Failed to fetch barangay chairman information");
            }
        };

        fetchChairman();
    }, []);

    // Function to normalize status values
    const normalizeStatus = (status) => {
        const statusMap = {
            pending: STATUS_TYPES.PENDING,
            approved: STATUS_TYPES.APPROVED,
            "for pickup": STATUS_TYPES.FOR_PICKUP,
            completed: STATUS_TYPES.COMPLETED,
            rejected: STATUS_TYPES.REJECTED,
        };
        return statusMap[status.toLowerCase()] || status;
    };

    const handleApproveWithOR = async () => {
        if (!requestToApprove || !orNumber.trim()) {
            toast.error("OR Number is required");
            return;
        }

        try {
            setUpdating(true);

            console.log("Sending approval request with OR number:", {
                requestId: requestToApprove.id,
                orNumber: orNumber.trim(),
                treasurerName: currentUser.name,
            });

            // Make sure we're using the correct endpoint format
            const res = await api.patch(`/barangay-clearance/${requestToApprove.id}/status`, {
                status: STATUS_TYPES.APPROVED,
                treasurerName: currentUser.name,
                orNumber: orNumber.trim(),
            });

            if (res.data.success) {
                toast.success("Clearance approved and OR number added successfully");

                // Force refresh with up-to-date data
                await fetchClearanceRequests();

                // Log the updated data from response
                console.log("Updated clearance data:", res.data.data);

                setShowORDialog(false);
                setOrNumber("");
                setRequestToApprove(null);
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

    const handleStatusChange = async (request, newStatus) => {
        // Only allow approval and rejection actions for treasurer
        if (![STATUS_TYPES.APPROVED, STATUS_TYPES.REJECTED].includes(newStatus)) {
            toast.error("As a treasurer, you can only approve or reject pending requests.");
            return;
        }

        // For approval, we need to collect OR number
        if (newStatus === STATUS_TYPES.APPROVED) {
            setRequestToApprove(request);
            setShowORDialog(true);
            return;
        }

        try {
            setUpdating(true);

            console.log("Sending status update:", {
                requestId: request.id,
                status: normalizeStatus(newStatus),
            });

            // Use the correct API endpoint format
            const res = await api.patch(`/barangay-clearance/${request.id}/status`, {
                status: normalizeStatus(newStatus),
                treasurerName: currentUser.name,
            });

            if (res.data.success) {
                await fetchClearanceRequests();
                toast.success(`Request ${newStatus.toLowerCase()} successfully`);
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
            case STATUS_TYPES.PENDING:
                return "bg-yellow-500";
            case STATUS_TYPES.APPROVED:
                return "bg-green-500";
            case STATUS_TYPES.FOR_PICKUP:
                return "bg-purple-500";
            case STATUS_TYPES.COMPLETED:
                return "bg-blue-500";
            case STATUS_TYPES.REJECTED:
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    };

    // Update this function to only allow treasurer to perform approval and rejection actions
    const getAvailableStatuses = (currentStatus) => {
        const normalizedStatus = normalizeStatus(currentStatus);

        // For treasurer role, only allow approval and rejection of pending requests
        // Once a request is approved or rejected, the treasurer should no longer be able to change the status
        if (normalizedStatus === STATUS_TYPES.PENDING) {
            return [STATUS_TYPES.APPROVED, STATUS_TYPES.REJECTED];
        }

        // For non-pending statuses, don't allow any further status changes by treasurer
        return [];
    };

    // Filter clearance requests by search term and status
    const filteredRequests = clearanceRequests.filter((request) => {
        const matchesSearch = Object.values(request)
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesStatus = selectedStatus === "all" || request.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    // Calculate pagination
    const totalRequests = filteredRequests.length;
    const totalPages = Math.ceil(totalRequests / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentRequests = filteredRequests.slice(startIndex, endIndex);

    // Handle page size change
    const handlePageSizeChange = (value) => {
        setPageSize(Number(value));
        setCurrentPage(1);
    };

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Format date for display
    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
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
                <CardTitle>Barangay Clearance Requests</CardTitle>
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
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger className="w-[200px] text-left">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    {Object.values(STATUS_TYPES).map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {status}
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

                    {/* Table View with enhanced OR Number display */}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Resident</TableHead>
                                <TableHead>Purpose</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>OR Number</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentRequests.map((request) => {
                                // Debug log for each request in the table
                                console.log(`Rendering request ${request.id}:`, {
                                    id: request.id,
                                    orNumber: request.orNumber,
                                    status: request.status,
                                });

                                return (
                                    <TableRow key={request.id || request._id}>
                                        <TableCell>
                                            {formatDate(request.requestDate || request.createdAt)}
                                        </TableCell>
                                        <TableCell>
                                            {request.name || request.residentName || "N/A"}
                                        </TableCell>
                                        <TableCell>{request.purpose}</TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(request.status)}>
                                                {request.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {request.orNumber ? (
                                                <span className="font-medium text-green-600">
                                                    {request.orNumber}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground italic">
                                                    Not assigned
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                setSelectedRequest(request)
                                                            }
                                                        >
                                                            View Details
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-3xl">
                                                        <DialogHeader>
                                                            <DialogTitle className="flex justify-between items-start">
                                                                <div>
                                                                    Barangay Clearance Request
                                                                    <span className="block text-sm font-normal text-muted-foreground mt-1">
                                                                        Requested on{" "}
                                                                        {formatDate(
                                                                            request.requestDate ||
                                                                                request.createdAt
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                {request.orNumber && (
                                                                    <div className="bg-green-50 border border-green-200 rounded-md px-3 py-1">
                                                                        <span className="text-sm text-green-600 font-semibold">
                                                                            OR Number:{" "}
                                                                            {request.orNumber}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </DialogTitle>
                                                        </DialogHeader>

                                                        {/* Use the new improved details view component */}
                                                        <ClearanceDetailsView
                                                            request={request}
                                                            handleStatusChange={handleStatusChange}
                                                            updating={updating}
                                                            getAvailableStatuses={
                                                                getAvailableStatuses
                                                            }
                                                        />
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>

                    {/* Pagination Controls */}
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            {searchTerm
                                ? `${filteredRequests.length} results found`
                                : `${totalRequests} requests in total`}
                        </p>
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>
                            <p className="text-sm text-muted-foreground">
                                Page {currentPage} of {totalPages || 1}
                            </p>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages || totalPages === 0}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>

            {/* OR Number Dialog */}
            <Dialog open={showORDialog} onOpenChange={setShowORDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Provide OR Number</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="orNumber">Official Receipt Number</Label>
                            <Input
                                id="orNumber"
                                placeholder="Enter OR Number"
                                value={orNumber}
                                onChange={(e) => setOrNumber(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowORDialog(false);
                                setRequestToApprove(null);
                                setOrNumber("");
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleApproveWithOR}
                            disabled={updating || !orNumber.trim()}
                        >
                            {updating ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Processing...
                                </>
                            ) : (
                                "Approve with OR"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}

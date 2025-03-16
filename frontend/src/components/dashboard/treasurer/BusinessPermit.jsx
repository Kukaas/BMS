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
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import BusinessPermitDetailsView from "./components/BusinessPermitDetailsView";

export default function BusinessPermit() {
    const [permitRequests, setPermitRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const { currentUser } = useSelector((state) => state.user);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");

    const [orNumber, setOrNumber] = useState("");
    const [showORDialog, setShowORDialog] = useState(false);
    const [requestToApprove, setRequestToApprove] = useState(null);

    const fetchPermitRequests = async () => {
        try {
            setLoading(true);
            console.log("Fetching business clearance requests...");

            const res = await api.get("/document-requests", {
                params: {
                    type: "Business Clearance", // Changed because controller uses "Business Clearance"
                    page: currentPage,
                    limit: pageSize,
                },
            });

            if (res.data.success) {
                console.log("Raw response data:", res.data.data);

                const transformedRequests = res.data.data
                    .filter((request) => request.type === "Business Clearance")
                    .map((request) => ({
                        id: request._id,
                        _id: request._id,
                        requestDate: request.createdAt,
                        type: request.type,
                        // Business Information
                        businessName: request.businessName,
                        businessType: request.businessType,
                        businessNature: request.businessNature,
                        businessLocation: request.businessLocation,
                        operatorManager: request.operatorManager,
                        // Owner Information
                        ownerName: request.ownerName,
                        email: request.email,
                        contactNumber: request.contactNumber,
                        // Location
                        barangay: request.barangay,
                        municipality: request.municipality,
                        province: request.province,
                        // Purpose
                        purpose: request.purpose,
                        // Documents
                        dtiSecRegistration: request.dtiSecRegistration,
                        barangayClearance: request.barangayClearance,
                        validId: request.validId,
                        mayorsPermit: request.mayorsPermit,
                        leaseContract: request.leaseContract,
                        fireSafetyCertificate: request.fireSafetyCertificate,
                        sanitaryPermit: request.sanitaryPermit,
                        // Payment information
                        amount: request.amount || 0,
                        paymentMethod: request.paymentMethod || "N/A",
                        referenceNumber: request.referenceNumber || "N/A",
                        dateOfPayment: request.dateOfPayment,
                        receipt: request.receipt,
                        orNumber: request.orNumber,
                        treasurerName: request.treasurerName,
                        // Status information
                        status: request.status,
                        isVerified: request.isVerified,
                        dateApproved: request.dateApproved,
                        dateCompleted: request.dateCompleted,
                        dateOfIssuance: request.dateOfIssuance,
                    }));

                console.log("Transformed business requests:", transformedRequests);
                setPermitRequests(transformedRequests);
            }
        } catch (error) {
            console.error("Error fetching requests:", error);
            toast.error("Failed to fetch business clearance requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) {
            fetchPermitRequests();
        }
    }, [currentUser, currentPage, pageSize]);

    const handleApproveWithOR = async () => {
        if (!requestToApprove || !orNumber.trim()) {
            toast.error("OR Number is required");
            return;
        }

        try {
            setUpdating(true);
            const res = await api.patch(
                `/document-requests/business-clearance/${requestToApprove.id}/status`,
                {
                    status: STATUS_TYPES.APPROVED,
                    treasurerName: currentUser.name,
                    orNumber: orNumber.trim(),
                }
            );

            if (res.data.success) {
                toast.success("Business permit approved and OR number added successfully");
                await fetchPermitRequests();
                setShowORDialog(false);
                setOrNumber("");
                setRequestToApprove(null);
            }
        } catch (error) {
            console.error("Error updating status:", error);
            const errorMessage = error.response?.data?.message || "Failed to update status";
            toast.error(errorMessage);
        } finally {
            setUpdating(false);
        }
    };

    const handleStatusChange = async (request, newStatus) => {
        if (!["Approved", "Rejected"].includes(newStatus)) {
            toast.error("As a treasurer, you can only approve or reject pending requests.");
            return;
        }

        // If approving, show OR number dialog
        if (newStatus === STATUS_TYPES.APPROVED) {
            setRequestToApprove(request);
            setShowORDialog(true);
            return;
        }

        try {
            setUpdating(true);
            const res = await api.patch(
                `/document-requests/business-clearance/${request.id}/status`,
                {
                    status: newStatus,
                    treasurerName: currentUser.name,
                }
            );

            if (res.data.success) {
                await fetchPermitRequests();
                toast.success(`Request ${newStatus.toLowerCase()} successfully`);
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error(error.response?.data?.message || "Failed to update status");
        } finally {
            setUpdating(false);
        }
    };

    // Status helpers
    const getStatusColor = (status) => {
        const statusColors = {
            [STATUS_TYPES.PENDING]: "bg-yellow-500",
            [STATUS_TYPES.APPROVED]: "bg-green-500",
            [STATUS_TYPES.FOR_PICKUP]: "bg-purple-500",
            [STATUS_TYPES.COMPLETED]: "bg-blue-500",
            [STATUS_TYPES.REJECTED]: "bg-red-500",
        };
        return statusColors[status] || "bg-gray-500";
    };

    const getAvailableStatuses = (currentStatus) => {
        return currentStatus === STATUS_TYPES.PENDING
            ? [STATUS_TYPES.APPROVED, STATUS_TYPES.REJECTED]
            : [];
    };

    // Filter and pagination
    const filteredRequests = permitRequests.filter((request) => {
        const matchesSearch = Object.values(request)
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === "all" || request.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const totalRequests = filteredRequests.length;
    const totalPages = Math.ceil(totalRequests / pageSize);
    const currentRequests = filteredRequests.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    // Format date helper
    const formatDate = (dateStr) => {
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
                <CardTitle>Business Clearance Requests</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Search and Filters */}
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
                                <SelectTrigger className="w-[200px]">
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
                        <Select
                            value={pageSize.toString()}
                            onValueChange={(v) => setPageSize(Number(v))}
                        >
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

                    {/* Table */}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Business Name</TableHead>
                                <TableHead>Owner</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Payment Method</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>OR Number</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentRequests.map((request) => (
                                <TableRow key={request.id}>
                                    <TableCell>{formatDate(request.requestDate)}</TableCell>
                                    <TableCell>{request.businessName}</TableCell>
                                    <TableCell>{request.ownerName}</TableCell>
                                    <TableCell>₱{request.amount?.toFixed(2)}</TableCell>
                                    <TableCell>{request.paymentMethod}</TableCell>
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
                                            <DialogContent className="max-w-3xl">
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        <div className="flex justify-between items-center">
                                                            <span>Business Clearance Details</span>
                                                            <div className="flex items-center gap-4">
                                                                {request.amount && (
                                                                    <Badge variant="outline">
                                                                        Amount: ₱
                                                                        {request.amount.toFixed(2)}
                                                                    </Badge>
                                                                )}
                                                                {request.orNumber && (
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="bg-green-50"
                                                                    >
                                                                        OR: {request.orNumber}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </DialogTitle>
                                                </DialogHeader>
                                                <BusinessPermitDetailsView
                                                    request={request}
                                                    handleStatusChange={handleStatusChange}
                                                    updating={updating}
                                                    getAvailableStatuses={getAvailableStatuses}
                                                />
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            {totalRequests} requests total
                        </p>
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>
                            <p className="text-sm text-muted-foreground">
                                Page {currentPage} of {totalPages || 1}
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => setCurrentPage(currentPage + 1)}
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

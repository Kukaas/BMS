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

import BlotterReportDetailsView from "./components/BlotterReportDetailsView";

export default function BlotterReport() {
    const [blotterReports, setBlotterReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const { currentUser } = useSelector((state) => state.user);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");

    const [orNumber, setOrNumber] = useState("");
    const [showORDialog, setShowORDialog] = useState(false);
    const [reportToApprove, setReportToApprove] = useState(null);

    const fetchBlotterReports = async () => {
        try {
            setLoading(true);
            const response = await api.get("/blotter/barangay");
            setBlotterReports(response.data);
        } catch (error) {
            console.error("Error fetching blotter reports:", error);
            toast.error("Failed to fetch blotter reports");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) {
            fetchBlotterReports();
        }
    }, [currentUser, currentPage, pageSize]);

    const handleApproveWithOR = async () => {
        if (!reportToApprove || !orNumber.trim()) {
            toast.error("OR Number is required");
            return;
        }

        try {
            setUpdating(true);
            const res = await api.put(`/blotter/${reportToApprove._id}`, {
                status: STATUS_TYPES.UNDER_INVESTIGATION,
                orNumber: orNumber.trim(),
                treasurerName: currentUser.name,
            });

            if (res.data) {
                toast.success("Blotter report updated and OR number added successfully");
                await fetchBlotterReports();
                setShowORDialog(false);
                setOrNumber("");
                setReportToApprove(null);
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error(error.response?.data?.message || "Failed to update status");
        } finally {
            setUpdating(false);
        }
    };

    const handleStatusChange = async (report, newStatus, orNumber = null) => {
        if (!report || !newStatus) {
            toast.error("Invalid report or status");
            return;
        }

        try {
            setUpdating(true);
            const res = await api.put(`/blotter/${report._id}`, {
                status: newStatus,
                treasurerName: currentUser.name,
                ...(orNumber && { orNumber }),
            });

            if (res.data) {
                toast.success(`Report status updated to ${newStatus} successfully`);
                await fetchBlotterReports();
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error(error.response?.data?.message || "Failed to update status");
        } finally {
            setUpdating(false);
        }
    };

    const getStatusColor = (status) => {
        const statusColors = {
            [STATUS_TYPES.PENDING]: "bg-yellow-500",
            [STATUS_TYPES.UNDER_INVESTIGATION]: "bg-blue-500",
            [STATUS_TYPES.RESOLVED]: "bg-green-500",
            [STATUS_TYPES.CLOSED]: "bg-gray-500",
        };
        return statusColors[status] || "bg-gray-500";
    };

    const getAvailableStatuses = (currentStatus) => {
        return currentStatus === STATUS_TYPES.PENDING ? [STATUS_TYPES.UNDER_INVESTIGATION] : [];
    };

    const filteredReports = blotterReports.filter((report) => {
        const matchesSearch = Object.values(report)
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === "all" || report.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const totalReports = filteredReports.length;
    const totalPages = Math.ceil(totalReports / pageSize);
    const currentReports = filteredReports.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

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
                        <p className="text-sm text-muted-foreground">Loading reports...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Blotter Reports</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Search and Filters */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search reports..."
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
                                <TableHead>Complainant</TableHead>
                                <TableHead>Respondent</TableHead>
                                <TableHead>Incident Type</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>OR Number</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentReports.map((report) => (
                                <TableRow key={report._id}>
                                    <TableCell>{formatDate(report.createdAt)}</TableCell>
                                    <TableCell>{report.complainantName}</TableCell>
                                    <TableCell>{report.respondentName}</TableCell>
                                    <TableCell>{report.incidentType}</TableCell>
                                    <TableCell>₱{report.amount?.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(report.status)}>
                                            {report.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {report.orNumber ? (
                                            <span className="font-medium text-green-600">
                                                {report.orNumber}
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
                                                    onClick={() => setSelectedReport(report)}
                                                >
                                                    View Details
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-3xl">
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        <div className="flex justify-between items-center">
                                                            <span>Blotter Report Details</span>
                                                            <div className="flex items-center gap-4">
                                                                <Badge variant="outline">
                                                                    Amount: ₱
                                                                    {report.amount.toFixed(2)}
                                                                </Badge>
                                                                {report.orNumber && (
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="bg-green-50"
                                                                    >
                                                                        OR: {report.orNumber}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </DialogTitle>
                                                </DialogHeader>
                                                <BlotterReportDetailsView
                                                    report={report}
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
                            {totalReports} reports total
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
                                setReportToApprove(null);
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

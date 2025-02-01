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
import { Loader2, Image as ImageIcon, MapPin, Calendar, Clock, User, Phone } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

export function IncidentReportsSecretary() {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const { currentUser } = useSelector((state) => state.user);
    const [imageLoading, setImageLoading] = useState(false);
    const [imageLoadError, setImageLoadError] = useState({});

    // Add pagination and search states
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch reports on component mount
    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            if (!currentUser?.barangay) {
                toast.error("Barangay information not found");
                return;
            }

            const res = await axios.get("http://localhost:5000/api/incident-report", {
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                },
            });

            if (res.data.success) {
                // Double check to ensure we only show reports from secretary's barangay
                const filteredReports = res.data.data.filter(
                    (report) => report.barangay === currentUser.barangay
                );
                setReports(filteredReports);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch reports");
        } finally {
            setLoading(false);
        }
    };

    // Add barangay to dependency array to refetch if it changes
    useEffect(() => {
        if (currentUser?.barangay) {
            fetchReports();
        }
    }, [currentUser?.barangay]);

    const handleStatusChange = async (reportId, newStatus) => {
        try {
            setUpdating(true);
            const res = await axios.patch(
                `http://localhost:5000/api/incident-report/${reportId}/status`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`,
                    },
                }
            );

            if (res.data.success) {
                toast.success("Status updated successfully");
                // Update local state
                setReports(
                    reports.map((report) =>
                        report._id === reportId ? { ...report, status: newStatus } : report
                    )
                );
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update status");
        } finally {
            setUpdating(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "New":
                return "bg-blue-500";
            case "In Progress":
                return "bg-yellow-500";
            case "Resolved":
                return "bg-green-500";
            default:
                return "bg-gray-500";
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handleImageError = (index) => {
        setImageLoadError((prev) => ({ ...prev, [index]: true }));
        return "https://placehold.co/400x400?text=Failed+to+load+image";
    };

    // Filter reports based on search term
    const filteredReports = reports.filter((report) =>
        Object.values(report).join(" ").toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate pagination
    const totalReports = filteredReports.length;
    const totalPages = Math.ceil(totalReports / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentReports = filteredReports.slice(startIndex, endIndex);

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
                    <p className="text-sm text-muted-foreground">Loading reports...</p>
                </div>
            </div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Incident Reports</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Search and Page Size Controls */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Input
                                placeholder="Search reports..."
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
                                <TableHead>Category</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentReports.map((report) => (
                                <TableRow key={report._id}>
                                    <TableCell>{report.date}</TableCell>
                                    <TableCell>{report.category}</TableCell>
                                    <TableCell>{report.location}</TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(report.status)}>
                                            {report.status}
                                        </Badge>
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
                                            {selectedReport && (
                                                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                                                    <DialogHeader className="border-b pb-4">
                                                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                                                            <Badge
                                                                className={`${getStatusColor(
                                                                    selectedReport.status
                                                                )} px-4 py-1`}
                                                            >
                                                                {selectedReport.status}
                                                            </Badge>
                                                            <span>Incident Report Details</span>
                                                        </DialogTitle>
                                                        <p className="text-sm text-muted-foreground mt-2">
                                                            Reported on{" "}
                                                            {formatDate(selectedReport.date)} at{" "}
                                                            {selectedReport.time}
                                                        </p>
                                                    </DialogHeader>
                                                    <div className="space-y-8 py-4">
                                                        {/* Category Section */}
                                                        <div className="grid grid-cols-2 gap-6">
                                                            <div className="space-y-2">
                                                                <h3 className="text-sm font-medium text-muted-foreground">
                                                                    Category
                                                                </h3>
                                                                <p className="text-lg font-medium">
                                                                    {selectedReport.category}
                                                                </p>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <h3 className="text-sm font-medium text-muted-foreground">
                                                                    Sub-category
                                                                </h3>
                                                                <p className="text-lg font-medium">
                                                                    {selectedReport.subCategory}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Location */}
                                                        <div className="space-y-2">
                                                            <h3 className="text-sm font-medium text-muted-foreground">
                                                                Location
                                                            </h3>
                                                            <div className="flex items-center gap-2 bg-muted p-3 rounded-lg">
                                                                <MapPin className="h-5 w-5 text-primary" />
                                                                <p className="text-lg">
                                                                    {selectedReport.location}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Description */}
                                                        <div className="space-y-2">
                                                            <h3 className="text-sm font-medium text-muted-foreground">
                                                                Description
                                                            </h3>
                                                            <div className="bg-muted p-4 rounded-lg">
                                                                <p className="text-lg leading-relaxed whitespace-pre-wrap">
                                                                    {selectedReport.description}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Reporter Information */}
                                                        <div className="space-y-3">
                                                            <h3 className="text-sm font-medium text-muted-foreground">
                                                                Reporter Information
                                                            </h3>
                                                            <div className="grid grid-cols-2 gap-4 bg-muted p-4 rounded-lg">
                                                                <div className="space-y-1">
                                                                    <div className="flex items-center gap-2">
                                                                        <User className="h-4 w-4 text-primary" />
                                                                        <span className="text-sm text-muted-foreground">
                                                                            Name
                                                                        </span>
                                                                    </div>
                                                                    <p className="font-medium">
                                                                        {
                                                                            selectedReport.reporterName
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <div className="flex items-center gap-2">
                                                                        <Phone className="h-4 w-4 text-primary" />
                                                                        <span className="text-sm text-muted-foreground">
                                                                            Contact
                                                                        </span>
                                                                    </div>
                                                                    <p className="font-medium">
                                                                        {
                                                                            selectedReport.reporterContact
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Status Update */}
                                                        <div className="border-t pt-4">
                                                            <div className="flex items-center justify-between">
                                                                <h3 className="text-sm font-medium text-muted-foreground">
                                                                    Update Status
                                                                </h3>
                                                                <Select
                                                                    onValueChange={(value) =>
                                                                        handleStatusChange(
                                                                            selectedReport._id,
                                                                            value
                                                                        )
                                                                    }
                                                                    defaultValue={
                                                                        selectedReport.status
                                                                    }
                                                                    disabled={updating}
                                                                >
                                                                    <SelectTrigger className="w-[180px]">
                                                                        <SelectValue placeholder="Change status" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="New">
                                                                            New
                                                                        </SelectItem>
                                                                        <SelectItem value="In Progress">
                                                                            In Progress
                                                                        </SelectItem>
                                                                        <SelectItem value="Resolved">
                                                                            Resolved
                                                                        </SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            )}
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
                                ? `${filteredReports.length} results found`
                                : `Total Reports: ${totalReports}`}
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

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import api from "@/lib/axios";
import { Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { IncidentTableView } from "./components/IncidentTableView";
import { IncidentReportGrid } from "./components/IncidentReportGrid";

// Add formatDate function
const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

export function IncidentReportsSecretary() {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const { currentUser } = useSelector((state) => state.user);

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

            const res = await api.get("incident-report", {
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
            const res = await api.patch(
                `incident-report/${reportId}/status`,
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

    // Add download handler
    const handleDownload = (evidenceFile) => {
        try {
            let base64Data;
            if (evidenceFile.data.startsWith("data:")) {
                base64Data = evidenceFile.data.split(",")[1];
            } else {
                base64Data = evidenceFile.data;
            }

            const byteString = atob(base64Data);
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);

            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            const blob = new Blob([ab], { type: evidenceFile.contentType });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = evidenceFile.filename;
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download error:", error);
            toast.error("Failed to download file");
        }
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
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Incident Reports</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Search and Page Size Controls */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="relative w-full">
                                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                <Input
                                    placeholder="Search reports..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-[300px] pl-8"
                                />
                            </div>
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

                    {/* Grid View (Mobile) */}
                    <IncidentReportGrid
                        incidents={currentReports}
                        setSelectedIncident={setSelectedReport}
                        selectedIncident={selectedReport}
                        getStatusColor={getStatusColor}
                        handleStatusChange={handleStatusChange}
                        updating={updating}
                        handleDownload={handleDownload}
                        formatDate={formatDate}
                    />

                    {/* Table View (Desktop) */}
                    <IncidentTableView
                        currentReports={currentReports}
                        setSelectedReport={setSelectedReport}
                        selectedReport={selectedReport}
                        getStatusColor={getStatusColor}
                        handleStatusChange={handleStatusChange}
                        updating={updating}
                        handleDownload={handleDownload}
                        formatDate={formatDate}
                    />

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

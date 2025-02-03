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
import api from "@/lib/axios";
import { toast } from "sonner";
import { Loader2, Search, User, Phone, MapPin, FileText, Eye, Download } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Add formatDate function at the top
const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

export function SecretaryBlotterDashboard() {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const { currentUser } = useSelector((state) => state.user);

    // Add pagination and search states
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchReports = async () => {
        try {
            const res = await api.get("/blotter/barangay");
            console.log("Raw API response:", res.data); // Debug log

            if (res.data) {
                const transformedReports = res.data.map((report) => ({
                    id: report._id,
                    complainantName: report.complainantName,
                    complainantAge: report.complainantAge,
                    complainantGender: report.complainantGender,
                    complainantCivilStatus: report.complainantCivilStatus,
                    complainantContact: report.complainantContact,
                    complainantAddress: report.complainantAddress,
                    respondentName: report.respondentName,
                    respondentContact: report.respondentContact,
                    respondentAddress: report.respondentAddress,
                    incidentDate: report.incidentDate,
                    incidentTime: report.incidentTime,
                    incidentLocation: report.incidentLocation,
                    incidentType: report.incidentType,
                    status: report.status,
                    narrative: report.narrative,
                    motive: report.motive,
                    actionRequested: report.actionRequested,
                    witnessName: report.witnessName,
                    witnessContact: report.witnessContact,
                    evidenceFile: report.evidenceFile,
                }));

                console.log("Transformed reports:", transformedReports); // Debug log
                setReports(transformedReports);
            }
        } catch (error) {
            console.error("Error fetching reports:", error);
            toast.error(error.response?.data?.message || "Failed to fetch blotter reports");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) {
            fetchReports();
        }
    }, [currentUser]);

    const handleStatusChange = async (reportId, newStatus) => {
        try {
            setUpdating(true);
            const response = await api.put(
                `/blotter/${reportId}`,
                {
                    status: newStatus,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${currentUser.token}`,
                    },
                }
            );

            if (response.data) {
                await fetchReports();
                toast.success("Report status updated successfully");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error(error.response?.data?.message || "Failed to update report status");
        } finally {
            setUpdating(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Pending":
                return "bg-yellow-500";
            case "Under Investigation":
                return "bg-blue-500";
            case "Resolved":
                return "bg-green-500";
            case "Closed":
                return "bg-gray-500";
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

    // In the dialog content, update the status select to show appropriate options
    const getAvailableStatuses = (currentStatus) => {
        switch (currentStatus) {
            case "Pending":
                return ["Pending", "Under Investigation", "Resolved"];
            case "Under Investigation":
                return ["Under Investigation", "Resolved", "Closed"];
            case "Resolved":
                return ["Resolved", "Closed"];
            case "Closed":
                return ["Closed"];
            default:
                return ["Pending", "Under Investigation", "Resolved", "Closed"];
        }
    };

    const handleDownload = (file) => {
        try {
            let base64Data;
            if (file.data.startsWith("data:")) {
                // If it's a data URL, extract the base64 part
                base64Data = file.data.split(",")[1];
            } else {
                base64Data = file.data;
            }

            const byteString = atob(base64Data);
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);

            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            const blob = new Blob([ab], { type: file.contentType });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = file.filename;
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

    // Update the renderEvidenceFiles function
    const renderEvidenceFiles = (evidenceFile) => {
        if (!evidenceFile) return null;

        return (
            <div className="mt-2">
                <div className="flex items-center gap-4 mb-2">
                    <div className="flex-1 truncate">
                        <p className="text-sm text-muted-foreground truncate">
                            {evidenceFile.filename}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {evidenceFile.contentType.startsWith("image/") && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4 mr-2" />
                                    Preview
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl w-full h-[90vh]">
                                <div className="relative w-full h-full">
                                    <img
                                        src={evidenceFile.data}
                                        alt={evidenceFile.filename}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(evidenceFile)}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                    </Button>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading blotter reports...</p>
                </div>
            </div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Blotter Reports</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Search and Page Size Controls */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search reports..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-8"
                            />
                        </div>
                        <Select
                            value={pageSize.toString()}
                            onValueChange={(value) => {
                                setPageSize(Number(value));
                                setCurrentPage(1);
                            }}
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
                                <TableHead>Status</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentReports.map((report) => (
                                <TableRow key={report.id}>
                                    <TableCell>
                                        {new Date(report.incidentDate).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>{report.complainantName}</TableCell>
                                    <TableCell>{report.respondentName}</TableCell>
                                    <TableCell>{report.incidentType}</TableCell>
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
                                                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
                                                    <DialogHeader className="border-b pb-4">
                                                        <DialogTitle className="text-2xl font-bold">
                                                            Blotter Report Details
                                                        </DialogTitle>
                                                        <p className="text-sm text-muted-foreground">
                                                            Reported on{" "}
                                                            {formatDate(
                                                                selectedReport.incidentDate
                                                            )}
                                                        </p>
                                                    </DialogHeader>

                                                    {/* Add a scrollable container for the main content */}
                                                    <div className="flex-1 overflow-y-auto py-4">
                                                        <div className="space-y-6">
                                                            {/* Complainant Information */}
                                                            <div className="bg-muted/50 rounded-lg p-6">
                                                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                                                    <User className="h-5 w-5" />
                                                                    Complainant Information
                                                                </h3>
                                                                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                                                                    <div className="space-y-1">
                                                                        <p className="text-sm font-medium text-muted-foreground">
                                                                            Name
                                                                        </p>
                                                                        <p>
                                                                            {
                                                                                selectedReport.complainantName
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <p className="text-sm font-medium text-muted-foreground">
                                                                            Age
                                                                        </p>
                                                                        <p>
                                                                            {
                                                                                selectedReport.complainantAge
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <p className="text-sm font-medium text-muted-foreground">
                                                                            Gender
                                                                        </p>
                                                                        <p>
                                                                            {
                                                                                selectedReport.complainantGender
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <p className="text-sm font-medium text-muted-foreground">
                                                                            Civil Status
                                                                        </p>
                                                                        <p>
                                                                            {
                                                                                selectedReport.complainantCivilStatus
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <p className="text-sm font-medium text-muted-foreground">
                                                                            Contact
                                                                        </p>
                                                                        <p>
                                                                            {
                                                                                selectedReport.complainantContact
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <p className="text-sm font-medium text-muted-foreground">
                                                                            Address
                                                                        </p>
                                                                        <p>
                                                                            {
                                                                                selectedReport.complainantAddress
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Respondent Information */}
                                                            <div className="bg-muted/50 rounded-lg p-6">
                                                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                                                    <User className="h-5 w-5" />
                                                                    Respondent Information
                                                                </h3>
                                                                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                                                                    <div className="space-y-1">
                                                                        <p className="text-sm font-medium text-muted-foreground">
                                                                            Name
                                                                        </p>
                                                                        <p>
                                                                            {
                                                                                selectedReport.respondentName
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <p className="text-sm font-medium text-muted-foreground">
                                                                            Contact
                                                                        </p>
                                                                        <p>
                                                                            {
                                                                                selectedReport.respondentContact
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <p className="text-sm font-medium text-muted-foreground">
                                                                            Address
                                                                        </p>
                                                                        <p>
                                                                            {
                                                                                selectedReport.respondentAddress
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Incident Details */}
                                                            <div className="bg-muted/50 rounded-lg p-6">
                                                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                                                    <MapPin className="h-5 w-5" />
                                                                    Incident Details
                                                                </h3>
                                                                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                                                                    <div className="space-y-1">
                                                                        <p className="text-sm font-medium text-muted-foreground">
                                                                            Date
                                                                        </p>
                                                                        <p>
                                                                            {formatDate(
                                                                                selectedReport.incidentDate
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <p className="text-sm font-medium text-muted-foreground">
                                                                            Time
                                                                        </p>
                                                                        <p>
                                                                            {
                                                                                selectedReport.incidentTime
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <p className="text-sm font-medium text-muted-foreground">
                                                                            Location
                                                                        </p>
                                                                        <p>
                                                                            {
                                                                                selectedReport.incidentLocation
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <p className="text-sm font-medium text-muted-foreground">
                                                                            Type
                                                                        </p>
                                                                        <p>
                                                                            {
                                                                                selectedReport.incidentType
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* After Incident Details section, before Narrative */}
                                                            <div className="bg-muted/50 rounded-lg p-6">
                                                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                                                    <User className="h-5 w-5" />
                                                                    Witness Information
                                                                </h3>
                                                                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                                                                    <div className="space-y-1">
                                                                        <p className="text-sm font-medium text-muted-foreground">
                                                                            Witness Name
                                                                        </p>
                                                                        <p>
                                                                            {
                                                                                selectedReport.witnessName
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <p className="text-sm font-medium text-muted-foreground">
                                                                            Witness Contact
                                                                        </p>
                                                                        <p>
                                                                            {
                                                                                selectedReport.witnessContact
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Additional Details */}
                                                            <div className="bg-muted/50 rounded-lg p-6">
                                                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                                                    <FileText className="h-5 w-5" />
                                                                    Additional Details
                                                                </h3>
                                                                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                                                                    <div className="space-y-1">
                                                                        <p className="text-sm font-medium text-muted-foreground">
                                                                            Motive
                                                                        </p>
                                                                        <p>
                                                                            {selectedReport.motive}
                                                                        </p>
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <p className="text-sm font-medium text-muted-foreground">
                                                                            Action Requested
                                                                        </p>
                                                                        <p>
                                                                            {
                                                                                selectedReport.actionRequested
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Narrative */}
                                                            <div className="bg-muted/50 rounded-lg p-6">
                                                                <h3 className="font-semibold mb-4">
                                                                    Narrative
                                                                </h3>
                                                                <p className="text-sm whitespace-pre-wrap">
                                                                    {selectedReport.narrative}
                                                                </p>
                                                            </div>

                                                            {/* Evidence Files */}
                                                            <div className="bg-muted/50 rounded-lg p-6">
                                                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                                                    <FileText className="h-5 w-5" />
                                                                    Evidence Files
                                                                </h3>
                                                                <div className="space-y-4">
                                                                    {selectedReport.evidenceFile &&
                                                                        renderEvidenceFiles(
                                                                            selectedReport.evidenceFile
                                                                        )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Status Update Section */}
                                                    <div className="sticky bottom-0 border-t bg-background pt-4 mt-auto">
                                                        <div className="flex items-center justify-between">
                                                            <h3 className="text-sm font-medium text-muted-foreground">
                                                                Status Update
                                                            </h3>
                                                            <Select
                                                                defaultValue={selectedReport.status}
                                                                disabled={updating}
                                                                onValueChange={(value) =>
                                                                    handleStatusChange(
                                                                        selectedReport.id,
                                                                        value
                                                                    )
                                                                }
                                                            >
                                                                <SelectTrigger className="w-[180px]">
                                                                    <SelectValue placeholder="Select status" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {getAvailableStatuses(
                                                                        selectedReport.status
                                                                    ).map((status) => (
                                                                        <SelectItem
                                                                            key={status}
                                                                            value={status}
                                                                            className={
                                                                                status === "Closed"
                                                                                    ? "text-red-500"
                                                                                    : status ===
                                                                                        "Resolved"
                                                                                      ? "text-green-500"
                                                                                      : status ===
                                                                                          "Under Investigation"
                                                                                        ? "text-blue-500"
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
                                    onClick={() => setCurrentPage((prev) => prev - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage((prev) => prev + 1)}
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

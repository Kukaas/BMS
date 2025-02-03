import { useState, useEffect } from "react";
import BlotterReportForm from "@/components/forms/BlotterReportForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Grid, List, Eye, FileText, MapPin, User, Download } from "lucide-react";
import { toast } from "sonner";
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import { useSelector } from "react-redux";

// Add formatDate utility function
const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

export default function BlotterReportPage() {
    const [showReportForm, setShowReportForm] = useState(false);
    const [blotters, setBlotters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { currentUser } = useSelector((state) => state.user);

    // Add pagination and search states
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState("grid");

    // Fetch user's blotter reports
    const fetchBlotterReports = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:5000/api/blotter/user/reports", {
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                },
            });
            setBlotters(response.data.reports);
        } catch (error) {
            console.error("Error fetching blotter reports:", error);
            toast.error("Failed to load blotter reports");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) {
            fetchBlotterReports();
        }
    }, [currentUser]);

    // Filter blotters based on search term
    const filteredBlotters = blotters.filter((blotter) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            blotter.incidentType?.toLowerCase().includes(searchLower) ||
            blotter.status?.toLowerCase().includes(searchLower) ||
            blotter.complainantName?.toLowerCase().includes(searchLower) ||
            blotter.respondentName?.toLowerCase().includes(searchLower)
        );
    });

    // Calculate pagination
    const totalBlotters = filteredBlotters.length;
    const totalPages = Math.ceil(totalBlotters / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentBlotters = filteredBlotters.slice(startIndex, endIndex);

    const handleSubmit = async (data, resetForm) => {
        try {
            setIsSubmitting(true);
            const response = await axios.post("http://localhost:5000/api/blotter/report", data, {
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                },
            });

            if (response.status === 201) {
                toast.success("Blotter report submitted successfully!");
                resetForm();
                setShowReportForm(false);
                fetchBlotterReports(); // Refresh the list
            }
        } catch (error) {
            console.error("Error submitting blotter:", error);
            toast.error("Failed to submit blotter report");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Add function to render blotter details
    const BlotterDetails = ({ blotter }) => (
        <div className="space-y-6">
            {/* Complainant Information */}
            <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Complainant Information
                </h3>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Name</p>
                        <p>{blotter.complainantName}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Age</p>
                        <p>{blotter.complainantAge}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Contact</p>
                        <p>{blotter.complainantContact}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Address</p>
                        <p>{blotter.complainantAddress}</p>
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
                        <p className="text-sm font-medium text-muted-foreground">Name</p>
                        <p>{blotter.respondentName}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Contact</p>
                        <p>{blotter.respondentContact}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Address</p>
                        <p>{blotter.respondentAddress}</p>
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
                        <p className="text-sm font-medium text-muted-foreground">Date</p>
                        <p>{formatDate(blotter.incidentDate)}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Time</p>
                        <p>{blotter.incidentTime}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Location</p>
                        <p>{blotter.incidentLocation}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Type</p>
                        <p>{blotter.incidentType}</p>
                    </div>
                </div>
            </div>

            {/* Narrative */}
            <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="font-semibold mb-4">Narrative</h3>
                <p className="text-sm whitespace-pre-wrap">{blotter.narrative}</p>
            </div>

            {/* Evidence Files */}
            {blotter.evidenceFile && (
                <div className="bg-muted/50 rounded-lg p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Evidence Files
                    </h3>
                    <div className="mt-2">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="flex-1 truncate">
                                <p className="text-sm text-muted-foreground truncate">
                                    {blotter.evidenceFile.filename}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {blotter.evidenceFile.contentType?.startsWith("image/") && (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <Eye className="h-4 w-4 mr-2" />
                                            View Image
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl">
                                        <DialogHeader>
                                            <DialogTitle>Evidence Image</DialogTitle>
                                        </DialogHeader>
                                        <div className="relative w-full aspect-video">
                                            <img
                                                src={blotter.evidenceFile.data}
                                                alt="Evidence"
                                                className="w-full h-full object-contain rounded-md"
                                            />
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownload(blotter.evidenceFile)}
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    // Add the handleDownload function
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

    // Update the card rendering in the grid view
    const renderBlotterCard = (blotter) => (
        <Card key={blotter._id}>
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-semibold">Case: {blotter.incidentType}</h3>
                        <p className="text-sm text-muted-foreground">
                            Filed on: {formatDate(blotter.createdAt)}
                        </p>
                    </div>
                    <Badge
                        variant={
                            blotter.status === "Pending"
                                ? "warning"
                                : blotter.status === "Resolved"
                                  ? "success"
                                  : "secondary"
                        }
                        className="text-xs"
                    >
                        {blotter.status}
                    </Badge>
                </div>
                <div className="space-y-2 mt-4">
                    <div>
                        <h4 className="font-medium">Complainant</h4>
                        <p className="text-sm">{blotter.complainantName}</p>
                    </div>
                    <div>
                        <h4 className="font-medium">Respondent</h4>
                        <p className="text-sm">{blotter.respondentName}</p>
                    </div>
                    <div>
                        <h4 className="font-medium">Incident Details</h4>
                        <p className="text-sm line-clamp-2">{blotter.narrative}</p>
                    </div>
                </div>
                <div className="mt-4">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="w-full">
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh]">
                            <DialogHeader className="border-b pb-4">
                                <DialogTitle className="text-2xl font-bold">
                                    Blotter Report Details
                                </DialogTitle>
                                <div className="flex flex-col gap-2">
                                    <p className="text-sm text-muted-foreground">
                                        Reported on {formatDate(blotter.createdAt)}
                                    </p>
                                    <Badge
                                        variant={
                                            blotter.status === "Pending"
                                                ? "warning"
                                                : blotter.status === "Resolved"
                                                  ? "success"
                                                  : blotter.status === "Under Investigation"
                                                    ? "default"
                                                    : "secondary"
                                        }
                                        className={
                                            blotter.status === "Pending"
                                                ? "bg-yellow-500 w-fit"
                                                : blotter.status === "Resolved"
                                                  ? "bg-green-500 w-fit"
                                                  : blotter.status === "Under Investigation"
                                                    ? "bg-blue-500 w-fit"
                                                    : "bg-gray-500 w-fit"
                                        }
                                    >
                                        {blotter.status}
                                    </Badge>
                                </div>
                            </DialogHeader>
                            <ScrollArea className="h-[calc(80vh-8rem)]">
                                <div className="p-6">
                                    <BlotterDetails blotter={blotter} />
                                </div>
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    );

    if (loading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-8">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Loading blotter reports...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="pt-0 md:pt-8 lg:pt-8">
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
                            <div className="flex items-center gap-2">
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
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                        setViewMode(viewMode === "grid" ? "list" : "grid")
                                    }
                                >
                                    {viewMode === "grid" ? (
                                        <List className="h-4 w-4" />
                                    ) : (
                                        <Grid className="h-4 w-4" />
                                    )}
                                </Button>
                                <Button onClick={() => setShowReportForm(true)}>
                                    File New Blotter
                                </Button>
                            </div>
                        </div>

                        {currentBlotters.length === 0 ? (
                            <p className="text-gray-500 text-center">No blotter reports found.</p>
                        ) : viewMode === "grid" ? (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {currentBlotters.map(renderBlotterCard)}
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Case Type</TableHead>
                                            <TableHead>Complainant</TableHead>
                                            <TableHead>Respondent</TableHead>
                                            <TableHead>Date Filed</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {currentBlotters.map((blotter) => (
                                            <TableRow key={blotter._id}>
                                                <TableCell>{blotter.incidentType}</TableCell>
                                                <TableCell>{blotter.complainantName}</TableCell>
                                                <TableCell>{blotter.respondentName}</TableCell>
                                                <TableCell>
                                                    {new Date(
                                                        blotter.createdAt
                                                    ).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            blotter.status === "Pending"
                                                                ? "warning"
                                                                : blotter.status === "Resolved"
                                                                  ? "success"
                                                                  : "secondary"
                                                        }
                                                    >
                                                        {blotter.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button variant="outline" size="sm">
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                View Details
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-3xl max-h-[90vh]">
                                                            <DialogHeader className="border-b pb-4">
                                                                <DialogTitle className="text-2xl font-bold">
                                                                    Blotter Report Details
                                                                </DialogTitle>
                                                                <div className="flex flex-col gap-2">
                                                                    <p className="text-sm text-muted-foreground">
                                                                        Reported on{" "}
                                                                        {formatDate(
                                                                            blotter.createdAt
                                                                        )}
                                                                    </p>
                                                                    <Badge
                                                                        variant={
                                                                            blotter.status ===
                                                                            "Pending"
                                                                                ? "warning"
                                                                                : blotter.status ===
                                                                                    "Resolved"
                                                                                  ? "success"
                                                                                  : blotter.status ===
                                                                                      "Under Investigation"
                                                                                    ? "default"
                                                                                    : "secondary"
                                                                        }
                                                                        className={
                                                                            blotter.status ===
                                                                            "Pending"
                                                                                ? "bg-yellow-500 w-fit"
                                                                                : blotter.status ===
                                                                                    "Resolved"
                                                                                  ? "bg-green-500 w-fit"
                                                                                  : blotter.status ===
                                                                                      "Under Investigation"
                                                                                    ? "bg-blue-500 w-fit"
                                                                                    : "bg-gray-500 w-fit"
                                                                        }
                                                                    >
                                                                        {blotter.status}
                                                                    </Badge>
                                                                </div>
                                                            </DialogHeader>
                                                            <ScrollArea className="h-[calc(80vh-8rem)]">
                                                                <div className="p-6">
                                                                    <BlotterDetails
                                                                        blotter={blotter}
                                                                    />
                                                                </div>
                                                            </ScrollArea>
                                                        </DialogContent>
                                                    </Dialog>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}

                        {/* Pagination Controls */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <p className="text-sm text-muted-foreground text-center sm:text-left">
                                {searchTerm
                                    ? `${filteredBlotters.length} results found`
                                    : `Total Reports: ${totalBlotters}`}
                            </p>
                            <div className="flex flex-col sm:flex-row items-center gap-3 sm:space-x-6 lg:space-x-8">
                                <div className="text-sm font-medium">
                                    Page {currentPage} of {totalPages}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(currentPage + 1)}
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

            {/* Form Modal */}
            {showReportForm && (
                <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
                    <div className="bg-background rounded-lg w-full max-w-4xl my-8 shadow-lg overflow-hidden">
                        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                            <h2 className="text-2xl font-bold">File New Blotter Report</h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowReportForm(false)}
                                className="hover:bg-gray-100 rounded-full h-8 w-8 p-0 flex items-center justify-center"
                            >
                                <span className="text-lg">×</span>
                            </Button>
                        </div>
                        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto p-6">
                            <BlotterReportForm
                                onSubmit={handleSubmit}
                                isSubmitting={isSubmitting}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

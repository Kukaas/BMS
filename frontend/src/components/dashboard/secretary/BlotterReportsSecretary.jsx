import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
import { Loader2, Search, Eye, Download } from "lucide-react";
import { BlotterTableView } from "./components/BlotterTableView";

// Add formatDate function at the top
const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

function getStatusColor(status) {
    switch (status?.toLowerCase()) {
        case "pending":
            return "bg-yellow-500 hover:bg-yellow-600 text-white";
        case "under investigation":
            return "bg-purple-500 hover:bg-purple-600 text-white";
        case "resolved":
            return "bg-green-500 hover:bg-green-600 text-white";
        case "closed":
            return "bg-blue-500 text-white hover:bg-blue-600";
        default:
            return "bg-gray-500 hover:bg-gray-600";
    }
}

export function SecretaryBlotterDashboard() {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [pageSize, setPageSize] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await api.get("/blotter/barangay");
            setReports(response.data);
        } catch (err) {
            setError("Failed to fetch blotter reports");
            toast.error("Failed to fetch blotter reports");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (reportId, newStatus) => {
        try {
            setUpdating(true);
            await api.put(`/blotter/${reportId}`, { status: newStatus });

            // Update reports state locally
            setReports((prevReports) =>
                prevReports.map((report) =>
                    report._id === reportId ? { ...report, status: newStatus } : report
                )
            );

            // Update selected report if it's open
            if (selectedReport && selectedReport._id === reportId) {
                setSelectedReport((prev) => ({ ...prev, status: newStatus }));
            }

            toast.success("Status updated successfully");
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        } finally {
            setUpdating(false);
        }
    };

    const handleDownload = async (reportId) => {
        try {
            const response = await api.get(`/blotter/${reportId}/download`, {
                responseType: "blob",
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `blotter-report-${reportId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            toast.error("Failed to download report");
        }
    };

    // Filter reports based on search
    const filteredReports = reports.filter((report) =>
        Object.values(report).join(" ").toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate pagination
    const totalPages = Math.ceil(filteredReports.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentReports = filteredReports.slice(startIndex, endIndex);

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

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <BlotterTableView
                currentReports={currentReports}
                setSelectedReport={setSelectedReport}
                selectedReport={selectedReport}
                getStatusColor={getStatusColor}
                handleStatusChange={handleStatusChange}
                handleDownload={handleDownload}
                formatDate={formatDate}
                updating={updating}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                pageSize={pageSize}
                onPageSizeChange={(value) => {
                    setPageSize(Number(value));
                    setCurrentPage(1);
                }}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
}

export default SecretaryBlotterDashboard;

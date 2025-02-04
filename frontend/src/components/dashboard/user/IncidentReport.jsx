import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Search } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IncidentReportFormContent } from "@/components/forms/IncidentReportsForm";
import { IncidentReportGridView } from "./components/IncidentReportGridView";
import { IncidentReportTableView } from "./components/IncidentReportTableView";

export function IncidentReport() {
    const [showReportForm, setShowReportForm] = useState(false);
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useSelector((state) => state.user);

    // Pagination and search states
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [searchTerm, setSearchTerm] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const fetchIncidents = useCallback(async () => {
        if (!currentUser) {
            toast.error("Please log in to view your incidents");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(
                "http://localhost:5000/api/incident-report/user/reports",
                {
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`,
                    },
                }
            );
            setIncidents(response.data.data);
        } catch (error) {
            console.error("Error fetching incidents:", error);
            toast.error("Failed to load incident reports");
        } finally {
            setLoading(false);
        }
    }, [currentUser]);

    useEffect(() => {
        if (currentUser) {
            fetchIncidents();
        }
    }, [currentUser, fetchIncidents]);

    const handleReportComplete = () => {
        setShowReportForm(false);
        fetchIncidents();
    };

    const handleCancel = () => {
        setShowReportForm(false);
    };

    // Filter incidents based on search term
    const filteredIncidents = incidents.filter((incident) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            incident.category?.toLowerCase().includes(searchLower) ||
            incident.subCategory?.toLowerCase().includes(searchLower) ||
            incident.description?.toLowerCase().includes(searchLower) ||
            incident.status?.toLowerCase().includes(searchLower)
        );
    });

    const getStatusColor = (status) => {
        switch (status) {
            case "New":
                return "bg-blue-500 text-white";
            case "In Progress":
                return "bg-yellow-500 text-white";
            case "Resolved":
                return "bg-green-500 text-white";
            default:
                return "bg-gray-500 text-white";
        }
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-8">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Loading incidents...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="pt-0 md:pt-8 lg:pt-8">
            <Card>
                <CardHeader>
                    <CardTitle>Incident Reports</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex flex-col md:flex-row md:justify-between gap-4">
                            <div className="relative w-full md:w-[350px] order-2 md:order-1">
                                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search reports..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-8"
                                />
                            </div>
                            <div className="flex items-center justify-end gap-2 order-1 md:order-2">
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
                                        {[6, 12, 18, 24, 30].map((size) => (
                                            <SelectItem key={size} value={size.toString()}>
                                                {size} per page
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button onClick={() => setShowReportForm(true)}>
                                    Report New Incident
                                </Button>
                            </div>
                        </div>

                        {filteredIncidents.length === 0 ? (
                            <p className="text-gray-500 text-center">No incident reports found.</p>
                        ) : (
                            <>
                                <IncidentReportGridView
                                    incidents={filteredIncidents}
                                    getStatusColor={getStatusColor}
                                />
                                <IncidentReportTableView
                                    incidents={filteredIncidents}
                                    getStatusColor={getStatusColor}
                                />
                            </>
                        )}

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <p className="text-sm text-muted-foreground text-center sm:text-left">
                                {searchTerm
                                    ? `${filteredIncidents.length} results found`
                                    : `Total Reports: ${totalItems}`}
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

            {showReportForm && (
                <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
                    <div className="bg-background rounded-lg w-full max-w-4xl my-8 shadow-lg overflow-hidden">
                        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Report New Incident</h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleCancel}
                                className="hover:bg-gray-100 rounded-full h-8 w-8 p-0 flex items-center justify-center"
                            >
                                <span className="text-lg">×</span>
                            </Button>
                        </div>
                        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto p-6">
                            <IncidentReportFormContent
                                onComplete={handleReportComplete}
                                onCancel={handleCancel}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

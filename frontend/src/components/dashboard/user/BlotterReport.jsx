import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { BlotterReportGridView } from "./components/BlotterReportGridView";
import { BlotterReportTableView } from "./components/BlotterReportTableView";
import BlotterReportForm from "@/components/forms/BlotterReportForm";

export function BlotterReport() {
    const [showReportForm, setShowReportForm] = useState(false);
    const [blotters, setBlotters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { currentUser } = useSelector((state) => state.user);

    // Pagination and search states
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [searchTerm, setSearchTerm] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const fetchBlotterReports = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:5000/api/blotter/user/reports", {
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                },
            });
            setBlotters(response.data.reports);
            setTotalItems(response.data.reports.length);
            setTotalPages(Math.ceil(response.data.reports.length / pageSize));
        } catch (error) {
            console.error("Error fetching blotter reports:", error);
            toast.error("Failed to load blotter reports");
        } finally {
            setLoading(false);
        }
    }, [currentUser, pageSize]);

    useEffect(() => {
        if (currentUser) {
            fetchBlotterReports();
        }
    }, [currentUser, fetchBlotterReports]);

    const handleSubmit = async (data, resetForm) => {
        try {
            setIsSubmitting(true);
            const formattedData = {
                ...data,
                incidentDate: new Date(data.incidentDate).toISOString(),
            };

            const response = await axios.post(
                "http://localhost:5000/api/blotter/report",
                formattedData,
                {
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 201) {
                toast.success("Blotter report submitted successfully!");
                resetForm();
                setShowReportForm(false);
                fetchBlotterReports();
            }
        } catch (error) {
            console.error("Error submitting blotter:", error);
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to submit blotter report";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

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
                                    File New Blotter
                                </Button>
                            </div>
                        </div>

                        {filteredBlotters.length === 0 ? (
                            <p className="text-gray-500 text-center">No blotter reports found.</p>
                        ) : (
                            <>
                                <BlotterReportGridView blotters={filteredBlotters} />
                                <BlotterReportTableView blotters={filteredBlotters} />
                            </>
                        )}

                        {/* Pagination Controls */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <p className="text-sm text-muted-foreground text-center sm:text-left">
                                {searchTerm
                                    ? `${filteredBlotters.length} results found`
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

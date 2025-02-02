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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Grid, List } from "lucide-react";
import DocumentRequestForm from "@/components/forms/DocumentRequestForm";
import { DocumentRequestGrid } from "./components/DocumentRequestGrid";
import axiosInstance from '@/lib/axios';
import { toast } from "sonner";

export function Requests() {
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [requests, setRequests] = useState([]);
    const [viewMode, setViewMode] = useState("grid");
    const [loading, setLoading] = useState(true);
    const { currentUser } = useSelector((state) => state.user);

    // Pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const limit = 10;

    const fetchRequests = useCallback(async (pageNum = 1) => {
        if (!currentUser) {
            toast.error("Please log in to view your requests");
            return;
        }

        try {
            setLoading(true);
            const response = await axiosInstance.get('/document-requests/my-requests', {
                params: {
                    page: pageNum,
                    limit
                }
            });

            if (response.data.success) {
                if (pageNum === 1) {
                    setRequests(response.data.data);
                } else {
                    setRequests(prev => [...prev, ...response.data.data]);
                }
                setTotalPages(response.data.pagination.totalPages);
                setHasMore(pageNum < response.data.pagination.totalPages);
            }
        } catch (error) {
            console.error("Failed to fetch requests:", error);
            toast.error(error.response?.data?.message || "Failed to fetch requests");
        } finally {
            setLoading(false);
        }
    }, [currentUser]);

    // Initial fetch and periodic refresh
    useEffect(() => {
        if (currentUser) {
            fetchRequests(1);
            // Set up periodic refresh every 30 seconds
            const refreshInterval = setInterval(() => {
                fetchRequests(1);
            }, 30000);

            return () => clearInterval(refreshInterval);
        }
    }, [currentUser, fetchRequests]);

    const loadMore = () => {
        if (!loading && hasMore) {
            fetchRequests(page + 1);
            setPage(prev => prev + 1);
        }
    };

    const handleRequestComplete = async () => {
        setShowRequestForm(false);
        // Reset to first page and fetch latest data
        setPage(1);
        await fetchRequests(1);
        toast.success("Request submitted successfully");
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "bg-yellow-200 text-yellow-900 hover:bg-yellow-300";
            case "approved":
                return "bg-green-200 text-green-900 hover:bg-green-300";
            case "rejected":
                return "bg-red-200 text-red-900 hover:bg-red-300";
            default:
                return "bg-gray-200 text-gray-900 hover:bg-gray-300";
        }
    };

    if (!currentUser) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardContent className="text-center py-8">
                        <p className="text-gray-500">Please log in to view your requests</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardContent className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <CardTitle className="text-2xl sm:text-3xl">My Document Requests</CardTitle>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                            >
                                {viewMode === "grid" ? (
                                    <List className="h-4 w-4" />
                                ) : (
                                    <Grid className="h-4 w-4" />
                                )}
                            </Button>
                            <Dialog open={showRequestForm} onOpenChange={setShowRequestForm}>
                                <DialogTrigger asChild>
                                    <Button>Request New Document</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[600px] w-[90vw]">
                                    <DialogHeader>
                                        <DialogTitle>Request New Document</DialogTitle>
                                    </DialogHeader>
                                    <div className="p-4 max-h-[80vh] overflow-y-auto">
                                        <DocumentRequestForm
                                            onComplete={handleRequestComplete}
                                            className="w-full"
                                            currentUser={currentUser}
                                        />
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {requests.length === 0 ? (
                        <p className="text-gray-500 text-center">No document requests yet.</p>
                    ) : viewMode === "grid" ? (
                        <>
                            <DocumentRequestGrid
                                requests={requests}
                                getStatusColor={getStatusColor}
                            />
                            {hasMore && (
                                <div className="mt-4 text-center">
                                    <Button
                                        onClick={loadMore}
                                        disabled={loading}
                                        variant="outline"
                                    >
                                        {loading ? "Loading..." : "Load More"}
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Document Type</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Purpose</TableHead>
                                        <TableHead>Requested On</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {requests.map((request) => (
                                        <TableRow key={request.id}>
                                            <TableCell className="font-medium">
                                                {request.documentType}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getStatusColor(request.status)}>
                                                    {request.status || 'Pending'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{request.purpose || 'N/A'}</TableCell>
                                            <TableCell>
                                                {new Date(request.createdAt).toLocaleDateString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {hasMore && (
                                <div className="mt-4 text-center">
                                    <Button
                                        onClick={loadMore}
                                        disabled={loading}
                                        variant="outline"
                                    >
                                        {loading ? "Loading..." : "Load More"}
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

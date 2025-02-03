import { useState, useEffect, useCallback, useMemo } from "react";
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
import { Grid, List, Loader2, Search } from "lucide-react";
import DocumentRequestForm from "@/components/forms/DocumentRequestForm";
import { DocumentRequestGrid } from "./components/DocumentRequestGrid";
import axiosInstance from "@/lib/axios";
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

export function Requests() {
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useSelector((state) => state.user);

    // Pagination and search state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [searchTerm, setSearchTerm] = useState("");

    // Add state for pagination info
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const fetchRequests = useCallback(async () => {
        if (!currentUser) {
            toast.error("Please log in to view your requests");
            return;
        }

        try {
            setLoading(true);
            const response = await axiosInstance.get("/document-requests/my-requests", {
                params: {
                    page: currentPage,
                    limit: pageSize,
                },
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                },
            });

            if (response.data.success) {
                setRequests(response.data.data);
                setTotalPages(response.data.pagination.totalPages);
                setTotalItems(response.data.pagination.total);
            }
        } catch (error) {
            console.error("Failed to fetch requests:", error);
            toast.error(error.response?.data?.message || "Failed to fetch requests");
        } finally {
            setLoading(false);
        }
    }, [currentUser, currentPage, pageSize]);

    useEffect(() => {
        if (currentUser) {
            fetchRequests();
        }
    }, [currentUser, fetchRequests, currentPage, pageSize]);

    const handleRequestComplete = async () => {
        setShowRequestForm(false);
        await fetchRequests();
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

    // Update the filter logic to handle server-side pagination
    const filteredRequests = useMemo(() => {
        if (!searchTerm) return requests;

        return requests.filter((request) => {
            const searchLower = searchTerm.toLowerCase();
            return (
                request.documentType.toLowerCase().includes(searchLower) ||
                request.status?.toLowerCase().includes(searchLower) ||
                request.purpose?.toLowerCase().includes(searchLower)
            );
        });
    }, [requests, searchTerm]);

    // Update pagination handlers
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePageSizeChange = (value) => {
        setPageSize(Number(value));
        setCurrentPage(1);
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
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Loading requests...</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="pt-0 md:pt-8 lg:pt-8">
            <Card>
                <CardHeader>
                    <CardTitle>Document Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex flex-col md:flex-row md:justify-between gap-4">
                            <div className="relative w-full md:w-[350px] order-2 md:order-1">
                                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search requests..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-8"
                                />
                            </div>
                            <div className="flex items-center justify-end gap-2 order-1 md:order-2">
                                <Select
                                    value={pageSize.toString()}
                                    onValueChange={handlePageSizeChange}
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
                                <Dialog open={showRequestForm} onOpenChange={setShowRequestForm}>
                                    <DialogTrigger asChild>
                                        <Button>Request New Document</Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl max-h-[90vh]">
                                        <DialogHeader className="border-b pb-4">
                                            <DialogTitle className="text-2xl font-bold">
                                                Request New Document
                                            </DialogTitle>
                                        </DialogHeader>
                                        <ScrollArea className="h-[calc(80vh-8rem)]">
                                            <div className="p-6">
                                                <DocumentRequestForm
                                                    onComplete={handleRequestComplete}
                                                    className="w-full"
                                                    currentUser={currentUser}
                                                />
                                            </div>
                                        </ScrollArea>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>

                        {filteredRequests.length === 0 ? (
                            <p className="text-gray-500 text-center">No document requests found.</p>
                        ) : (
                            <>
                                {/* Grid view for small screens */}
                                <div className="md:hidden grid gap-4 grid-cols-1 sm:grid-cols-2">
                                    {filteredRequests.map((request) => (
                                        <Card key={request.id}>
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className="font-semibold">
                                                            {request.documentType}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            Requested on:{" "}
                                                            {new Date(
                                                                request.createdAt
                                                            ).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <Badge
                                                        className={getStatusColor(request.status)}
                                                    >
                                                        {request.status || "Pending"}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-2 mt-4">
                                                    <div>
                                                        <h4 className="font-medium">Purpose</h4>
                                                        <p className="text-sm">
                                                            {request.purpose || "N/A"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* Table view for medium and larger screens */}
                                <div className="hidden md:block rounded-md border">
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
                                            {filteredRequests.map((request) => (
                                                <TableRow key={request.id}>
                                                    <TableCell className="font-medium">
                                                        {request.documentType}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            className={getStatusColor(
                                                                request.status
                                                            )}
                                                        >
                                                            {request.status || "Pending"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {request.purpose || "N/A"}
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Date(
                                                            request.createdAt
                                                        ).toLocaleDateString()}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </>
                        )}

                        {/* Pagination Controls */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <p className="text-sm text-muted-foreground text-center sm:text-left">
                                {searchTerm
                                    ? `${filteredRequests.length} results found`
                                    : `Total Requests: ${totalItems}`}
                            </p>
                            <div className="flex flex-col sm:flex-row items-center gap-3 sm:space-x-6 lg:space-x-8">
                                <div className="text-sm font-medium">
                                    Page {currentPage} of {totalPages}
                                </div>
                                <div className="flex items-center gap-2">
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
        </div>
    );
}

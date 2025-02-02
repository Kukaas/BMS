import { useState, useEffect } from "react";
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
import { mockRequests } from "./secretary/mockData";
import { DocumentRequestGrid } from "./components/DocumentRequestGrid";

export function Requests() {
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [requests, setRequests] = useState(mockRequests);
    const [viewMode, setViewMode] = useState("grid");

    const fetchRequests = async () => {
        try {
            // For now, we'll just use the mock data
            // When the API is ready, uncomment this:
            // const response = await fetch("/api/document-requests");
            // const data = await response.json();
            // setRequests(data);

            setRequests(mockRequests);
        } catch (error) {
            console.error("Failed to fetch requests:", error);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []); //Fixed: Added empty dependency array to useEffect

    const handleRequestComplete = async () => {
        setShowRequestForm(false);
        await fetchRequests();
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "approved":
                return "bg-green-100 text-green-800";
            case "rejected":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

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
                        <DocumentRequestGrid requests={requests} />
                    ) : (
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
                                                {request.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{request.purpose}</TableCell>
                                        <TableCell>
                                            {new Date(request.createdAt).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

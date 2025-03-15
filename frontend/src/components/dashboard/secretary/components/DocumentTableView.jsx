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
import { DocumentDetailsView } from "./DocumentDetailsView";
import { Printer, Loader2 } from "lucide-react";

export function DocumentTableView({
    currentRequests,
    setSelectedRequest,
    getStatusColor,
    handleStatusChange,
    updating,
    getAvailableStatuses,
    handlePrint,
    printingStates,
}) {
    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Resident</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {currentRequests.map((request) => (
                    <TableRow key={request.id || request._id}>
                        <TableCell>
                            {formatDate(request.requestDate || request.createdAt)}
                        </TableCell>
                        <TableCell>{request.type}</TableCell>
                        <TableCell>{request.name || request.residentName || "N/A"}</TableCell>
                        <TableCell>
                            <Badge className={getStatusColor(request.status)}>
                                {request.status}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePrint(request)}
                                    disabled={
                                        printingStates[request.id] ||
                                        ![
                                            "Barangay Indigency",
                                            "Barangay Clearance",
                                            "Business Clearance",
                                        ].includes(request.type) ||
                                        request.status === "Pending" ||
                                        request.status === "Rejected"
                                    }
                                    className="flex items-center gap-2"
                                >
                                    {printingStates[request.id] ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            Printing...
                                        </>
                                    ) : (
                                        <>
                                            <Printer className="h-4 w-4" />
                                            Print
                                        </>
                                    )}
                                </Button>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSelectedRequest(request)}
                                        >
                                            View Details
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl">
                                        <DialogHeader>
                                            <DialogTitle>
                                                {request.type}
                                                <span className="block text-sm font-normal text-muted-foreground mt-1">
                                                    Requested on{" "}
                                                    {formatDate(
                                                        request.requestDate || request.createdAt
                                                    )}
                                                </span>
                                            </DialogTitle>
                                        </DialogHeader>
                                        <DocumentDetailsView
                                            request={request}
                                            handleStatusChange={handleStatusChange}
                                            updating={updating}
                                            getAvailableStatuses={getAvailableStatuses}
                                        />
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

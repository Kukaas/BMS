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

export function DocumentTableView({
    currentRequests,
    setSelectedRequest,
    selectedRequest,
    getStatusColor,
    handleStatusChange,
    updating,
    getAvailableStatuses,
}) {
    // Add debug log to see the request data
    console.log("Current requests:", currentRequests);

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
                    <TableRow key={request.id}>
                        <TableCell>
                            {request.requestDate
                                ? new Date(request.requestDate).toLocaleDateString()
                                : "N/A"}
                        </TableCell>
                        <TableCell>{request.type}</TableCell>
                        <TableCell>{request.residentName}</TableCell>
                        <TableCell>
                            <Badge className={getStatusColor(request.status)}>
                                {request.status}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            // Log the selected request data
                                            console.log("Selected request:", request);
                                            setSelectedRequest(request);
                                        }}
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
                                                {request.requestDate
                                                    ? new Date(
                                                          request.requestDate
                                                      ).toLocaleDateString()
                                                    : "N/A"}
                                            </span>
                                            <Badge className={getStatusColor(request.status)}>
                                                {request.status}
                                            </Badge>
                                        </DialogTitle>
                                    </DialogHeader>
                                    <DocumentDetailsView
                                        request={request}
                                        handleStatusChange={handleStatusChange}
                                        updating={updating}
                                        getAvailableStatuses={getAvailableStatuses}
                                        getStatusColor={getStatusColor}
                                    />
                                </DialogContent>
                            </Dialog>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

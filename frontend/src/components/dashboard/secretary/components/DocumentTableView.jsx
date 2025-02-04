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
                                        onClick={() => setSelectedRequest(request)}
                                    >
                                        View Details
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Document Request Details</DialogTitle>
                                    </DialogHeader>
                                    {selectedRequest && (
                                        <DocumentDetailsView
                                            request={selectedRequest}
                                            handleStatusChange={handleStatusChange}
                                            updating={updating}
                                            getAvailableStatuses={getAvailableStatuses}
                                        />
                                    )}
                                </DialogContent>
                            </Dialog>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

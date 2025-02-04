import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function RequestsTableView({ requests, getStatusColor }) {
    return (
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
                    {requests.map((request) => (
                        <TableRow key={request.id}>
                            <TableCell className="font-medium">{request.documentType}</TableCell>
                            <TableCell>
                                <Badge className={getStatusColor(request.status)}>
                                    {request.status || "Pending"}
                                </Badge>
                            </TableCell>
                            <TableCell>{request.purpose || "N/A"}</TableCell>
                            <TableCell>
                                {new Date(request.createdAt).toLocaleDateString()}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

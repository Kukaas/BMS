import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { mockBlotterReports } from "./mockData";

export function SecretaryBlotterDashboard() {
    const [reports, setReports] = useState(mockBlotterReports);
    const [selectedReport, setSelectedReport] = useState(null);

    const handleStatusChange = (reportId, newStatus) => {
        setReports(
            reports.map((report) =>
                report.id === reportId ? { ...report, status: newStatus } : report
            )
        );
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "in progress":
                return "bg-blue-100 text-blue-800";
            case "resolved":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Blotter Reports</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Complainant</TableHead>
                            <TableHead>Respondent</TableHead>
                            <TableHead>Incident Date</TableHead>
                            <TableHead>Incident Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reports.map((report) => (
                            <TableRow key={report.id}>
                                <TableCell>{report.complainantName}</TableCell>
                                <TableCell>{report.respondentName}</TableCell>
                                <TableCell>{report.incidentDate}</TableCell>
                                <TableCell>{report.incidentType}</TableCell>
                                <TableCell>
                                    <Badge className={getStatusColor(report.status)}>
                                        {report.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setSelectedReport(report)}
                                            >
                                                View Details
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-3xl">
                                            <DialogHeader>
                                                <DialogTitle>Blotter Report Details</DialogTitle>
                                            </DialogHeader>
                                            {selectedReport && (
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-2 items-center gap-4">
                                                        <span className="font-bold">
                                                            Complainant:
                                                        </span>
                                                        <span>
                                                            {selectedReport.complainantName}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-2 items-center gap-4">
                                                        <span className="font-bold">
                                                            Respondent:
                                                        </span>
                                                        <span>{selectedReport.respondentName}</span>
                                                    </div>
                                                    <div className="grid grid-cols-2 items-center gap-4">
                                                        <span className="font-bold">
                                                            Incident Date:
                                                        </span>
                                                        <span>{selectedReport.incidentDate}</span>
                                                    </div>
                                                    <div className="grid grid-cols-2 items-center gap-4">
                                                        <span className="font-bold">
                                                            Incident Type:
                                                        </span>
                                                        <span>{selectedReport.incidentType}</span>
                                                    </div>
                                                    <div className="grid grid-cols-2 items-center gap-4">
                                                        <span className="font-bold">Status:</span>
                                                        <Select
                                                            onValueChange={(value) =>
                                                                handleStatusChange(
                                                                    selectedReport.id,
                                                                    value
                                                                )
                                                            }
                                                            defaultValue={selectedReport.status}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Change status" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="Pending">
                                                                    Pending
                                                                </SelectItem>
                                                                <SelectItem value="In Progress">
                                                                    In Progress
                                                                </SelectItem>
                                                                <SelectItem value="Resolved">
                                                                    Resolved
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    {/* Add more details here as needed */}
                                                </div>
                                            )}
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

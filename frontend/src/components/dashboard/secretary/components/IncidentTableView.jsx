import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { IncidentDetailsView } from "./IncidentDetailsView";

export function IncidentTableView({
    currentReports,
    setSelectedReport,
    selectedReport,
    getStatusColor,
    handleStatusChange,
    updating,
    handleDownload,
    formatDate,
}) {
    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentReports.map((report) => (
                        <TableRow key={report._id}>
                            <TableCell>{report.date}</TableCell>
                            <TableCell>{report.category}</TableCell>
                            <TableCell>{report.location}</TableCell>
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
                                    <DialogContent className="max-w-3xl max-h-[90vh]">
                                        <DialogHeader>
                                            <DialogTitle className="text-2xl font-bold">
                                                Incident Report Details
                                            </DialogTitle>
                                            <div className="flex flex-col gap-2">
                                                <p className="text-sm text-muted-foreground">
                                                    Reported on {formatDate(report.date)} at{" "}
                                                    {report.time}
                                                </p>
                                                <Badge
                                                    className={`${getStatusColor(report.status)} w-fit`}
                                                >
                                                    {report.status}
                                                </Badge>
                                            </div>
                                        </DialogHeader>
                                        <ScrollArea className="h-[calc(80vh-8rem)]">
                                            <div className="p-6">
                                                <IncidentDetailsView
                                                    incident={selectedReport}
                                                    handleDownload={handleDownload}
                                                    handleStatusChange={handleStatusChange}
                                                    updating={updating}
                                                />
                                            </div>
                                        </ScrollArea>
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

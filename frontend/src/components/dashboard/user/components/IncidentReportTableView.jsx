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
import { Eye } from "lucide-react";
import { IncidentDetailsView } from "./IncidentDetailsView";

export function IncidentReportTableView({ incidents, getStatusColor }) {
    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="hidden md:block rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {incidents.map((incident) => (
                        <TableRow key={incident._id}>
                            <TableCell>
                                <div>
                                    <p className="font-medium">{incident.category}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {incident.subCategory}
                                    </p>
                                </div>
                            </TableCell>
                            <TableCell>{incident.location}</TableCell>
                            <TableCell>
                                <div>
                                    <p>{formatDate(incident.date)}</p>
                                    <p className="text-sm text-muted-foreground">{incident.time}</p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    className={`${getStatusColor(incident.status)} w-fit px-2 py-1 text-xs`}
                                >
                                    {incident.status}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <Eye className="h-4 w-4 mr-2" />
                                            View Details
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl max-h-[90vh]">
                                        <DialogHeader className="border-b pb-4">
                                            <DialogTitle className="text-2xl font-bold">
                                                Incident Report Details
                                            </DialogTitle>
                                            <div className="flex flex-col gap-2">
                                                <p className="text-sm text-muted-foreground">
                                                    Reported on {formatDate(incident.date)}
                                                </p>
                                                <Badge
                                                    className={`${getStatusColor(incident.status)} w-fit px-2 py-1 text-xs`}
                                                >
                                                    {incident.status}
                                                </Badge>
                                            </div>
                                        </DialogHeader>
                                        <ScrollArea className="h-[calc(80vh-8rem)]">
                                            <div className="p-6">
                                                <IncidentDetailsView incident={incident} />
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

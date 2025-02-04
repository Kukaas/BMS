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
import { Eye } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BlotterDetailsView } from "./BlotterDetailsView";

export function BlotterReportTableView({ blotters }) {
    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "bg-yellow-500 text-white hover:bg-yellow-600";
            case "resolved":
                return "bg-green-500 text-white hover:bg-green-600";
            case "in progress":
                return "bg-blue-500 text-white hover:bg-blue-600";
            case "rejected":
                return "bg-red-500 text-white hover:bg-red-600";
            default:
                return "bg-gray-500 text-white hover:bg-gray-600";
        }
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
                    {blotters.map((blotter) => (
                        <TableRow key={blotter._id}>
                            <TableCell>
                                <div>
                                    <p className="font-medium">{blotter.incidentType}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {blotter.narrative}
                                    </p>
                                </div>
                            </TableCell>
                            <TableCell>{blotter.incidentLocation}</TableCell>
                            <TableCell>
                                <div>
                                    <p>{formatDate(blotter.incidentDate)}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {blotter.incidentTime}
                                    </p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    className={`${getStatusColor(blotter.status)} w-fit px-2 py-1 text-xs`}
                                >
                                    {blotter.status}
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
                                                Blotter Report Details
                                            </DialogTitle>
                                            <div className="flex flex-col gap-2">
                                                <p className="text-sm text-muted-foreground">
                                                    Reported on {formatDate(blotter.createdAt)}
                                                </p>
                                                <Badge
                                                    className={`${getStatusColor(blotter.status)} w-fit px-2 py-1 text-xs`}
                                                >
                                                    {blotter.status}
                                                </Badge>
                                            </div>
                                        </DialogHeader>
                                        <ScrollArea className="h-[calc(80vh-8rem)]">
                                            <div className="p-6">
                                                <BlotterDetailsView blotter={blotter} />
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

import { Card, CardContent } from "@/components/ui/card";
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

export function BlotterReportGridView({ blotters }) {
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
        <div className="md:hidden grid gap-4 grid-cols-1 sm:grid-cols-2">
            {blotters.map((blotter) => (
                <Card key={blotter._id}>
                    <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-semibold">Case: {blotter.incidentType}</h3>
                                <p className="text-sm text-muted-foreground">
                                    Filed on: {formatDate(blotter.createdAt)}
                                </p>
                            </div>
                            <Badge
                                className={`${getStatusColor(blotter.status)} w-fit px-2 py-1 text-xs`}
                            >
                                {blotter.status}
                            </Badge>
                        </div>
                        <div className="space-y-2 mt-4">
                            <div>
                                <h4 className="font-medium">Complainant</h4>
                                <p className="text-sm">{blotter.complainantName}</p>
                            </div>
                            <div>
                                <h4 className="font-medium">Respondent</h4>
                                <p className="text-sm">{blotter.respondentName}</p>
                            </div>
                            <div>
                                <h4 className="font-medium">Incident Details</h4>
                                <p className="text-sm line-clamp-2">{blotter.narrative}</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="w-full">
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
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

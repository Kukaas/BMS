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
import { IncidentDetailsView } from "./IncidentDetailsView";

export function IncidentReportGridView({ incidents, getStatusColor }) {
    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="md:hidden grid gap-4 grid-cols-1 sm:grid-cols-2">
            {incidents.map((incident) => (
                <Card key={incident._id}>
                    <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                                <h3 className="font-semibold">Case: {incident.category}</h3>
                                <p className="text-sm text-muted-foreground">
                                    Filed on: {formatDate(incident.date)}
                                </p>
                            </div>
                            <div className="ml-4">
                                <Badge
                                    className={`${getStatusColor(incident.status)} w-fit px-2 py-1 text-xs`}
                                >
                                    {incident.status}
                                </Badge>
                            </div>
                        </div>
                        <div className="space-y-2 mt-4">
                            <div>
                                <h4 className="font-medium">Reporter</h4>
                                <p className="text-sm">{incident.reporterName}</p>
                            </div>
                            <div>
                                <h4 className="font-medium">Location</h4>
                                <p className="text-sm">{incident.location}</p>
                            </div>
                            <div>
                                <h4 className="font-medium">Description</h4>
                                <p className="text-sm line-clamp-2">{incident.description}</p>
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
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

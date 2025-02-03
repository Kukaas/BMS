import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function IncidentReportGrid({ incidents, getStatusColor }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 p-0 sm:p-2">
            {incidents.map((incident) => (
                <Card key={incident._id} className="sm:min-h-[140px]">
                    <CardHeader className="pb-1 sm:pb-2 p-3 sm:p-4">
                        <CardTitle className="text-base sm:text-lg">{incident.category}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4 pt-0 sm:pt-0">
                        <p className="text-sm text-muted-foreground mb-2">{incident.subCategory}</p>
                        <Badge className={getStatusColor(incident.status)}>{incident.status}</Badge>
                        <div className="mt-2 space-y-1">
                            <p className="text-xs sm:text-sm text-gray-600">
                                Location: {incident.location}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600">
                                Date: {incident.date} at {incident.time}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

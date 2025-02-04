import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function RequestsGridView({ requests, getStatusColor }) {
    return (
        <div className="md:hidden grid gap-4 grid-cols-1 sm:grid-cols-2">
            {requests.map((request) => (
                <Card key={request.id}>
                    <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-semibold">{request.documentType}</h3>
                                <p className="text-sm text-muted-foreground">
                                    Requested on: {new Date(request.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <Badge className={getStatusColor(request.status)}>
                                {request.status || "Pending"}
                            </Badge>
                        </div>
                        <div className="space-y-2 mt-4">
                            <div>
                                <h4 className="font-medium">Purpose</h4>
                                <p className="text-sm">{request.purpose || "N/A"}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

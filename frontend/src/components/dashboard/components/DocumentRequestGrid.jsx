import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function DocumentRequestGrid({ requests, getStatusColor }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {requests.map((request) => (
                <Card key={request.id}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{request.documentType}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Badge className={getStatusColor(request.status)}>
                            {request.status || 'Pending'}
                        </Badge>
                        <p className="mt-2 text-sm text-gray-600">
                            Purpose: {request.purpose || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600">
                            Requested on: {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function DocumentRequestGrid({ requests, getStatusColor }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 p-0 sm:p-2">
            {requests.map((request) => (
                <Card key={request.id} className="sm:min-h-[140px]">
                    <CardHeader className="pb-1 sm:pb-2 p-3 sm:p-4">
                        <CardTitle className="text-base sm:text-lg">
                            {request.documentType}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4 pt-0 sm:pt-0">
                        <Badge className={getStatusColor(request.status)}>
                            {request.status || "Pending"}
                        </Badge>
                        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">
                            Purpose: {request.purpose || "N/A"}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                            Requested on: {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

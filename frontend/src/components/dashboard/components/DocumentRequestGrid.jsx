import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function DocumentRequestGrid({ requests }) {
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "approved":
                return "bg-green-100 text-green-800";
            case "rejected":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {requests.map((request) => (
                <Card key={request.id}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{request.documentType}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                        <p className="mt-2 text-sm text-gray-600">Purpose: {request.purpose}</p>
                        <p className="text-sm text-gray-600">
                            Requested on: {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

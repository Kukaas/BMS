import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const activities = [
    {
        description: "New resident registered",
        timestamp: "2 hours ago",
    },
    {
        description: "Barangay cleanup drive completed",
        timestamp: "1 day ago",
    },
    {
        description: "Community health program launched",
        timestamp: "3 days ago",
    },
    {
        description: "Road repair project started",
        timestamp: "1 week ago",
    },
];

function RecentActivities() {
    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {activities.map((activity, index) => (
                        <div key={index} className="flex items-center">
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">
                                    {activity.description}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {activity.timestamp}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export default RecentActivities;

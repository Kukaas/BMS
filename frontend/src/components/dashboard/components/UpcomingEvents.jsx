import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const events = [
    {
        name: "Barangay Assembly",
        date: "June 15, 2023",
    },
    {
        name: "Youth Sports Festival",
        date: "July 1-3, 2023",
    },
    {
        name: "Senior Citizens' Day",
        date: "July 10, 2023",
    },
];

function UpcomingEvents() {
    return (
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    {events.map((event, index) => (
                        <div key={index} className="flex items-center">
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">{event.name}</p>
                                <p className="text-sm text-muted-foreground">{event.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export default UpcomingEvents;

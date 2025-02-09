import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, } from "lucide-react";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import api from "@/lib/axios";
import { toast } from "sonner";

function formatTime(timeStr) {
    const [hours, minutes] = timeStr.split(':');
    let hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    if (hour > 12) {
        hour -= 12;
    } else if (hour === 0) {
        hour = 12;
    }

    return `${hour}:${minutes} ${period}`;
}

function UpcomingEvents() {
    const { currentUser } = useSelector((state) => state.user);
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchEvents = async () => {
        try {
            setIsLoading(true);
            const response = await api.get(`/upcoming-events/get-upcoming-events/${currentUser.barangay}`);
            if (response.data.success) {
                const currentDate = new Date();
                const upcomingEvents = response.data.upcomingEvents.filter(event => {
                    const eventDate = new Date(event.date);
                    return eventDate >= currentDate;
                });

                upcomingEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
                setEvents(upcomingEvents);
            }
        } catch (error) {
            console.error("Error fetching events:", error);
            toast.error("Failed to fetch events");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [currentUser.barangay]);


    return (
        <Card className="col-span-2 h-[620px] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between bg-gray-50/50 border-b p-6 flex-none">
                <div>
                    <CardTitle className="text-xl">Upcoming Events</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Upcoming events in your barangay
                    </p>
                </div>
            </CardHeader>
            <CardContent className="p-0 overflow-auto flex-1">
                {isLoading ? (
                    <div className="flex justify-center items-center h-48">
                        <div className="animate-pulse space-y-4">
                            <div className="h-4 w-48 bg-gray-200 rounded" />
                            <div className="h-4 w-36 bg-gray-200 rounded" />
                        </div>
                    </div>
                ) : events.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {events.map((event) => (
                            <div
                                key={event._id}
                                className="p-6 hover:bg-gray-50/50 transition-colors space-y-3"
                            >
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {event.title}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {event.description}
                                </p>
                                <div className="flex items-center gap-6 text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        {format(new Date(event.date), "MMMM d, yyyy")}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-gray-400" />
                                        {formatTime(event.time)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-gray-400" />
                                        {event.location}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50" />
                        <p className="mt-4 text-lg font-medium">No upcoming events</p>
                        <p className="text-muted-foreground">Add an event to get started</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default UpcomingEvents;

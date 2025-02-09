import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Home, FileText, Briefcase } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { useSelector } from "react-redux";

function Statistics() {
    const { currentUser } = useSelector((state) => state.user);
    // const [totalUsers, setTotalUsers] = useState(0);
    const [totalReports, setTotalReports] = useState(0);
    const [totalRequests, setTotalRequests] = useState(0);
    const [pendingRequests, setPendingRequests] = useState(0);
    const [loading, setLoading] = useState(true);

    // const fetchTotalUsers = async () => {
    //     try {
    //         const response = await api.get(`/dashboard/users/${currentUser.barangay}`);
    //         if (response.data.users && Array.isArray(response.data.users)) {
    //             setTotalUsers(response.data.users.length);
    //         } else {

    //             console.error("Invalid response format:", response.data);
    //             setTotalUsers(0);
    //         }
    //     } catch (error) {
    //         console.error("Error fetching users:", error);
    //         setTotalUsers(0);
    //     }
    // };

    const fetchTotalReports = async () => {
        try {
            const response = await api.get(`/dashboard/user-reports/${currentUser._id}`);
            if (response.data.success) {
                setTotalReports(response.data.totalReports);
            } else {



                console.error("Invalid response format:", response.data);
                setTotalReports(0);
            }
        } catch (error) {
            console.error("Error fetching total reports:", error);
            setTotalReports(0);
        }
    };

    const fetchTotalRequests = async () => {
        try {
            const response = await api.get(`/dashboard/user-requests/${currentUser._id}`);
            if (response.data.success) {
                setTotalRequests(response.data.totalRequests);



            } else {
                console.error("Invalid response format:", response.data);
                setTotalRequests(0);
            }
        } catch (error) {
            console.error("Error fetching total requests:", error);
            setTotalRequests(0);
        }
    };

    const fetchPendingRequests = async () => {
        try {
            const response = await api.get(`/dashboard/user-pending-requests/${currentUser._id}`);
            if (response.data.success) {
                setPendingRequests(response.data.totalPendingRequests);

            } else {
                console.error("Invalid response format:", response.data);
                setPendingRequests(0);
            }
        } catch (error) {
            console.error("Error fetching pending requests:", error);
            setPendingRequests(0);
        }
    }




    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            if (currentUser?.barangay) {
                await Promise.all([
                    // fetchTotalUsers(),
                    fetchTotalReports(),
                    fetchTotalRequests(),
                    fetchPendingRequests()

                ]);
            }
            setLoading(false);

        };

        fetchData();
    }, [currentUser?.barangay]);

    if (loading) {
        return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                        <div className="h-4 w-4 bg-gray-200 animate-pulse rounded"></div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                    </CardContent>
                </Card>
            ))}
        </div>;
    }

    const stats = [
        // {
        //     title: "Total Users",
        //     value: totalUsers.toLocaleString() || "0",
        //     icon: Users,
        // },
        {
            title: "Total Reports",
            value: totalReports.toLocaleString() || "0",
            icon: Home,
        },
        {
            title: "Pending Requests",
            value: pendingRequests.toLocaleString() || "0",
            icon: FileText,
        },

        {
            title: "Total Requests",
            value: totalRequests.toLocaleString() || "0",
            icon: Briefcase,
        },

    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export default Statistics;

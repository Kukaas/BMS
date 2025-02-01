import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Home, FileText, Briefcase } from "lucide-react";

const stats = [
    {
        title: "Total Population",
        value: "10,482",
        icon: Users,
    },
    {
        title: "Households",
        value: "2,345",
        icon: Home,
    },
    {
        title: "Ongoing Projects",
        value: "7",
        icon: Briefcase,
    },
    {
        title: "Pending Requests",
        value: "23",
        icon: FileText,
    },
];

function Statistics() {
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

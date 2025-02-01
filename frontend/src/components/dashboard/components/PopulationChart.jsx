import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
    {
        name: "0-14",
        total: 2300,
    },
    {
        name: "15-24",
        total: 1800,
    },
    {
        name: "25-54",
        total: 4200,
    },
    {
        name: "55-64",
        total: 1400,
    },
    {
        name: "65+",
        total: 782,
    },
];

function PopulationChart() {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Population by Age Group</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                        />
                        <Bar dataKey="total" fill="#66BB6A" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

export default PopulationChart;

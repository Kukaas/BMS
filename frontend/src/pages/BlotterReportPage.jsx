import { useState, useEffect } from "react";
import BlotterReportForm from "@/components/forms/BlotterReportForm";
import { mockBlotterReports } from "@/components/dashboard/secretary/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function BlotterReportPage() {
    const [showReportForm, setShowReportForm] = useState(false);
    const [blotters, setBlotters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Simulate API call delay
        const timer = setTimeout(() => {
            setBlotters(mockBlotterReports);
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (data, resetForm) => {
        try {
            setIsSubmitting(true);
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Add new blotter to the list
            setBlotters((prev) => [
                {
                    _id: Date.now(),
                    ...data,
                    status: "pending",
                    dateReported: new Date().toISOString().split("T")[0],
                },
                ...prev,
            ]);

            toast.success("Blotter report submitted successfully!");
            resetForm();
            setShowReportForm(false);
        } catch (error) {
            console.error("Error submitting blotter:", error);
            toast.error("Failed to submit blotter report");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-8">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Loading blotter reports...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-2xl font-bold">My Blotter Reports</CardTitle>
                        <Button onClick={() => setShowReportForm(true)}>File New Blotter</Button>
                    </CardHeader>
                    <CardContent>
                        {blotters.length === 0 ? (
                            <p className="text-center text-muted-foreground">
                                No blotter reports found.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {blotters.map((blotter) => (
                                    <div
                                        key={blotter._id}
                                        className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-semibold">
                                                    Case: {blotter.incidentType}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Filed on:{" "}
                                                    {new Date(
                                                        blotter.dateReported
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <Badge
                                                variant={
                                                    blotter.status === "pending"
                                                        ? "warning"
                                                        : blotter.status === "resolved"
                                                          ? "success"
                                                          : "secondary"
                                                }
                                            >
                                                {blotter.status}
                                            </Badge>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                                            <div>
                                                <h4 className="font-medium">Complainant</h4>
                                                <p className="text-sm">{blotter.complainantName}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {blotter.complainantAddress}
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="font-medium">Respondent</h4>
                                                <p className="text-sm">{blotter.respondentName}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {blotter.respondentAddress}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <h4 className="font-medium">Incident Details</h4>
                                            <p className="text-sm mt-1">{blotter.narrative}</p>
                                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                                                <span>Location: {blotter.incidentLocation}</span>
                                                <span>
                                                    Date:{" "}
                                                    {new Date(
                                                        blotter.incidentDate
                                                    ).toLocaleDateString()}
                                                </span>
                                                <span>Time: {blotter.incidentTime}</span>
                                            </div>
                                        </div>
                                        <div className="mt-2 text-sm text-muted-foreground">
                                            <p>Action Requested: {blotter.actionRequested}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {showReportForm && (
                    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
                        <div className="bg-background rounded-lg w-full max-w-4xl my-8 shadow-lg overflow-hidden">
                            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                                <h2 className="text-2xl font-bold">File New Blotter Report</h2>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowReportForm(false)}
                                    className="hover:bg-gray-100 rounded-full h-8 w-8 p-0 flex items-center justify-center"
                                >
                                    <span className="text-lg">×</span>
                                </Button>
                            </div>
                            <div className="max-h-[calc(100vh-12rem)] overflow-y-auto p-6">
                                <BlotterReportForm
                                    onSubmit={handleSubmit}
                                    isSubmitting={isSubmitting}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

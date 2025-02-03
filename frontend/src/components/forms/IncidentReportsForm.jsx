import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { incidentReportSchema } from "./validationSchemas";
import { Loader2 } from "lucide-react";
import { mockIncidentReports } from "@/components/dashboard/secretary/mockData";
import { Badge } from "@/components/ui/badge";

const incidentCategories = {
    "Crime-Related Incidents": [
        "Theft/Burglary",
        "Assault",
        "Vandalism",
        "Illegal Drugs",
        "Trespassing",
        "Scams/Fraud",
    ],
    "Community Disturbances": [
        "Noise Complaints",
        "Public Intoxication",
        "Disorderly Conduct",
        "Curfew Violations",
    ],
    "Environmental & Health Concerns": [
        "Garbage Dumping",
        "Flooding",
        "Health Hazards",
        "Fire Incidents",
    ],
    "Traffic & Road Issues": ["Illegal Parking", "Reckless Driving", "Accidents"],
    "Missing Persons & Lost Items": ["Missing Person", "Lost & Found"],
    "Domestic & Civil Disputes": ["Family Disputes", "Land/Property Issues", "Neighbor Conflicts"],
    "Animal-Related Incidents": ["Stray Animals", "Animal Bites"],
};

const IncidentReportFormContent = ({ onComplete, onCancel }) => {
    const { currentUser } = useSelector((state) => state.user);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm({
        resolver: zodResolver(incidentReportSchema),
        defaultValues: {
            reporterName: currentUser?.name || "",
            location: currentUser?.barangay || "",
        },
    });

    // Update form when user changes
    useEffect(() => {
        if (currentUser) {
            setValue("reporterName", currentUser.name || "");
            setValue("location", currentUser.barangay || "");
        }
    }, [currentUser, setValue]);

    // Use useEffect to handle category changes
    useEffect(() => {
        if (selectedCategory) {
            setValue("category", selectedCategory);
        }
    }, [selectedCategory, setValue]);

    const handleCategoryChange = useCallback((value) => {
        setSelectedCategory(value);
    }, []);

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);

            const requestBody = {
                ...data,
                barangay: currentUser.barangay,
            };

            const response = await axios.post(
                "http://localhost:5000/api/incident-report",
                requestBody,
                {
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 201) {
                toast.success("Incident report submitted successfully!");
                reset();
                setSelectedCategory("");
                onComplete();
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            const errorMessage =
                error.response?.data?.message ||
                "Failed to submit incident report. Please try again.";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="category">Incident Category</Label>
                    <Select onValueChange={handleCategoryChange} value={selectedCategory}>
                        <SelectTrigger id="category">
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.keys(incidentCategories).map((category) => (
                                <SelectItem key={category} value={category}>
                                    {category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.category && (
                        <p className="text-red-500 text-sm">{errors.category.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="subCategory">Sub-category</Label>
                    <Select
                        onValueChange={(value) => setValue("subCategory", value)}
                        disabled={!selectedCategory}
                    >
                        <SelectTrigger id="subCategory">
                            <SelectValue placeholder="Select sub-category" />
                        </SelectTrigger>
                        <SelectContent>
                            {selectedCategory &&
                                incidentCategories[selectedCategory].map((subCategory) => (
                                    <SelectItem key={subCategory} value={subCategory}>
                                        {subCategory}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                    {errors.subCategory && (
                        <p className="text-red-500 text-sm">{errors.subCategory.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="date">Date of Incident</Label>
                    <Input type="date" id="date" {...register("date")} />
                    {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="time">Time of Incident</Label>
                    <Input type="time" id="time" {...register("time")} />
                    {errors.time && <p className="text-red-500 text-sm">{errors.time.message}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="location">Location of Incident</Label>
                    <Input
                        id="location"
                        {...register("location")}
                        placeholder="Enter the incident location"
                        defaultValue={currentUser?.barangay || ""}
                    />
                    {errors.location && (
                        <p className="text-red-500 text-sm">{errors.location.message}</p>
                    )}
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description of Incident</Label>
                    <Textarea
                        id="description"
                        {...register("description")}
                        placeholder="Provide details about the incident"
                        rows={4}
                    />
                    {errors.description && (
                        <p className="text-red-500 text-sm">{errors.description.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="reporterName">Your Name</Label>
                    <Input
                        id="reporterName"
                        {...register("reporterName")}
                        placeholder="Enter your full name"
                        defaultValue={currentUser?.name || ""}
                    />
                    {errors.reporterName && (
                        <p className="text-red-500 text-sm">{errors.reporterName.message}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="reporterContact">Your Contact Information</Label>
                    <Input
                        id="reporterContact"
                        {...register("reporterContact")}
                        placeholder="Enter your phone number or email"
                    />
                    {errors.reporterContact && (
                        <p className="text-red-500 text-sm">{errors.reporterContact.message}</p>
                    )}
                </div>
            </div>
            <div className="flex justify-end space-x-4 pt-6">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        reset();
                        setSelectedCategory("");
                        onCancel();
                    }}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Report"}
                </Button>
            </div>
        </form>
    );
};

export default function IncidentReportForm() {
    const [showReportForm, setShowReportForm] = useState(false);
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API call delay
        const timer = setTimeout(() => {
            setIncidents(mockIncidentReports);
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const handleReportComplete = () => {
        setShowReportForm(false);
        // Refresh the incidents list here when you have the API
    };

    const handleCancel = () => {
        setShowReportForm(false);
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-8">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Loading incidents...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-2xl font-bold">My Incident Reports</CardTitle>
                    <Button onClick={() => setShowReportForm(true)}>Report New Incident</Button>
                </CardHeader>
                <CardContent>
                    {incidents.length === 0 ? (
                        <p className="text-center text-muted-foreground">
                            No incident reports found.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {incidents.map((incident) => (
                                <div
                                    key={incident._id}
                                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-semibold">{incident.category}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {incident.subCategory}
                                            </p>
                                        </div>
                                        <Badge
                                            variant={
                                                incident.status === "pending"
                                                    ? "warning"
                                                    : incident.status === "resolved"
                                                      ? "success"
                                                      : "secondary"
                                            }
                                        >
                                            {incident.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm mb-2">{incident.description}</p>
                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                        <span>Location: {incident.location}</span>
                                        <span>
                                            Date: {new Date(incident.date).toLocaleDateString()}
                                        </span>
                                        <span>Time: {incident.time}</span>
                                    </div>
                                    <div className="mt-2 text-sm text-muted-foreground">
                                        <p>Reported by: {incident.reporterName}</p>
                                        <p>Contact: {incident.reporterContact}</p>
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
                            <h2 className="text-2xl font-bold">Report New Incident</h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleCancel}
                                className="hover:bg-gray-100 rounded-full h-8 w-8 p-0 flex items-center justify-center"
                            >
                                <span className="text-lg">×</span>
                            </Button>
                        </div>
                        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto p-6">
                            <IncidentReportFormContent
                                onComplete={handleReportComplete}
                                onCancel={handleCancel}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

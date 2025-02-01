import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { incidentReportSchema } from "./validationSchemas";
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
import axios from "axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";

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

export default function IncidentReportForm() {
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
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                    Incident Report Form
                </CardTitle>
            </CardHeader>
            <CardContent>
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
                            {errors.date && (
                                <p className="text-red-500 text-sm">{errors.date.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="time">Time of Incident</Label>
                            <Input type="time" id="time" {...register("time")} />
                            {errors.time && (
                                <p className="text-red-500 text-sm">{errors.time.message}</p>
                            )}
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
                                <p className="text-red-500 text-sm">
                                    {errors.reporterName.message}
                                </p>
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
                                <p className="text-red-500 text-sm">
                                    {errors.reporterContact.message}
                                </p>
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
            </CardContent>
        </Card>
    );
}

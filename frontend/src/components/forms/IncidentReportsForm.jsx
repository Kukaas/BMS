import { Button } from "@/components/ui/button";
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
import { incidentReportSchema } from "../../schema/validationSchemas";

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

const getStatusColor = (status) => {
    switch (status) {
        case "New":
            return "bg-blue-500 text-white";
        case "In Progress":
            return "bg-yellow-500 text-white";
        case "Resolved":
            return "bg-green-500 text-white";
        default:
            return "bg-gray-500 text-white";
    }
};

const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const handleDownload = (evidenceFile) => {
    try {
        let base64Data;
        if (evidenceFile.data.startsWith("data:")) {
            base64Data = evidenceFile.data.split(",")[1];
        } else {
            base64Data = evidenceFile.data;
        }

        const byteString = atob(base64Data);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([ab], { type: evidenceFile.contentType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = evidenceFile.filename;
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Download error:", error);
        toast.error("Failed to download file");
    }
};

export function IncidentReportFormContent({ onComplete, onCancel }) {
    const { currentUser } = useSelector((state) => state.user);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm({
        resolver: zodResolver(incidentReportSchema),
        defaultValues: {
            reporterName: currentUser?.name || "",
            location: currentUser?.barangay || "",
            evidenceFile: null,
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

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log("Processing file:", file.name); // Debug log
            const reader = new FileReader();
            reader.onload = () => {
                console.log("File read successfully"); // Debug log
                const fileData = {
                    filename: file.name,
                    contentType: file.type,
                    data: reader.result,
                };
                console.log("Setting file data:", fileData); // Debug log
                setValue("evidenceFile", fileData, { shouldValidate: true });
            };
            reader.onerror = (error) => {
                console.error("Error reading file:", error);
                toast.error("Failed to read file");
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);

            // Include evidenceFile in the request body
            const requestBody = {
                ...data,
                barangay: currentUser.barangay,
                evidenceFile: data.evidenceFile, // Make sure to include the evidence file
            };

            console.log("Submitting data:", requestBody); // Debug log

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
                <div className="space-y-2">
                    <Label htmlFor="evidenceFile">Evidence Image (Optional)</Label>
                    <Input
                        id="evidenceFile"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="cursor-pointer"
                    />
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
}

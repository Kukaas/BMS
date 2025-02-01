import { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { blotterReportSchema } from "./validationSchemas";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PropTypes from "prop-types";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";

export default function BlotterReportForm({ onSubmit, isSubmitting }) {
    const { currentUser } = useSelector((state) => state.user);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm({
        resolver: zodResolver(blotterReportSchema),
        defaultValues: {
            complainantName: currentUser?.name || "",
            complainantAddress: currentUser?.barangay || "",
            complainantGender: "",
            complainantCivilStatus: "",
            actionRequested: "",
        },
    });

    // Update form when user changes
    useEffect(() => {
        if (currentUser) {
            setValue("complainantName", currentUser.name || "");
            setValue("complainantAddress", currentUser.barangay || "");
        }
    }, [currentUser, setValue]);

    // Handle Select changes
    const handleGenderChange = useCallback(
        (value) => {
            setValue("complainantGender", value, { shouldValidate: true });
        },
        [setValue]
    );

    const handleCivilStatusChange = useCallback(
        (value) => {
            setValue("complainantCivilStatus", value, { shouldValidate: true });
        },
        [setValue]
    );

    const handleActionChange = useCallback(
        (value) => {
            setValue("actionRequested", value, { shouldValidate: true });
        },
        [setValue]
    );

    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = reader.result.split(",")[1];
                resolve({
                    filename: file.name,
                    contentType: file.type,
                    data: base64String,
                });
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleFormSubmit = async (data) => {
        try {
            const evidenceFiles = data.evidence ? Array.from(data.evidence) : [];
            const evidenceBase64 = await Promise.all(
                evidenceFiles.map((file) => convertFileToBase64(file))
            );

            // Format the data before submission
            const submitData = {
                // Complainant Information
                complainantName: data.complainantName,
                complainantAge: data.complainantAge?.toString(),
                complainantGender: data.complainantGender,
                complainantCivilStatus: data.complainantCivilStatus,
                complainantAddress: data.complainantAddress,
                complainantContact: data.complainantContact,

                // Respondent Information
                respondentName: data.respondentName,
                respondentAddress: data.respondentAddress || "",
                respondentContact: data.respondentContact || "",

                // Incident Details
                incidentDate: data.incidentDate,
                incidentTime: data.incidentTime,
                incidentLocation: data.incidentLocation,
                incidentType: data.incidentType,
                narrative: data.narrative,
                motive: data.motive || "",

                // Witnesses and Evidence
                witnessName: data.witnessName || "",
                witnessContact: data.witnessContact || "",
                evidence: evidenceBase64,

                // Action Requested
                actionRequested: data.actionRequested,
            };

            console.log("Submitting data:", submitData);

            // Pass the reset function to the parent component
            onSubmit(submitData, () => {
                reset({
                    complainantName: currentUser?.name || "",
                    complainantAddress: currentUser?.barangay || "",
                    complainantGender: "",
                    complainantCivilStatus: "",
                    complainantAge: "",
                    complainantContact: "",
                    respondentName: "",
                    respondentAddress: "",
                    respondentContact: "",
                    incidentDate: "",
                    incidentTime: "",
                    incidentLocation: "",
                    incidentType: "",
                    narrative: "",
                    motive: "",
                    witnessName: "",
                    witnessContact: "",
                    evidence: null,
                    actionRequested: "",
                });
            });
        } catch (error) {
            console.error("Error processing form:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
            {/* Complainant Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Complainant Information</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="complainantName">Full Name</Label>
                        <Input
                            id="complainantName"
                            {...register("complainantName")}
                            defaultValue={currentUser?.name || ""}
                            readOnly
                        />
                        {errors.complainantName && (
                            <p className="text-red-500 text-sm">{errors.complainantName.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="complainantAge">Age</Label>
                        <Input
                            id="complainantAge"
                            type="number"
                            {...register("complainantAge")}
                            placeholder="Enter your age"
                        />
                        {errors.complainantAge && (
                            <p className="text-red-500 text-sm">{errors.complainantAge.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="complainantGender">Gender</Label>
                        <Select
                            onValueChange={handleGenderChange}
                            {...register("complainantGender")}
                        >
                            <SelectTrigger id="complainantGender">
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.complainantGender && (
                            <p className="text-red-500 text-sm">
                                {errors.complainantGender.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="complainantCivilStatus">Civil Status</Label>
                        <Select
                            onValueChange={handleCivilStatusChange}
                            {...register("complainantCivilStatus")}
                        >
                            <SelectTrigger id="complainantCivilStatus">
                                <SelectValue placeholder="Select civil status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Single">Single</SelectItem>
                                <SelectItem value="Married">Married</SelectItem>
                                <SelectItem value="Widowed">Widowed</SelectItem>
                                <SelectItem value="Separated">Separated</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.complainantCivilStatus && (
                            <p className="text-red-500 text-sm">
                                {errors.complainantCivilStatus.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="complainantAddress">Address</Label>
                        <Input
                            id="complainantAddress"
                            {...register("complainantAddress")}
                            defaultValue={currentUser?.barangay || ""}
                            placeholder="Enter your address"
                        />
                        {errors.complainantAddress && (
                            <p className="text-red-500 text-sm">
                                {errors.complainantAddress.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="complainantContact">Contact Number</Label>
                        <Input
                            id="complainantContact"
                            {...register("complainantContact")}
                            placeholder="Enter your contact number"
                        />
                        {errors.complainantContact && (
                            <p className="text-red-500 text-sm">
                                {errors.complainantContact.message}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Respondent Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Respondent Information</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="respondentName">Full Name</Label>
                        <Input
                            id="respondentName"
                            {...register("respondentName")}
                            placeholder="Enter respondent's name"
                        />
                        {errors.respondentName && (
                            <p className="text-red-500 text-sm">{errors.respondentName.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="respondentAddress">Address (if known)</Label>
                        <Input
                            id="respondentAddress"
                            {...register("respondentAddress")}
                            placeholder="Enter respondent's address"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="respondentContact">Contact Number (if known)</Label>
                        <Input
                            id="respondentContact"
                            {...register("respondentContact")}
                            placeholder="Enter respondent's contact"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Incident Details */}
            <Card>
                <CardHeader>
                    <CardTitle>Incident Details</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="incidentDate">Date of Incident</Label>
                        <Input id="incidentDate" type="date" {...register("incidentDate")} />
                        {errors.incidentDate && (
                            <p className="text-red-500 text-sm">{errors.incidentDate.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="incidentTime">Time of Incident</Label>
                        <Input id="incidentTime" type="time" {...register("incidentTime")} />
                        {errors.incidentTime && (
                            <p className="text-red-500 text-sm">{errors.incidentTime.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="incidentLocation">Location</Label>
                        <Input
                            id="incidentLocation"
                            {...register("incidentLocation")}
                            placeholder="Enter incident location"
                        />
                        {errors.incidentLocation && (
                            <p className="text-red-500 text-sm">
                                {errors.incidentLocation.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="incidentType">Type of Incident</Label>
                        <Input
                            id="incidentType"
                            {...register("incidentType")}
                            placeholder="e.g., theft, assault, dispute"
                        />
                        {errors.incidentType && (
                            <p className="text-red-500 text-sm">{errors.incidentType.message}</p>
                        )}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="narrative">Detailed Narrative</Label>
                        <Textarea
                            id="narrative"
                            {...register("narrative")}
                            placeholder="Describe what happened in detail..."
                            className="min-h-[100px]"
                        />
                        {errors.narrative && (
                            <p className="text-red-500 text-sm">{errors.narrative.message}</p>
                        )}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="motive">Possible Motive (Optional)</Label>
                        <Input
                            id="motive"
                            {...register("motive")}
                            placeholder="Enter possible motive"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Witnesses and Evidence */}
            <Card>
                <CardHeader>
                    <CardTitle>Witnesses and Evidence</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="witnessName">Witness Name (if any)</Label>
                        <Input
                            id="witnessName"
                            {...register("witnessName")}
                            placeholder="Enter witness name"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="witnessContact">Witness Contact (if any)</Label>
                        <Input
                            id="witnessContact"
                            {...register("witnessContact")}
                            placeholder="Enter witness contact"
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="evidence">Evidence (Optional)</Label>
                        <Input id="evidence" type="file" {...register("evidence")} multiple />
                    </div>
                </CardContent>
            </Card>

            {/* Action Requested */}
            <Card>
                <CardHeader>
                    <CardTitle>Action Requested</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor="actionRequested">Desired Action</Label>
                        <Select onValueChange={handleActionChange} {...register("actionRequested")}>
                            <SelectTrigger id="actionRequested">
                                <SelectValue placeholder="Select desired action" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Mediation">Mediation</SelectItem>
                                <SelectItem value="Barangay Intervention">
                                    Barangay Intervention
                                </SelectItem>
                                <SelectItem value="Police/Court Action">
                                    Police/Court Action
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.actionRequested && (
                            <p className="text-red-500 text-sm">{errors.actionRequested.message}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Submitting...
                        </>
                    ) : (
                        "Submit Report"
                    )}
                </Button>
            </div>
        </form>
    );
}

BlotterReportForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool,
};

BlotterReportForm.defaultProps = {
    isSubmitting: false,
};

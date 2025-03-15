import { useEffect, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { blotterReportSchema } from "../../schema/validationSchemas";
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
import api from "@/lib/axios";
import { toast } from "sonner";
import { X } from "lucide-react";
import { Phone } from "lucide-react";

export default function BlotterReportForm({ onSubmit, isSubmitting, onCancel }) {
    const { currentUser } = useSelector((state) => state.user);
    const [receiptPreview, setReceiptPreview] = useState(null);
    const [treasurer, setTreasurer] = useState(null);

    const form = useForm({
        resolver: zodResolver(blotterReportSchema),
        defaultValues: {
            complainantName: currentUser?.name || "",
            complainantAddress: currentUser?.barangay || "",
            complainantContact: currentUser?.contactNumber || "",
            complainantGender: "",
            complainantCivilStatus: "",
            complainantAge: "",
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
            evidenceFile: null,
            actionRequested: "Mediation",
            amount: 100,
            paymentMethod: "",
            dateOfPayment: "",
            receipt: null,
            referenceNumber: "",
        },
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        watch,
    } = form;

    const paymentMethod = watch("paymentMethod");

    // Update form when user changes
    useEffect(() => {
        if (currentUser) {
            // Set full name by concatenating firstName, middleName, and lastName
            const fullName =
                `${currentUser.firstName} ${currentUser.middleName ? currentUser.middleName + " " : ""}${currentUser.lastName}`.trim();
            setValue("complainantName", fullName);
            setValue("complainantAddress", currentUser.barangay || "");
            setValue("complainantContact", currentUser.contactNumber || "");
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

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                console.log("File read successfully");
                console.log("File data preview:", reader.result.substring(0, 100) + "...");

                setValue(
                    "evidenceFile",
                    {
                        filename: file.name,
                        contentType: file.type,
                        data: reader.result,
                    },
                    { shouldValidate: true }
                );
            };
            reader.onerror = (error) => {
                console.error("Error reading file:", error);
                toast.error("Failed to read file");
            };
            reader.readAsDataURL(file);
        }
    };

    const handleReceiptChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const receiptData = {
                    filename: file.name,
                    contentType: file.type,
                    data: reader.result,
                };
                setValue("receipt", receiptData);
                setReceiptPreview(reader.result);
                console.log("Receipt data set:", receiptData); // Debug log
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const fetchTreasurer = async () => {
            try {
                const response = await api.get(`/officials/get-officials/${currentUser.barangay}`);
                if (response.data.success) {
                    const treasurerData = response.data.officials.find(
                        (official) => official.position === "Treasurer"
                    );
                    setTreasurer(treasurerData);
                }
            } catch (error) {
                console.error("Error fetching treasurer:", error);
            }
        };
        fetchTreasurer();
    }, [currentUser.barangay]);

    const onFormSubmit = (data) => {
        try {
            // Check if receipt is provided
            if (!data.receipt?.data) {
                toast.error("Please upload a payment receipt");
                return;
            }

            const formattedData = {
                ...data,
                incidentDate: new Date(data.incidentDate).toISOString(),
                dateOfPayment: data.dateOfPayment
                    ? new Date(data.dateOfPayment).toISOString()
                    : new Date().toISOString(),
                amount: 100,
                paymentMethod: data.paymentMethod,
                referenceNumber: data.referenceNumber || undefined,
                name: data.complainantName,
                actionRequested: data.actionRequested || "Mediation",
                // Ensure receipt data is properly structured
                receipt: {
                    filename: data.receipt.filename,
                    contentType: data.receipt.contentType,
                    data: data.receipt.data,
                },
            };

            // Log the formatted data for debugging
            console.log("Submitting data with receipt:", formattedData.receipt);

            onSubmit(formattedData, () => {
                reset();
                setReceiptPreview(null);
            });
        } catch (error) {
            console.error("Error formatting form data:", error);
            toast.error("There was an error preparing your form data. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
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
                        <Label htmlFor="evidenceFile">Evidence File</Label>
                        <Input
                            id="evidenceFile"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="cursor-pointer"
                        />
                        {/* Preview uploaded image */}
                    </div>
                </CardContent>
            </Card>

            {/* Payment Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Payment Information</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount (PHP)</Label>
                        <Input
                            type="number"
                            id="amount"
                            {...register("amount", { valueAsNumber: true })}
                            value="100"
                            readOnly
                            className="bg-gray-50"
                            disabled
                        />
                        <p className="text-sm text-muted-foreground">Fixed processing fee</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="paymentMethod">Payment Method</Label>
                        <Select
                            onValueChange={(value) =>
                                setValue("paymentMethod", value, { shouldValidate: true })
                            }
                            {...register("paymentMethod")}
                        >
                            <SelectTrigger id="paymentMethod">
                                <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Cash">Cash</SelectItem>
                                <SelectItem value="GCash">GCash</SelectItem>
                                <SelectItem value="Paymaya">Paymaya</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.paymentMethod && (
                            <p className="text-red-500 text-sm">{errors.paymentMethod.message}</p>
                        )}
                    </div>

                    {(paymentMethod === "GCash" || paymentMethod === "Paymaya") && treasurer && (
                        <div className="col-span-2">
                            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div className="space-y-2">
                                            <h4 className="font-semibold text-lg text-blue-800">
                                                Send Payment To:
                                            </h4>
                                            <div className="space-y-1">
                                                <p className="text-blue-900 font-medium text-lg">
                                                    {treasurer.name}
                                                </p>
                                                <div className="flex items-center gap-2 text-blue-700">
                                                    <Phone className="h-4 w-4" />
                                                    <p>{treasurer.contactNumber}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-blue-600">
                                                Barangay Treasurer - {currentUser.barangay}
                                            </p>
                                        </div>

                                        {treasurer.qrCode && (
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={treasurer.qrCode}
                                                    alt="Payment QR Code"
                                                    className="w-32 h-32 object-contain"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="dateOfPayment">Date of Payment</Label>
                        <Input type="date" id="dateOfPayment" {...register("dateOfPayment")} />
                        {errors.dateOfPayment && (
                            <p className="text-red-500 text-sm">{errors.dateOfPayment.message}</p>
                        )}
                    </div>

                    {(paymentMethod === "GCash" || paymentMethod === "Paymaya") && (
                        <div className="space-y-2">
                            <Label htmlFor="referenceNumber">Reference Number</Label>
                            <Input
                                type="text"
                                id="referenceNumber"
                                {...register("referenceNumber")}
                                placeholder="Enter reference number"
                            />
                            {errors.referenceNumber && (
                                <p className="text-red-500 text-sm">
                                    {errors.referenceNumber.message}
                                </p>
                            )}
                        </div>
                    )}

                    <div className="space-y-2 col-span-2">
                        <Label htmlFor="receipt" className="flex items-center">
                            Upload Receipt <span className="text-red-500 ml-1">*</span>
                            <span className="text-sm text-muted-foreground ml-2">(Required)</span>
                        </Label>
                        <div
                            className={`relative h-48 border-2 border-dashed rounded-lg p-4 flex items-center justify-center bg-gray-50 ${!receiptPreview && "border-red-300"}`}
                        >
                            <input
                                id="receipt"
                                type="file"
                                accept="image/*"
                                onChange={handleReceiptChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            {receiptPreview ? (
                                <div className="relative w-full h-full">
                                    <img
                                        src={receiptPreview}
                                        alt="Receipt Preview"
                                        className="h-full w-full object-contain"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute -top-2 -right-2 rounded-full p-1.5 shadow-sm hover:bg-red-600 h-7 w-7 flex items-center justify-center"
                                        onClick={() => {
                                            setValue("receipt", null);
                                            setReceiptPreview(null);
                                        }}
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <Label
                                        htmlFor="receipt"
                                        className="text-green-600 cursor-pointer font-medium"
                                    >
                                        Upload Receipt
                                    </Label>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Click or drag and drop your receipt here
                                    </p>
                                    <p className="text-sm text-red-500 mt-1">
                                        A receipt is required for all payment methods
                                    </p>
                                </div>
                            )}
                        </div>
                        {errors.receipt && (
                            <p className="text-red-500 text-sm">{errors.receipt.message}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-4 mt-6">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <div className="flex items-center gap-2">
                            <span className="animate-spin">⏳</span> Submitting...
                        </div>
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
    onCancel: PropTypes.func.isRequired,
};

BlotterReportForm.defaultProps = {
    isSubmitting: false,
};

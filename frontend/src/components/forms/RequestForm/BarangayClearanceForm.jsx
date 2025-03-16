import { useEffect, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { barangayClearanceSchema } from "../../../schema/validationSchemas";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { X, Phone, QrCode } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function BarangayClearanceForm({ onSubmit, initialData, onDataChange }) {
    const { currentUser } = useSelector((state) => state.user);
    const [treasurer, setTreasurer] = useState(null);
    const [receiptPreview, setReceiptPreview] = useState(null);

    // Move the function definition before it's used
    const getAmountByBarangay = (barangay) => {
        const higherFeeBarangays = ["Antipolo", "Dili", "Pangi", "Bangbang", "Tapuyan", "Masiga"];
        return higherFeeBarangays.includes(barangay) ? 100 : 50;
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm({
        resolver: zodResolver(barangayClearanceSchema),
        defaultValues: {
            userId: currentUser?._id || "",
            firstName: currentUser?.firstName || "",
            middleName: currentUser?.middleName || "",
            lastName: currentUser?.lastName || "",
            email: currentUser?.email || "",
            contactNumber: currentUser?.contactNumber || "",
            barangay: currentUser?.barangay || "",
            dateOfBirth: currentUser?.dateOfBirth || "",
            sex: currentUser?.sex || "",
            age: currentUser?.age || "",
            purpose: initialData?.purpose || "",
            purok: currentUser?.purok || "",
            placeOfBirth: "",
            civilStatus: "",
            paymentMethod: "",
            dateOfPayment: "",
            amount: getAmountByBarangay(currentUser?.barangay),
            name: `${currentUser?.firstName || ""} ${currentUser?.middleName ? currentUser?.middleName + " " : ""}${currentUser?.lastName || ""}`.trim(),
        },
    });

    const paymentMethod = watch("paymentMethod");

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

    // Watch form values and notify parent component of changes
    const formValues = watch();
    useEffect(() => {
        onDataChange?.(formValues);
    }, [formValues, onDataChange]);

    // Calculate age from date of birth
    useEffect(() => {
        if (currentUser?.dateOfBirth) {
            const dob = new Date(currentUser.dateOfBirth);
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            const m = today.getMonth() - dob.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                age--;
            }
            setValue("age", age);
        }
    }, [currentUser?.dateOfBirth, setValue]);

    // Update form when user changes
    useEffect(() => {
        if (currentUser) {
            setValue("userId", currentUser._id || "");
            setValue("firstName", currentUser.firstName || "");
            setValue("middleName", currentUser.middleName || "");
            setValue("lastName", currentUser.lastName || "");
            setValue("email", currentUser.email || "");
            setValue("contactNumber", currentUser.contactNumber || "");
            setValue("barangay", currentUser.barangay || "");
            setValue("dateOfBirth", currentUser.dateOfBirth || "");
            setValue("sex", currentUser.sex || "");
            setValue("purok", currentUser.purok || "");
            setValue(
                "name",
                `${currentUser.firstName || ""} ${currentUser.middleName ? currentUser.middleName + " " : ""}${currentUser.lastName || ""}`.trim()
            );
        }
    }, [currentUser, setValue]);

    const handleFormSubmit = async (data) => {
        try {
            // Add auto-generated fields
            const formData = {
                ...data,
                userId: currentUser._id,
                name: `${currentUser.firstName} ${currentUser.middleName ? currentUser.middleName + " " : ""}${currentUser.lastName}`.trim(),
                firstName: currentUser.firstName,
                middleName: currentUser.middleName,
                lastName: currentUser.lastName,
                email: currentUser.email,
                contactNumber: currentUser.contactNumber,
                barangay: currentUser.barangay,
                purok: currentUser.purok,
                dateOfBirth: currentUser.dateOfBirth,
                age: currentUser.age || data.age,
                sex: currentUser.sex || data.sex,
            };
            await onSubmit(formData, "barangay-clearance");
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    const handlePurposeChange = useCallback(
        (value) => {
            setValue("purpose", value, { shouldValidate: true });
        },
        [setValue]
    );

    const handleCivilStatusChange = useCallback(
        (value) => {
            setValue("civilStatus", value, { shouldValidate: true });
        },
        [setValue]
    );

    const handleSexChange = useCallback(
        (value) => {
            setValue("sex", value, { shouldValidate: true });
        },
        [setValue]
    );

    // Add new callback for purok change
    const handlePurokChange = useCallback(
        (value) => {
            setValue("purok", value, { shouldValidate: true });
        },
        [setValue]
    );

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setValue("receipt", {
                    filename: file.name,
                    contentType: file.type,
                    data: reader.result,
                });
                setReceiptPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <form id="document-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Hidden fields */}
            <div className="hidden">
                <input type="hidden" {...register("userId")} />
                <input type="hidden" {...register("email")} />
                <input type="hidden" {...register("contactNumber")} />
                <input type="hidden" {...register("barangay")} />
                <input type="hidden" {...register("dateOfBirth")} />
            </div>

            {/* Personal Information Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Name Fields */}
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                            id="firstName"
                            {...register("firstName")}
                            defaultValue={currentUser?.firstName || ""}
                            readOnly
                        />
                        {errors.firstName && (
                            <p className="text-red-500 text-sm">{errors.firstName.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="middleName">Middle Name</Label>
                        <Input
                            id="middleName"
                            {...register("middleName")}
                            defaultValue={currentUser?.middleName || ""}
                            readOnly
                        />
                        {errors.middleName && (
                            <p className="text-red-500 text-sm">{errors.middleName.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                            id="lastName"
                            {...register("lastName")}
                            defaultValue={currentUser?.lastName || ""}
                            readOnly
                        />
                        {errors.lastName && (
                            <p className="text-red-500 text-sm">{errors.lastName.message}</p>
                        )}
                    </div>

                    {/* Age */}
                    <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                            id="age"
                            type="number"
                            {...register("age", { valueAsNumber: true })}
                        />
                        {errors.age && <p className="text-red-500 text-sm">{errors.age.message}</p>}
                    </div>

                    {/* Sex */}
                    <div className="space-y-2">
                        <Label htmlFor="sex">Sex</Label>
                        <Select onValueChange={handleSexChange}>
                            <SelectTrigger id="sex">
                                <SelectValue placeholder="Select sex" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.sex && <p className="text-red-500 text-sm">{errors.sex.message}</p>}
                    </div>

                    {/* Civil Status */}
                    <div className="space-y-2">
                        <Label htmlFor="civilStatus">Civil Status</Label>
                        <Select onValueChange={handleCivilStatusChange}>
                            <SelectTrigger id="civilStatus">
                                <SelectValue placeholder="Select civil status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Single">Single</SelectItem>
                                <SelectItem value="Married">Married</SelectItem>
                                <SelectItem value="Widowed">Widowed</SelectItem>
                                <SelectItem value="Separated">Separated</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.civilStatus && (
                            <p className="text-red-500 text-sm">{errors.civilStatus.message}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Address Information Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Address Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Purok */}
                    <div className="space-y-2">
                        <Label htmlFor="purok">Purok</Label>
                        <Input
                            id="purok"
                            value={currentUser?.purok || ""}
                            {...register("purok")}
                            readOnly
                        />
                        {errors.purok && (
                            <p className="text-red-500 text-sm">{errors.purok.message}</p>
                        )}
                    </div>

                    {/* Place of Birth */}
                    <div className="space-y-2">
                        <Label htmlFor="placeOfBirth">Place of Birth</Label>
                        <Input id="placeOfBirth" {...register("placeOfBirth")} />
                        {errors.placeOfBirth && (
                            <p className="text-red-500 text-sm">{errors.placeOfBirth.message}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Purpose Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Request Details</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="purpose">Purpose</Label>
                        <Select
                            onValueChange={handlePurposeChange}
                            defaultValue={initialData?.purpose}
                        >
                            <SelectTrigger id="purpose">
                                <SelectValue placeholder="Select purpose" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Employment">Employment</SelectItem>
                                <SelectItem value="Business">Business</SelectItem>
                                <SelectItem value="Travel">Travel</SelectItem>
                                <SelectItem value="Identification">Identification</SelectItem>
                                <SelectItem value="Permit">Permit</SelectItem>
                                <SelectItem value="Legal">Legal</SelectItem>
                                <SelectItem value="Residency">Residency</SelectItem>
                                <SelectItem value="Banking">Banking</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.purpose && (
                            <p className="text-red-500 text-sm">{errors.purpose.message}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Payment Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Payment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount (PHP)</Label>
                        <Input
                            type="number"
                            id="amount"
                            {...register("amount", { valueAsNumber: true })}
                            value={getAmountByBarangay(currentUser?.barangay)}
                            readOnly
                            className="bg-gray-50"
                            disabled
                        />
                        <p className="text-sm text-muted-foreground">
                            Processing fee for {currentUser?.barangay}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="paymentMethod">Payment Method</Label>
                        <Select onValueChange={(value) => setValue("paymentMethod", value)}>
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

                    {paymentMethod === "Cash" && treasurer && (
                        <div className="col-span-1 md:col-span-2">
                            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                                <CardContent className="p-6">
                                    <div className="flex flex-col gap-4">
                                        <div className="space-y-3">
                                            <h4 className="font-semibold text-lg text-blue-800">
                                                Cash Payment Instructions:
                                            </h4>
                                            <div className="space-y-2">
                                                <p className="text-blue-900">
                                                    Please visit the Barangay Treasurer of{" "}
                                                    {currentUser.barangay} to make your payment:
                                                </p>
                                                <p className="text-blue-900 font-medium text-lg">
                                                    {treasurer.name}
                                                </p>
                                                <p className="text-sm text-blue-600">
                                                    Barangay Treasurer
                                                </p>
                                            </div>
                                            <div className="pt-3 border-t border-blue-100">
                                                <p className="text-lg font-semibold text-blue-800">
                                                    Amount to Pay:
                                                    <span className="ml-2 text-xl text-blue-900">
                                                        ₱
                                                        {getAmountByBarangay(currentUser?.barangay)}
                                                        .00
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {(paymentMethod === "GCash" || paymentMethod === "Paymaya") && treasurer && (
                        <div className="col-span-1 md:col-span-2">
                            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                                <CardContent className="p-6">
                                    <div className="flex flex-col gap-6">
                                        <div className="space-y-3">
                                            <h4 className="font-semibold text-lg text-blue-800">
                                                {paymentMethod} Payment Instructions:
                                            </h4>
                                            <div className="space-y-2">
                                                <p className="text-blue-900">
                                                    Please send your payment to the Barangay
                                                    Treasurer of {currentUser.barangay}:
                                                </p>
                                                <p className="text-blue-900 font-medium text-lg">
                                                    {treasurer.name}
                                                </p>
                                                <div className="flex items-center gap-2 text-blue-700">
                                                    <Phone className="h-4 w-4" />
                                                    <p>{treasurer.contactNumber}</p>
                                                </div>
                                                <div className="pt-3 border-t border-blue-100">
                                                    <p className="text-lg font-semibold text-blue-800">
                                                        Amount to Send:
                                                        <span className="ml-2 text-xl text-blue-900">
                                                            ₱
                                                            {getAmountByBarangay(
                                                                currentUser?.barangay
                                                            )}
                                                            .00
                                                        </span>
                                                    </p>
                                                </div>
                                                <div className="mt-4 space-y-2">
                                                    <p className="text-blue-800 font-medium">
                                                        Steps:
                                                    </p>
                                                    <ol className="list-decimal list-inside space-y-1 text-blue-700">
                                                        <li>Open your {paymentMethod} app</li>
                                                        <li>
                                                            Send the exact amount to the number
                                                            above
                                                        </li>
                                                        <li>
                                                            Take a screenshot of the payment
                                                            confirmation
                                                        </li>
                                                        <li>
                                                            Upload the screenshot below as your
                                                            receipt
                                                        </li>
                                                    </ol>
                                                </div>
                                            </div>
                                        </div>

                                        {treasurer.qrCode && (
                                            <div className="flex flex-col items-center gap-2">
                                                <p className="text-blue-800 font-medium">
                                                    Or scan QR code:
                                                </p>
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

                    <div className="col-span-1 md:col-span-2">
                        <Label htmlFor="receipt">Upload Receipt</Label>
                        <div className="relative h-48 border-2 border-dashed rounded-lg p-4 flex items-center justify-center bg-gray-50">
                            <input
                                id="receipt"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
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
                                </div>
                            )}
                        </div>
                        {errors.receipt && (
                            <p className="text-red-500 text-sm">{errors.receipt.message}</p>
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
}

BarangayClearanceForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    initialData: PropTypes.object,
    onDataChange: PropTypes.func,
};

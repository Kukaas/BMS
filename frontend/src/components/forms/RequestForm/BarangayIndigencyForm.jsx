import { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { barangayIndigencySchema } from "../../../schema/validationSchemas";
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

export default function BarangayIndigencyForm({ onSubmit, initialData, onDataChange }) {
    const { currentUser } = useSelector((state) => state.user);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm({
        resolver: zodResolver(barangayIndigencySchema),
        defaultValues: {
            userId: currentUser?._id || "",
            firstName: currentUser?.firstName || "",
            middleName: currentUser?.middleName || "",
            lastName: currentUser?.lastName || "",
            email: currentUser?.email || "",
            contactNumber: currentUser?.contactNumber || "",
            barangay: currentUser?.barangay || "",
            purok: currentUser?.purok || "",
            dateOfBirth: currentUser?.dateOfBirth || "",
            purpose: initialData?.purpose || "",
            name: `${currentUser?.firstName || ""} ${currentUser?.middleName ? currentUser?.middleName + " " : ""}${currentUser?.lastName || ""}`.trim(),
        },
    });

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
            setValue("purok", currentUser.purok || "");
            setValue(
                "name",
                `${currentUser.firstName || ""} ${currentUser.middleName ? currentUser.middleName + " " : ""}${currentUser.lastName || ""}`.trim()
            );
        }
    }, [currentUser, setValue]);

    const handleFormSubmit = (data) => {
        onSubmit(
            {
                ...data,
                userId: currentUser._id,
                name: `${currentUser.firstName} ${currentUser.middleName ? currentUser.middleName + " " : ""}${currentUser.lastName}`.trim(),
                email: currentUser.email,
                contactNumber: currentUser.contactNumber,
                barangay: currentUser.barangay,
                purok: currentUser.purok,
                type: "Barangay Indigency",
            },
            "barangay-indigency"
        );
    };

    const handlePurposeChange = useCallback(
        (value) => {
            setValue("purpose", value, { shouldValidate: true });
        },
        [setValue]
    );

    return (
        <form id="document-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Hidden fields */}
            <div className="hidden">
                <input type="hidden" {...register("userId")} />
                <input type="hidden" {...register("email")} />
                <input type="hidden" {...register("contactNumber")} />
                <input type="hidden" {...register("barangay")} />
                <input type="hidden" {...register("purok")} />
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
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="middleName">Middle Name</Label>
                        <Input
                            id="middleName"
                            {...register("middleName")}
                            defaultValue={currentUser?.middleName || ""}
                            readOnly
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                            id="lastName"
                            {...register("lastName")}
                            defaultValue={currentUser?.lastName || ""}
                            readOnly
                        />
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
                </div>
            </div>

            {/* Purpose Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Request Details</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="purpose">Purpose</Label>
                        <Select onValueChange={handlePurposeChange}>
                            <SelectTrigger id="purpose">
                                <SelectValue placeholder="Select purpose" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Medical Assistance">
                                    Medical Assistance
                                </SelectItem>
                                <SelectItem value="Financial Assistance">
                                    Financial Assistance
                                </SelectItem>
                                <SelectItem value="Food Assistance">Food Assistance</SelectItem>
                                <SelectItem value="Burial Assistance">Burial Assistance</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.purpose && (
                            <p className="text-red-500 text-sm">{errors.purpose.message}</p>
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
}

BarangayIndigencyForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    initialData: PropTypes.object,
    onDataChange: PropTypes.func,
};

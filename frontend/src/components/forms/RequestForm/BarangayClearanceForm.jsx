import { useEffect, useCallback } from "react";
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

export default function BarangayClearanceForm({ onSubmit, initialData, onDataChange }) {
    const { currentUser } = useSelector((state) => state.user);

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
            name: currentUser?.name || "",
            email: currentUser?.email || "",
            barangay: currentUser?.barangay || "",
            purpose: initialData?.purpose || "",
            contactNumber: currentUser?.contactNumber || "",
            dateOfBirth: currentUser?.dateOfBirth?.split("T")[0] || "",
        },
    });

    // Watch form values and notify parent component of changes
    const formValues = watch();
    useEffect(() => {
        onDataChange?.(formValues);
    }, [formValues, onDataChange]);

    // Update form when user changes
    useEffect(() => {
        if (currentUser) {
            setValue("userId", currentUser._id || "");
            setValue("name", currentUser.name || "");
            setValue("email", currentUser.email || "");
            setValue("barangay", currentUser.barangay || "");
            setValue("contactNumber", currentUser.contactNumber || "");
            setValue("dateOfBirth", currentUser.dateOfBirth?.split("T")[0] || "");
        }
    }, [currentUser, setValue]);

    const handleFormSubmit = (data) => {
        console.log("Submitting clearance form with data:", data);
        onSubmit(
            {
                ...data,
                userId: currentUser._id,
                email: currentUser.email,
            },
            "barangay-clearance"
        );
    };

    const handlePurposeChange = useCallback(
        (value) => {
            setValue("purpose", value);
        },
        [setValue]
    );

    return (
        <form id="document-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                {/* Hidden fields for userId and email */}
                <input type="hidden" {...register("userId")} />
                <input type="hidden" {...register("email")} />

                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        {...register("name")}
                        defaultValue={currentUser?.name || ""}
                        readOnly
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="barangay">Barangay</Label>
                    <Input
                        id="barangay"
                        {...register("barangay")}
                        defaultValue={currentUser?.barangay || ""}
                        readOnly
                    />
                    {errors.barangay && (
                        <p className="text-red-500 text-sm">{errors.barangay.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="purpose">Purpose</Label>
                    <Select onValueChange={handlePurposeChange}>
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

                <div className="space-y-2">
                    <Label htmlFor="contactNumber">Contact Number</Label>
                    <Input
                        id="contactNumber"
                        type="tel"
                        {...register("contactNumber")}
                        placeholder="Enter your contact number"
                    />
                    {errors.contactNumber && (
                        <p className="text-red-500 text-sm">{errors.contactNumber.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                        id="dateOfBirth"
                        type="date"
                        {...register("dateOfBirth")}
                        defaultValue={currentUser?.dateOfBirth?.split("T")[0] || ""}
                        readOnly
                        className="h-11 bg-gray-50"
                    />
                    {errors.dateOfBirth && (
                        <p className="text-red-500 text-sm">{errors.dateOfBirth.message}</p>
                    )}
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

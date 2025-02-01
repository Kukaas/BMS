import { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cedulaSchema } from "../validationSchemas";
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

export default function CedulaForm({ onSubmit, initialData, onDataChange }) {
    const { currentUser } = useSelector((state) => state.user);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm({
        resolver: zodResolver(cedulaSchema),
        defaultValues: {
            name: currentUser?.name || "",
            barangay: currentUser?.barangay || "",
            dateOfBirth: initialData?.dateOfBirth || "",
            placeOfBirth: initialData?.placeOfBirth || "",
            civilStatus: initialData?.civilStatus || "",
            occupation: initialData?.occupation || "",
            employerName: initialData?.employerName || "",
            employerAddress: initialData?.employerAddress || "",
            tax: initialData?.tax || "",
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
            setValue("name", currentUser.name || "");
            setValue("barangay", currentUser.barangay || "");
        }
    }, [currentUser, setValue]);

    const handleCivilStatusChange = useCallback(
        (value) => {
            setValue("civilStatus", value);
        },
        [setValue]
    );

    const handleFormSubmit = (data) => {
        console.log("CedulaForm - Submitting data:", data);
        onSubmit(data, "cedula");
    };

    return (
        <form id="document-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                {/* Personal Information */}
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
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
                    {errors.dateOfBirth && (
                        <p className="text-red-500 text-sm">{errors.dateOfBirth.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="placeOfBirth">Place of Birth</Label>
                    <Input
                        id="placeOfBirth"
                        {...register("placeOfBirth")}
                        placeholder="Enter place of birth"
                    />
                    {errors.placeOfBirth && (
                        <p className="text-red-500 text-sm">{errors.placeOfBirth.message}</p>
                    )}
                </div>

                {/* Address Information */}
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

                {/* Personal Details */}
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

                {/* Employment Information */}
                <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                        id="occupation"
                        {...register("occupation")}
                        placeholder="Enter occupation"
                    />
                    {errors.occupation && (
                        <p className="text-red-500 text-sm">{errors.occupation.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="employerName">Employer Name (if employed)</Label>
                    <Input
                        id="employerName"
                        {...register("employerName")}
                        placeholder="Enter employer name"
                    />
                    {errors.employerName && (
                        <p className="text-red-500 text-sm">{errors.employerName.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="employerAddress">Employer Address</Label>
                    <Input
                        id="employerAddress"
                        {...register("employerAddress")}
                        placeholder="Enter employer address"
                    />
                    {errors.employerAddress && (
                        <p className="text-red-500 text-sm">{errors.employerAddress.message}</p>
                    )}
                </div>

                {/* Tax Information */}
                <div className="space-y-2">
                    <Label htmlFor="tax">Tax Amount</Label>
                    <Input
                        id="tax"
                        type="number"
                        step="0.01"
                        {...register("tax")}
                        placeholder="Enter tax amount"
                    />
                    {errors.tax && <p className="text-red-500 text-sm">{errors.tax.message}</p>}
                </div>
            </div>
        </form>
    );
}

CedulaForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    initialData: PropTypes.object,
    onDataChange: PropTypes.func,
};

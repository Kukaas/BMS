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
            name: currentUser?.name || "",
            email: currentUser?.email || "",
            barangay: currentUser?.barangay || "",
            contactNumber: currentUser?.contactNumber || "",
            purpose: initialData?.purpose || "",
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
        }
    }, [currentUser, setValue]);

    const handlePurposeChange = useCallback(
        (value) => {
            setValue("purpose", value);
        },
        [setValue]
    );

    const handleFormSubmit = (data) => {
        console.log("Submitting indigency form with data:", data);
        onSubmit(
            {
                ...data,
                userId: currentUser._id,
                email: currentUser.email,
            },
            "barangay-indigency"
        );
    };

    return (
        <form id="document-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <input type="hidden" {...register("userId")} />
                <input type="hidden" {...register("email")} />
                <input type="hidden" {...register("barangay")} />
                <input type="hidden" {...register("contactNumber")} />

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
                    <Label htmlFor="purpose">Purpose</Label>
                    <Select onValueChange={handlePurposeChange}>
                        <SelectTrigger id="purpose">
                            <SelectValue placeholder="Select purpose" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Medical Assistance">Medical Assistance</SelectItem>
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
        </form>
    );
}

BarangayIndigencyForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    initialData: PropTypes.object,
    onDataChange: PropTypes.func,
};

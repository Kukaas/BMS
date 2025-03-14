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
            firstName: currentUser?.firstName || "",
            middleName: currentUser?.middleName || "",
            lastName: currentUser?.lastName || "",
            email: currentUser?.email || "",
            contactNumber: currentUser?.contactNumber || "",
            barangay: currentUser?.barangay || "",
            dateOfBirth: currentUser?.dateOfBirth || "",
            sex: currentUser?.sex || "",
            purpose: initialData?.purpose || "",
            purok: currentUser?.purok || "",
            placeOfBirth: "",
            civilStatus: "",
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
            setValue("dateOfBirth", currentUser.dateOfBirth || "");
            setValue("sex", currentUser.sex || "");
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
                type: "Barangay Clearance",
            },
            "barangay-clearance"
        );
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
        </form>
    );
}

BarangayClearanceForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    initialData: PropTypes.object,
    onDataChange: PropTypes.func,
};

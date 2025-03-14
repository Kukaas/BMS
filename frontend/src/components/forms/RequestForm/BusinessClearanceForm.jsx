import { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { businessClearanceSchema } from "../../../schema/validationSchemas";
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

export default function BusinessClearanceForm({ onSubmit, initialData, onDataChange }) {
    const { currentUser } = useSelector((state) => state.user);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm({
        resolver: zodResolver(businessClearanceSchema),
        defaultValues: {
            userId: currentUser?._id || "",
            firstName: currentUser?.firstName || "",
            middleName: currentUser?.middleName || "",
            lastName: currentUser?.lastName || "",
            email: currentUser?.email || "",
            contactNumber: currentUser?.contactNumber || "",
            barangay: currentUser?.barangay || "",
            purok: currentUser?.purok || "",
            businessName: initialData?.businessName || "",
            businessType: initialData?.businessType || "",
            businessNature: initialData?.businessNature || "",
            ownerName:
                `${currentUser?.firstName || ""} ${currentUser?.middleName ? currentUser?.middleName + " " : ""}${currentUser?.lastName || ""}`.trim(),
            dtiSecRegistration: initialData?.dtiSecRegistration || "",
            mayorsPermit: initialData?.mayorsPermit || "",
            leaseContract: initialData?.leaseContract || "",
            barangayClearance: initialData?.barangayClearance || "",
            fireSafetyCertificate: initialData?.fireSafetyCertificate || "",
            sanitaryPermit: initialData?.sanitaryPermit || "",
            validId: initialData?.validId || "",
        },
    });

    // Watch form values and notify parent component of changes
    const formValues = watch();
    useEffect(() => {
        if (formValues) {
            onDataChange?.(formValues);
        }
    }, [formValues, onDataChange]);

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
                "ownerName",
                `${currentUser.firstName || ""} ${currentUser.middleName ? currentUser.middleName + " " : ""}${currentUser.lastName || ""}`.trim()
            );
        }
    }, [currentUser, setValue]);

    // Handle business nature selection
    const handleBusinessNatureChange = useCallback(
        (value) => {
            setValue("businessNature", value);
        },
        [setValue]
    );

    // Set initial values when form loads or initialData changes
    useEffect(() => {
        if (initialData) {
            Object.keys(initialData).forEach((key) => {
                setValue(key, initialData[key]);
            });
        }
    }, [initialData, setValue]);

    const handleFormSubmit = (data) => {
        console.log("Submitting business clearance form with data:", data);
        onSubmit(
            {
                ...data,
                userId: currentUser._id,
                ownerName:
                    `${currentUser.firstName} ${currentUser.middleName ? currentUser.middleName + " " : ""}${currentUser.lastName}`.trim(),
                email: currentUser.email,
                contactNumber: currentUser.contactNumber,
                barangay: currentUser.barangay,
                purok: currentUser.purok,
                type: "Business Clearance",
            },
            "business-clearance"
        );
    };

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
                </div>
            </div>

            {/* Business Information Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium">Business Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input
                            id="businessName"
                            {...register("businessName")}
                            placeholder="Enter business name"
                        />
                        {errors.businessName && (
                            <p className="text-red-500 text-sm">{errors.businessName.message}</p>
                        )}
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
                        <Label htmlFor="municipality">Municipality</Label>
                        <Input
                            id="municipality"
                            {...register("municipality")}
                            placeholder="Enter municipality"
                        />
                        {errors.municipality && (
                            <p className="text-red-500 text-sm">{errors.municipality.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="province">Province</Label>
                        <Input
                            id="province"
                            {...register("province")}
                            placeholder="Enter province"
                        />
                        {errors.province && (
                            <p className="text-red-500 text-sm">{errors.province.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="businessType">Type of Business</Label>
                        <Input
                            id="businessType"
                            {...register("businessType")}
                            placeholder="e.g., retail, food service"
                        />
                        {errors.businessType && (
                            <p className="text-red-500 text-sm">{errors.businessType.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="businessNature">Nature of Business</Label>
                        <Select
                            onValueChange={handleBusinessNatureChange}
                            defaultValue={initialData?.businessNature}
                        >
                            <SelectTrigger id="businessNature">
                                <SelectValue placeholder="Select business nature" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Single Proprietorship">
                                    Single Proprietorship
                                </SelectItem>
                                <SelectItem value="Partnership">Partnership</SelectItem>
                                <SelectItem value="Corporation">Corporation</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.businessNature && (
                            <p className="text-red-500 text-sm">{errors.businessNature.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="ownerAddress">Business Owner&apos;s Address</Label>
                        <Input
                            id="ownerAddress"
                            {...register("ownerAddress")}
                            placeholder="Enter owner's address"
                        />
                        {errors.ownerAddress && (
                            <p className="text-red-500 text-sm">{errors.ownerAddress.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contactNumber">Contact Number</Label>
                        <Input
                            id="contactNumber"
                            type="tel"
                            {...register("contactNumber")}
                            placeholder="Enter contact number"
                        />
                        {errors.contactNumber && (
                            <p className="text-red-500 text-sm">{errors.contactNumber.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dtiSecRegistration">DTI/SEC Registration Number</Label>
                        <Input
                            id="dtiSecRegistration"
                            {...register("dtiSecRegistration")}
                            placeholder="Enter registration number"
                        />
                        {errors.dtiSecRegistration && (
                            <p className="text-red-500 text-sm">
                                {errors.dtiSecRegistration.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="mayorsPermit">Mayor&apos;s Permit (if renewing)</Label>
                        <Input
                            id="mayorsPermit"
                            {...register("mayorsPermit")}
                            placeholder="Enter permit number"
                        />
                        {errors.mayorsPermit && (
                            <p className="text-red-500 text-sm">{errors.mayorsPermit.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="leaseContract">Lease Contract/Land Title Number</Label>
                        <Input
                            id="leaseContract"
                            {...register("leaseContract")}
                            placeholder="Enter contract/title number"
                        />
                        {errors.leaseContract && (
                            <p className="text-red-500 text-sm">{errors.leaseContract.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="barangayClearance">Barangay Clearance Number</Label>
                        <Input
                            id="barangayClearance"
                            {...register("barangayClearance")}
                            placeholder="Enter clearance number"
                        />
                        {errors.barangayClearance && (
                            <p className="text-red-500 text-sm">
                                {errors.barangayClearance.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fireSafetyCertificate">
                            Fire Safety Certificate (if applicable)
                        </Label>
                        <Input
                            id="fireSafetyCertificate"
                            {...register("fireSafetyCertificate")}
                            placeholder="Enter certificate number"
                        />
                        {errors.fireSafetyCertificate && (
                            <p className="text-red-500 text-sm">
                                {errors.fireSafetyCertificate.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="sanitaryPermit">
                            Sanitary Permit (for food businesses)
                        </Label>
                        <Input
                            id="sanitaryPermit"
                            {...register("sanitaryPermit")}
                            placeholder="Enter permit number"
                        />
                        {errors.sanitaryPermit && (
                            <p className="text-red-500 text-sm">{errors.sanitaryPermit.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="validId">Valid Government ID Number</Label>
                        <Input
                            id="validId"
                            {...register("validId")}
                            placeholder="Enter ID number"
                        />
                        {errors.validId && (
                            <p className="text-red-500 text-sm">{errors.validId.message}</p>
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
}

BusinessClearanceForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    initialData: PropTypes.object,
    onDataChange: PropTypes.func,
};

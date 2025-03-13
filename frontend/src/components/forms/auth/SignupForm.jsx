// Third-party libraries
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { X } from "lucide-react";

// Components and UI elements
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";

// Utilities
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const schema = z
    .object({
        firstName: z.string().min(2, "First name must be at least 2 characters"),
        middleName: z.string().optional(),
        lastName: z.string().min(2, "Last name must be at least 2 characters"),
        validId: z.object({
            front: z.object({
                filename: z.string().min(1, "Front ID is required"),
                contentType: z.string().min(1, "Front ID is required"),
                data: z.string().min(1, "Front ID is required"),
            }),
            back: z.object({
                filename: z.string().min(1, "Back ID is required"),
                contentType: z.string().min(1, "Back ID is required"),
                data: z.string().min(1, "Back ID is required"),
            }),
        }),
        contactNumber: z.string().min(10, {
            message: "Contact number must be at least 10 characters.",
        }),
        dateOfBirth: z.string(),
        barangay: z.string().min(2, {
            message: "Address must be at least 2 characters.",
        }),
        purok: z
            .string()
            .min(1, "Purok is required")
            .regex(/^Purok\s\d+$/i, "Must be in format 'Purok [number]'"),
        email: z.string().email("Invalid email address."),
        password: z.string().min(8, {
            message: "Password must be at least 8 characters.",
        }),
        confirmPassword: z.string().min(8),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export function SignupForm({ className }) {
    const [loading, setLoading] = useState(false);
    const [barangays, setBarangays] = useState([]);
    const [currentStep, setCurrentStep] = useState(1);
    const [frontIdPreview, setFrontIdPreview] = useState(null);
    const [backIdPreview, setBackIdPreview] = useState(null);
    const navigate = useNavigate();

    const allowedBarangays = [
        "Antipolo",
        "Bahi",
        "Bangbang",
        "Banuyo",
        "Cabugao",
        "Dawis",
        "Dili",
        "Libtangin",
        "Mangiliol",
        "Masiga",
        "Pangi",
        "Tapuyan",
    ];

    const fetchBarangays = async () => {
        try {
            const res = await axios.get(import.meta.env.VITE_GASAN_BARANGAYS_API_URL);
            // Filter and sort the barangays
            const filteredBarangays = res.data
                .filter((barangay) => allowedBarangays.includes(barangay.name))
                .sort((a, b) => a.name.localeCompare(b.name));
            setBarangays(filteredBarangays);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchBarangays();
    }, []);

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            firstName: "",
            middleName: "",
            lastName: "",
            validId: {
                front: { filename: "", contentType: "", data: "" },
                back: { filename: "", contentType: "", data: "" },
            },
            contactNumber: "",
            dateOfBirth: "",
            barangay: "",
            purok: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const handleRegister = async (values) => {
        try {
            const {
                firstName,
                middleName,
                lastName,
                validId,
                contactNumber,
                dateOfBirth,
                barangay,
                purok,
                email,
                password,
            } = values;

            setLoading(true);

            const res = await axios.post(`http://localhost:5000/api/auth/signup`, {
                firstName,
                middleName: middleName || "",
                lastName,
                validId,
                contactNumber,
                dateOfBirth,
                barangay,
                purok,
                email,
                password,
            });

            if (res.status === 201) {
                setLoading(false);
                navigate("/sign-in");
                toast.success("Account created successfully.", {
                    description: "Please verify your email to login.",
                });
            }
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 400) {
                setLoading(false);
                toast.error("Email is already taken", {
                    description: "Please try another email.",
                });
            } else if (error.response && error.response.status === 401) {
                setLoading(false);
                toast.error("Name is already taken", {
                    description: "Please try another name.",
                });
            }
            setLoading(false);
        }
    };

    const handleFileChange = async (e, side) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const fileData = {
                    filename: file.name,
                    contentType: file.type,
                    data: reader.result.split(",")[1],
                };
                form.setValue(`validId.${side}`, fileData);
                side === "front"
                    ? setFrontIdPreview(reader.result)
                    : setBackIdPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const steps = [
        { number: 1, title: "Personal Info" },
        { number: 2, title: "Contact & Address" },
        { number: 3, title: "Account Security" },
        { number: 4, title: "ID Verification" },
    ];

    const handleNext = async () => {
        let fieldsToValidate = [];
        switch (currentStep) {
            case 1:
                fieldsToValidate = ["firstName", "lastName"];
                break;
            case 2:
                fieldsToValidate = ["contactNumber", "email", "dateOfBirth", "barangay", "purok"];
                break;
            case 3:
                fieldsToValidate = ["password", "confirmPassword"];
                break;
            case 4:
                // Validate ID uploads before submission
                return form.trigger(["validId.front", "validId.back"]).then((isValid) => {
                    if (isValid) form.handleSubmit(handleRegister)();
                });
        }

        const isValid = await form.trigger(fieldsToValidate, { shouldFocus: true });
        if (isValid) setCurrentStep((prev) => prev + 1);
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    return (
        <Form {...form}>
            <form
                className={cn("space-y-6", className)}
                onSubmit={form.handleSubmit(handleRegister)}
            >
                {/* Progress Steps */}
                <div className="flex justify-center mb-8">
                    {steps.map((step) => (
                        <div key={step.number} className="flex items-center">
                            <div
                                className={`h-8 w-8 rounded-full flex items-center justify-center 
                                ${currentStep >= step.number ? "bg-green-600 text-white" : "bg-gray-200"}`}
                            >
                                {step.number}
                            </div>
                            {step.number < steps.length && (
                                <div
                                    className={`w-16 h-1 ${currentStep > step.number ? "bg-green-600" : "bg-gray-200"}`}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step 1 - Personal Information (Vertical Layout) */}
                {currentStep === 1 && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Personal Information</h3>
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="John" className="h-11" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="middleName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Middle Name (Optional)</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Michael"
                                                className="h-11"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Doe" className="h-11" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                )}

                {/* Step 2 - Contact & Address */}
                {currentStep === 2 && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Contact & Address Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="contactNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">
                                            Contact Number
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="09123456789"
                                                className="h-11"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">
                                            Email
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="m@example.com"
                                                className="h-11"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="dateOfBirth"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">
                                        Date of Birth
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} className="h-11" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="barangay"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">
                                        Barangay
                                    </FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger className="h-11">
                                                <SelectValue placeholder="Select barangay" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {barangays.map((barangay) => (
                                                <SelectItem
                                                    key={barangay.code}
                                                    value={barangay.name}
                                                >
                                                    {barangay.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="purok"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">
                                        Purok
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Purok 1" className="h-11" />
                                    </FormControl>
                                    <FormMessage />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Format: Purok followed by number (e.g., Purok 1, Purok 6)
                                    </p>
                                </FormItem>
                            )}
                        />
                    </div>
                )}

                {/* Step 3 - Account Security */}
                {currentStep === 3 && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Account Security</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">
                                            Password
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} type="password" className="h-11" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">
                                            Confirm Password
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} type="password" className="h-11" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                )}

                {/* Step 4 - ID Verification */}
                {currentStep === 4 && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Identity Verification</h3>

                        <p className="text-sm text-gray-500 text-center mb-4">
                            Accepted IDs must clearly display your current address in{" "}
                            {form.getValues("barangay") || "the selected barangay"}.
                            <br />
                            (e.g., PhilHealth ID, Driver's License, UMID, or Postal ID with updated
                            address)
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Front ID Upload */}
                            <div className="space-y-4">
                                <div className="relative h-48 border-2 border-dashed rounded-lg p-4 flex items-center justify-center bg-gray-50">
                                    <input
                                        id="frontId"
                                        type="file"
                                        accept="image/*,.pdf"
                                        onChange={(e) => handleFileChange(e, "front")}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    {frontIdPreview ? (
                                        <div className="relative w-full h-full">
                                            <img
                                                src={frontIdPreview}
                                                alt="Front ID Preview"
                                                className="h-full w-full object-contain"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="absolute -top-2 -right-2 rounded-full p-1.5 shadow-sm hover:bg-red-600 h-7 w-7 flex items-center justify-center"
                                                onClick={() => {
                                                    form.setValue("validId.front", null);
                                                    setFrontIdPreview(null);
                                                }}
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <Label
                                                htmlFor="frontId"
                                                className="text-green-600 cursor-pointer font-medium"
                                            >
                                                Upload Front of ID
                                            </Label>
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 text-center">
                                    Front side showing{" "}
                                    {form.getValues("barangay") || "selected barangay"} address
                                </p>
                            </div>

                            {/* Back ID Upload */}
                            <div className="space-y-4">
                                <div className="relative h-48 border-2 border-dashed rounded-lg p-4 flex items-center justify-center bg-gray-50">
                                    <input
                                        id="backId"
                                        type="file"
                                        accept="image/*,.pdf"
                                        onChange={(e) => handleFileChange(e, "back")}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    {backIdPreview ? (
                                        <div className="relative w-full h-full">
                                            <img
                                                src={backIdPreview}
                                                alt="Back ID Preview"
                                                className="h-full w-full object-contain"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="absolute -top-2 -right-2 rounded-full p-1.5 shadow-sm hover:bg-red-600 h-7 w-7 flex items-center justify-center"
                                                onClick={() => {
                                                    form.setValue("validId.back", null);
                                                    setBackIdPreview(null);
                                                }}
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <Label
                                                htmlFor="backId"
                                                className="text-green-600 cursor-pointer font-medium"
                                            >
                                                Upload Back of ID
                                            </Label>
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 text-center">
                                    Back side showing{" "}
                                    {form.getValues("barangay") || "selected barangay"} address
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                    <div>
                        {currentStep > 1 && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handlePrevious}
                                disabled={loading}
                            >
                                Previous
                            </Button>
                        )}
                    </div>

                    <div className="flex gap-4">
                        {currentStep < 4 ? (
                            <Button
                                type="button"
                                onClick={handleNext}
                                disabled={loading}
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                disabled={loading}
                            >
                                {loading ? "Creating account..." : "Submit"}
                            </Button>
                        )}
                    </div>
                </div>

                <div className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/sign-in" className="font-medium text-green-600 hover:text-green-500">
                        Sign in
                    </Link>
                </div>
            </form>
        </Form>
    );
}

SignupForm.propTypes = {
    className: PropTypes.string,
};

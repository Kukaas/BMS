// Third-party libraries
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Components and UI elements
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

// Utilities
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.jsx";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const schema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    contactNumber: z.string().min(10, {
        message: "Contact number must be at least 10 characters.",
    }),
    dateOfBirth: z.string(),
    email: z.string().email("Invalid email address."),
    role: z.string().nonempty("Role is required."),
    barangay: z.string().min(2, {
        message: "Barangay must be selected.",
    }),
});

export function BarangayUserRegistration({ className }) {
    const [loading, setLoading] = useState(false);
    const [barangays, setBarangays] = useState([]);
    const navigate = useNavigate();

    const allowedBarangays = [
        'Antipolo',
        'Bahi',
        'Bangbang',
        'Banuyo',
        'Cabugao',
        'Dawis',
        'Dili',
        'Libtangin',
        'Mangiliol',
        'Masiga',
        'Pangi',
        'Tapuyan'
    ];

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            contactNumber: "",
            dateOfBirth: "",
            email: "",
            role: "",
            barangay: "",
        },
    });

    const handleRegister = async (values) => {
        console.log(values);
        try {
            const { name, contactNumber, dateOfBirth, email, role, barangay } = values;

            if (!name || !contactNumber || !dateOfBirth || !email || !role || !barangay) {
                toast.error("All fields are required.");
                return;
            }

            setLoading(true);

            let res;
            if (role === "secretary") {
                res = await axios.post("http://localhost:5000/api/admin/create-secretary-account", {
                    name,
                    contactNumber,
                    dateOfBirth,
                    email,
                    barangay,
                    password: "secretary",

                });
            } else if (role === "superAdmin") {
                res = await axios.post(
                    "http://localhost:5000/api/admin/create-super-admin-account",
                    {
                        name,
                        contactNumber,
                        dateOfBirth,
                        email,
                        barangay,
                        password: "superAdmin",
                    }

                );
            } else {
                res = await axios.post("http://localhost:5000/api/admin/create-chairman-account", {
                    name,
                    contactNumber,
                    dateOfBirth,
                    email,
                    barangay,
                    password: "chairman",
                });

            }

            if (res.status === 201) {
                setLoading(false);
                toast.success("User registered successfully.", {
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
            }
            setLoading(false);
        }
    };

    const fetchBarangays = async () => {
        try {
            const res = await axios.get(import.meta.env.VITE_GASAN_BARANGAYS_API_URL);
            // Filter and sort the barangays
            const filteredBarangays = res.data
                .filter(barangay => allowedBarangays.includes(barangay.name))
                .sort((a, b) => a.name.localeCompare(b.name));
            setBarangays(filteredBarangays);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchBarangays();
    }, []);

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Register Barangay User</CardTitle>
                <CardDescription>
                    Add a new chairman or secretary to the barangay system.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        className={cn("space-y-6", className)}
                        onSubmit={form.handleSubmit(handleRegister)}
                    >
                        <div className="space-y-4">
                            {/* Name and Contact Number side by side */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">
                                                Full Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="John Doe" className="h-11" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="contactNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">
                                                Contact Number
                                            </FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="09123456789" className="h-11" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Date of Birth - Full width */}
                            <FormField
                                control={form.control}
                                name="dateOfBirth"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">Date of Birth</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                {...field}
                                                className="h-11"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Email - Full width */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">
                                            Email
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="m@example.com" className="h-11" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Role and Barangay side by side */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">Role</FormLabel>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="h-11">
                                                        <SelectValue placeholder="Select Role" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="chairman">Chairman</SelectItem>
                                                    <SelectItem value="secretary">Secretary</SelectItem>
                                                    <SelectItem value="superAdmin">Super Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
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
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="h-11">
                                                        <SelectValue placeholder="Select Barangay" />
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
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 bg-green-600 hover:bg-green-700 text-white"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <span className="animate-spin">⏳</span> Registering...
                                </div>
                            ) : (
                                "Register User"
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

BarangayUserRegistration.propTypes = {
    className: PropTypes.string,
};

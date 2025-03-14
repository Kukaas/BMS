// Third-party libraries
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";

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

// Utilities
import { cn } from "@/lib/utils";

// Hooks
import { useForm } from "react-hook-form";

const schema = z
    .object({
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
            ),
        confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export function ResetPasswordForm({ className }) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const handleResetPassword = async (values) => {
        try {
            setLoading(true);
            const { password, confirmPassword } = values;

            if (!password || !confirmPassword) {
                toast.error("All fields are required.");
                return;
            }

            if (password !== confirmPassword) {
                toast.error("Passwords do not match.");
                return;
            }

            const response = await axios.post("http://localhost:5000/api/auth/reset-password", {
                ...values,
                email: localStorage.getItem("email"),
            });

            if (response.status === 200) {
                toast.success("Password reset successful.");
                localStorage.removeItem("email");
                setLoading(false);
                navigate("/sign-in");
            }
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form
                className={cn("space-y-6", className)}
                onSubmit={form.handleSubmit(handleResetPassword)}
            >
                <div className="space-y-4 text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        Reset Your Password
                    </h1>
                    <p className="text-sm text-gray-600">
                        Enter your new password below to reset your account
                    </p>
                </div>

                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">
                                    New Password
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

                <Button
                    type="submit"
                    className="w-full h-11 bg-green-600 hover:bg-green-700 text-white"
                    disabled={loading}
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <span className="animate-spin">⏳</span> Resetting...
                        </div>
                    ) : (
                        "Reset Password"
                    )}
                </Button>

                <div className="text-center text-sm text-gray-600">
                    Remember your password?{" "}
                    <Link to="/sign-in" className="font-medium text-green-600 hover:text-green-500">
                        Sign in
                    </Link>
                </div>
            </form>
        </Form>
    );
}

ResetPasswordForm.propTypes = {
    className: PropTypes.string,
};

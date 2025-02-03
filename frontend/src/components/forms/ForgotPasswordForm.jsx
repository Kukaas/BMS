// Third-party libraries
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import PropTypes from "prop-types";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

// Components and UI elements
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

// Utilities
import { cn } from "@/lib/utils";

// Hooks
import { useForm } from "react-hook-form";

const schema = z.object({
    email: z.string().email(),
});

export default function ForgotPasswordForm({ className }) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
        },
    });

    const handleForgotPassword = async (values) => {
        const generateRandomToken = (length) => {
            let result = "";
            while (result.length < length) {
                result += Math.random().toString(36).substring(2); // Concatenate random strings
            }
            return result.substring(0, length); // Truncate to the desired length
        };

        const generatedToken = generateRandomToken(50);
        try {
            setLoading(true);
            const { email } = values;

            if (!email) {
                toast.error("Email is required.");
                return;
            }

            const response = await axios.post(
                "http://localhost:5000/api/auth/forgot-password",
                values
            );

            if (response.status === 200) {
                setLoading(false);
                localStorage.setItem("email", email);
                toast.success("An OTP has been sent to your email.");
                navigate(`/verify-otp/${generatedToken}`);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setLoading(false);
                toast.error("Email not found", {
                    description: "Please try another email.",
                });
            } else {
                setLoading(false);
                toast.error("Failed to send reset link.");
            }
        }
    };
    return (
        <Form {...form}>
            <form
                className={cn("space-y-6", className)}
                onSubmit={form.handleSubmit(handleForgotPassword)}
            >
                <div className="space-y-4 text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        Forgot your password?
                    </h1>
                    <p className="text-sm text-gray-600">
                        Enter your email and we'll send you instructions to reset your password.
                    </p>
                </div>

                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-700">
                                    Email address
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="name@example.com"
                                        className="h-11"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="w-full h-11 bg-green-600 hover:bg-green-700 text-white"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <span className="animate-spin">⏳</span> Sending reset link...
                            </div>
                        ) : (
                            "Send reset link"
                        )}
                    </Button>
                </div>

                <div className="text-center text-sm text-gray-600">
                    Remember your password?{" "}
                    <Link to="/sign-in" className="font-medium text-green-600 hover:text-green-500">
                        Back to login
                    </Link>
                </div>
            </form>
        </Form>
    );
}

ForgotPasswordForm.propTypes = {
    className: PropTypes.string,
};

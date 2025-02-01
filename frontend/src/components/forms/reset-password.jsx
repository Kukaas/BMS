// Third-party libraries
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
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
                className={cn("flex flex-col gap-6", className)}
                onSubmit={form.handleSubmit(handleResetPassword)}
            >
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">
                        Welcome back! Let&apos;s reset your password
                    </h1>
                    <p className="text-balance text-sm text-muted-foreground">
                        Enter your new password below.
                    </p>
                </div>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="password" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid gap-2">
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="password" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </Button>
                </div>
                <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <p
                        className="underline underline-offset-4 cursor-pointer"
                        onClick={() => navigate("/sign-up")}
                    >
                        Sign up
                    </p>
                </div>
            </form>
        </Form>
    );
}

ResetPasswordForm.propTypes = {
    className: PropTypes.string,
};

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { loginFailure, loginStart } from "@/redux/user/userSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import PropTypes from "prop-types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

const schema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export function LoginForm({ className, onSubmit }) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleLogin = async (values) => {
        try {
            setLoading(true);
            dispatch(loginStart());

            // Store credentials temporarily for MFA
            localStorage.setItem("loginEmail", values.email);
            localStorage.setItem("loginPassword", values.password);

            if (onSubmit) {
                await onSubmit(values);
            }
        } catch (error) {
            console.error(error);
            dispatch(loginFailure(error.response?.data?.message || "Login failed"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form className={cn("space-y-6", className)} onSubmit={form.handleSubmit(handleLogin)}>
                <div className="space-y-4 text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        Welcome back
                    </h1>
                    <p className="text-sm text-gray-600">
                        Enter your credentials to access your account
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

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center justify-between">
                                    <FormLabel className="text-sm font-medium text-gray-700">
                                        Password
                                    </FormLabel>
                                    <Link
                                        to="/forgot-password"
                                        className="text-sm font-medium text-green-600 hover:text-green-500"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
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
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            <span>Signing in...</span>
                        </div>
                    ) : (
                        "Sign in"
                    )}
                </Button>

                <div className="text-center text-sm text-gray-600">
                    Don&apos;t have an account?{" "}
                    <Link to="/sign-up" className="font-medium text-green-600 hover:text-green-500">
                        Sign up
                    </Link>
                </div>
            </form>
        </Form>
    );
}

LoginForm.propTypes = {
    className: PropTypes.string,
    onSubmit: PropTypes.func,
};

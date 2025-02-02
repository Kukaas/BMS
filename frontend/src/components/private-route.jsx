import { logout } from "@/redux/user/userSlice";
import { checkAuth } from "@/utils/auth";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate, useLocation } from "react-router-dom";
import { isTokenExpired } from "@/lib/auth";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

const PrivateRoute = () => {
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isVerifying, setIsVerifying] = useState(true);
    const [showExpiredDialog, setShowExpiredDialog] = useState(false);
    const [isSessionExpired, setIsSessionExpired] = useState(false);
    const token = localStorage.getItem("token");
    const location = useLocation();
    const tab = new URLSearchParams(location.search).get("tab");

    // Define valid tabs for each role
    const adminTabs = ["overview", "users", "requestdocs", "incidents", "residents"];
    const userTabs = ["overview", "requests", "reports", "blotter", "settings"];

    // Check if current tab is valid for user's role
    const isValidTab = () => {
        const isAdmin = currentUser?.role === "chairman" || currentUser?.role === "secretary";
        const validTabs = isAdmin ? adminTabs : userTabs;
        return validTabs.includes(tab);
    };

    // Get default redirect path based on role
    const getDefaultPath = () => {
        const isAdmin = currentUser?.role === "chairman" || currentUser?.role === "secretary";
        return isAdmin ? "/dashboard?tab=overview" : "/dashboard?tab=requests";
    };

    const handleSessionExpired = () => {
        dispatch(logout());
        localStorage.removeItem("token");
        setShowExpiredDialog(false);
        navigate("/sign-in");
    };

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const isAuthenticated = await checkAuth();
                if (!isAuthenticated) {
                    // Don't show dialog here, just set session expired
                    setIsSessionExpired(true);
                }
            } catch (error) {
                console.error("Auth verification failed:", error);
                setIsSessionExpired(true);
            } finally {
                setIsVerifying(false);
            }
        };

        if (!currentUser) {
            verifyAuth();
        } else {
            setIsVerifying(false);
        }
    }, [currentUser]);

    // Only show dialog when token is actually expired
    useEffect(() => {
        if (token && isTokenExpired(token)) {
            setIsSessionExpired(true);
            setShowExpiredDialog(true);
        }
    }, [token]);

    // Redirect to appropriate dashboard if tab is invalid
    useEffect(() => {
        if (currentUser && tab && !isValidTab() && !isSessionExpired) {
            navigate(getDefaultPath());
        }
    }, [currentUser, tab, navigate, isSessionExpired]);

    if (isVerifying) {
        return null; // or a loading spinner
    }

    return (
        <>
            <AlertDialog open={showExpiredDialog} onOpenChange={setShowExpiredDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Session Expired</AlertDialogTitle>
                        <AlertDialogDescription>
                            Your session has expired. Please sign in again to continue.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={handleSessionExpired}>
                            Sign In Again
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {currentUser && !isSessionExpired ? <Outlet /> : null}
        </>
    );
};

export default PrivateRoute;

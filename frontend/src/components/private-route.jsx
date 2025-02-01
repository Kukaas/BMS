import { logout } from "@/redux/user/userSlice";
import { checkAuth } from "@/utils/auth";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const PrivateRoute = () => {
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isVerifying, setIsVerifying] = useState(true);

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const isAuthenticated = await checkAuth();
                if (!isAuthenticated) {
                    dispatch(logout());
                    navigate("/sign-in");
                }
            } catch (error) {
                console.error("Auth verification failed:", error);
                dispatch(logout());
                navigate("/sign-in");
            } finally {
                setIsVerifying(false);
            }
        };

        if (!currentUser) {
            verifyAuth();
        } else {
            setIsVerifying(false);
        }
    }, [currentUser, dispatch, navigate]);

    if (isVerifying) {
        return null; // or a loading spinner
    }

    return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;

import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import type { JSX } from "react/jsx-dev-runtime";


export default function ProtectedRoute({ children }: { children: JSX.Element }) {
    const {isAuthenticated} = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }
    return children;
}
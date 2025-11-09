import type React from "react";

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface GuestRouteProps {
    children: React.ReactNode;
}

export default function GuestRoute({ children }: GuestRouteProps) {
    const { user } = useAuth();

    if (user) {
        return <Navigate to="/account" replace />;
    }

    return <>{children}</>;
}

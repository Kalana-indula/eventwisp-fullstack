"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ManagerProtectedRoutes = ({ children }: ProtectedRouteProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        //  Read token safely
        const raw = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const token = raw && raw !== "undefined" && raw !== "null" ? raw : null;

        // Read stored user data
        const storedUserId = localStorage.getItem("userId");
        const storedUserRole = localStorage.getItem("userRole"); // e.g. "MANAGER", "ADMIN", "ORGANIZER"

        // Skip redirect if already on manager login page
        const isOnLogin = pathname?.startsWith("/manager/auth/login");
        if (!token) {
            if (!isOnLogin) router.replace("/manager/auth/login");
            return;
        }

        // Set auth header for all axios calls
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // -------- Role vs path prefix check ----------
        // Only MANAGER and ADMIN can access /manager routes
        if (pathname?.startsWith("/admin") && storedUserRole !== "ADMIN") {
            router.replace("/unauthorized");
            return;
        }
        if (pathname?.startsWith("/manager") && !["MANAGER", "ADMIN"].includes(storedUserRole ?? "")) {
            router.replace("/unauthorized");
            return;
        }
        if (pathname?.startsWith("/organizer") && storedUserRole !== "ORGANIZER") {
            router.replace("/unauthorized");
            return;
        }

        // -------- Optional: match manager id in path ----------
        // e.g. /manager/5/dashboard -> only userId 5 can access their own
        const match = pathname?.match(/^\/manager\/(\d+)(?:\/|$)/);
        const pathUserId = match?.[1];

        if (pathUserId && storedUserId && pathUserId !== storedUserId) {
            // Redirect to their own dashboard if mismatched
            router.replace(`/manager/${storedUserId}/dashboard`);
            return;
        }

        setChecked(true);
    }, [router, pathname]);

    if (!checked) return null; // You can show a loader/spinner if needed
    return <>{children}</>;
};

export default ManagerProtectedRoutes;

'use client';

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function AdminProtectedRoute({ children }: ProtectedRouteProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        // Safely read token from localStorage
        const raw = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const token = raw && raw !== "undefined" && raw !== "null" ? raw : null;

        // Read stored user data
        const storedUserId = localStorage.getItem("userId");
        const storedUserRole = localStorage.getItem("userRole"); // e.g. "ADMIN"

        //  Skip redirect if already on admin login page
        const isOnLogin = pathname?.startsWith("/admin/auth/login");

        if (!token) {
            if (!isOnLogin) router.replace("/admin/auth/login");
            return;
        }

        // Set auth header globally
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // -------- Role vs path prefix check ----------
        // Allow ADMIN to access both /admin and /manager
        if (
            (pathname?.startsWith("/admin") && storedUserRole !== "ADMIN") ||
            (pathname?.startsWith("/manager") && !["ADMIN", "MANAGER"].includes(storedUserRole ?? ""))
        ) {
            router.replace("/unauthorized");
            return;
        }

        // -------- Optional: ID match for admin routes ----------
        // e.g. /admin/5/dashboard → should match logged-in user’s ID
        const match = pathname?.match(/^\/admin\/(\d+)(?:\/|$)/);
        const pathUserId = match?.[1];

        if (pathUserId && storedUserId && pathUserId !== storedUserId) {
            router.replace(`/admin/${storedUserId}/dashboard`);
            return;
        }

        setChecked(true);
    }, [router, pathname]);

    if (!checked) return null; // You can replace with a spinner or skeleton
    return <>{children}</>;
}

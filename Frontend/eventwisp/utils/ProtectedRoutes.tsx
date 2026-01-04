"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        // only run client-side
        if (typeof window === "undefined") return;

        const token = localStorage.getItem("token");
        const storedUserId = localStorage.getItem("userId");     // e.g. "12"
        const storedUserRole = localStorage.getItem("userRole"); // e.g. "ORGANIZER"

        // If not logged in, redirect to organizer login (adjust if you have a global login)
        const isOnOrganizerLogin = pathname?.startsWith("/organizer/auth/login");
        if (!token) {
            if (!isOnOrganizerLogin) router.replace("/organizer/auth/login");
            return;
        }

        // Set default auth header for subsequent API calls
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // -------- Role vs path prefix (optional, but recommended) ----------
        // If user is ORGANIZER, they shouldn't access /admin or /manager, etc.
        if (pathname?.startsWith("/admin") && storedUserRole !== "ADMIN") {
            router.replace("/unauthorized"); // or your home
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

        // -------- Extract organizer id from path and compare ---------------
        // Match /organizer/:id(/...)?  -> capture :id
        const match = pathname?.match(/^\/organizer\/(\d+)(?:\/|$)/);

        //extract id number if there is id in the path
        const pathUserId = match?.[1];

        // If route expects an organizer id, make sure it matches the logged-in user
        if (pathUserId && storedUserId && pathUserId !== storedUserId) {
            // Redirect them to their own dashboard (or a 403 page)
            router.replace(`/organizer/${storedUserId}/dashboard`);
            return;
        }

        setChecked(true);
    }, [pathname, router]);

    if (!checked) return null; // or a loader
    return <>{children}</>;
}

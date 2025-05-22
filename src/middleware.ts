import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const pathname = request.nextUrl.pathname;

    // Allow public pages
    if (
        pathname === "/" ||
        pathname.startsWith("/auth") ||
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api")
    ) {
        return NextResponse.next();
    }

    // Protect dashboard pages
    if (pathname.startsWith("/dashboard")) {
        if (!token) {
            return NextResponse.redirect(new URL("/auth/sign-in", request.url));
        }

        const userRole = token.user?.role;
        const dashboardPath = `/dashboard/${userRole}`;

        // Prevent access to other roles' dashboards
        if (!pathname.startsWith(dashboardPath)) {
            return NextResponse.redirect(new URL(dashboardPath, request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};

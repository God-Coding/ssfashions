import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Allow PayU redirects to payment pages
    const url = request.nextUrl;

    if (url.pathname.startsWith('/payment/')) {
        // Clone the request headers
        const requestHeaders = new Headers(request.headers);

        // Remove problematic headers that cause Server Actions check
        requestHeaders.delete('next-action');

        // Create response with modified headers
        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/payment/:path*',
};

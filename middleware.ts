import { NextRequest, NextResponse } from "next/server";

//This file nees to be in the root folder: https://nextjs.org/docs/app/building-your-application/routing/middleware

const rateLimitMap = new Map();

export function rateLimitMiddleware(req: NextRequest) {
    // Middleware for preventing a DDoS attack
    const ip = req.headers.get("x-forwarded-for") || req.ip;
    const limit = 60; // Limiting requests to 100 per minute per IP
    const windowMs = 60 * 1000; // 1 minute

    if (!rateLimitMap.has(ip)) {
        rateLimitMap.set(ip, {
            count: 0,
            lastReset: Date.now(),
        });
    }

    const ipData = rateLimitMap.get(ip);

    if (Date.now() - ipData.lastReset > windowMs) {
        ipData.count = 0;
        ipData.lastReset = Date.now();
    }

    if (ipData.count >= limit) {
        return NextResponse.json({ msg: `You have reached the rate limit of ${limit} requests per minute` }, { status: 429 });
    }

    ipData.count += 1;
}

export function middleware(request: NextRequest): NextResponse {
    const limitResponse = rateLimitMiddleware(request);
    return limitResponse || NextResponse.next();
}

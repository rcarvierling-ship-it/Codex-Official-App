(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__10cfd29a._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/src/lib/nav.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_ROLE",
    ()=>DEFAULT_ROLE,
    "KNOWN_ROLES",
    ()=>KNOWN_ROLES,
    "getAllNavPaths",
    ()=>getAllNavPaths,
    "getNavForRole",
    ()=>getNavForRole,
    "isRole",
    ()=>isRole,
    "normalizeRole",
    ()=>normalizeRole
]);
const DEFAULT_ROLE = "USER";
const PATH_LABELS = {
    "/admin": "Overview",
    "/admin/leagues": "Leagues",
    "/admin/schools": "Schools",
    "/admin/teams": "Teams",
    "/admin/venues": "Venues",
    "/events": "Events",
    "/officials": "Officials",
    "/requests": "Requests",
    "/approvals": "Approvals",
    "/assignments": "Assignments",
    "/announcements": "Announcements",
    "/admin/users": "Users & Roles",
    "/admin/feature-flags": "Feature Flags",
    "/admin/settings": "Settings",
    "/analytics": "Analytics",
    "/activity": "Activity",
    "/api-explorer": "API Explorer",
    "/dev-tools": "Dev Tools",
    "/teams": "Teams",
    "/venues": "Venues",
    "/profile": "Profile"
};
const ROLE_NAV_PATHS = {
    SUPER_ADMIN: [
        "/admin",
        "/admin/leagues",
        "/admin/schools",
        "/admin/teams",
        "/admin/venues",
        "/events",
        "/officials",
        "/requests",
        "/approvals",
        "/assignments",
        "/announcements",
        "/admin/users",
        "/admin/feature-flags",
        "/admin/settings",
        "/analytics",
        "/activity",
        "/api-explorer",
        "/dev-tools"
    ],
    ADMIN: [
        "/admin",
        "/events",
        "/requests",
        "/approvals",
        "/assignments",
        "/teams",
        "/officials",
        "/venues",
        "/announcements",
        "/admin/users",
        "/admin/settings",
        "/analytics",
        "/activity"
    ],
    AD: [
        "/admin",
        "/events",
        "/requests",
        "/approvals",
        "/assignments",
        "/teams",
        "/officials",
        "/venues",
        "/announcements",
        "/activity"
    ],
    COACH: [
        "/admin",
        "/teams",
        "/events",
        "/requests",
        "/announcements"
    ],
    OFFICIAL: [
        "/admin",
        "/events",
        "/requests",
        "/assignments",
        "/profile"
    ],
    USER: [
        "/admin",
        "/events",
        "/announcements"
    ]
};
const KNOWN_ROLES = Object.keys(ROLE_NAV_PATHS);
function isRole(value) {
    return typeof value === "string" && KNOWN_ROLES.includes(value);
}
function normalizeRole(value) {
    if (isRole(value)) return value;
    if (value === "STAFF") return "USER";
    return DEFAULT_ROLE;
}
function getNavForRole(role) {
    const paths = ROLE_NAV_PATHS[role] ?? ROLE_NAV_PATHS[DEFAULT_ROLE];
    return paths.map((href)=>({
            href,
            label: PATH_LABELS[href] ?? href.replace("/", "").replace(/-/g, " ")
        }));
}
function getAllNavPaths() {
    const set = new Set();
    KNOWN_ROLES.forEach((role)=>{
        ROLE_NAV_PATHS[role].forEach((path)=>set.add(path));
    });
    return Array.from(set);
}
}),
"[project]/src/lib/acl.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GUARDED_PREFIXES",
    ()=>GUARDED_PREFIXES,
    "pathMatches",
    ()=>pathMatches,
    "roleAllows",
    ()=>roleAllows
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/nav.ts [middleware-edge] (ecmascript)");
;
const alwaysAllowed = new Set([
    "/",
    "/demo"
]);
function pathMatches(base, pathname) {
    if (base === "/") return pathname === "/";
    if (!base.startsWith("/")) return false;
    return pathname === base || pathname.startsWith(`${base}/`);
}
function roleAllows(role, pathname) {
    if (alwaysAllowed.has(pathname)) return true;
    const allowed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["getNavForRole"])(role);
    return allowed.some((item)=>pathMatches(item.href, pathname));
}
const PROTECTED_BASE_PATHS = Array.from(new Set([
    "/admin",
    "/events",
    "/officials",
    "/requests",
    "/approvals",
    "/assignments",
    "/announcements",
    "/teams",
    "/venues",
    "/admin/leagues",
    "/admin/schools",
    "/admin/teams",
    "/admin/venues",
    "/admin/users",
    "/admin/feature-flags",
    "/admin/settings",
    "/analytics",
    "/activity",
    "/api-explorer",
    "/dev-tools",
    "/profile"
]));
(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["getAllNavPaths"])().forEach((path)=>PROTECTED_BASE_PATHS.push(path));
const GUARDED_PREFIXES = Array.from(new Set(PROTECTED_BASE_PATHS));
}),
"[project]/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.1_@babel+core@7.28.5_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.1_@babel+core@7.28.5_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$auth$40$4$2e$24$2e$13_next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$1_dc2c226e60bf9fddbb52654d8aba4889$2f$node_modules$2f$next$2d$auth$2f$jwt$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next-auth@4.24.13_next@16.0.1_@babel+core@7.28.5_react-dom@18.3.1_react@18.3.1__react@1_dc2c226e60bf9fddbb52654d8aba4889/node_modules/next-auth/jwt/index.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$acl$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/acl.ts [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/nav.ts [middleware-edge] (ecmascript)");
;
;
;
;
const ROLE_COOKIE = "theofficialapp-role";
const TOAST_COOKIE = "x-toast";
function needsGuard(pathname) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$acl$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["GUARDED_PREFIXES"].some((prefix)=>pathname === prefix || pathname.startsWith(`${prefix}/`));
}
async function middleware(req) {
    const { pathname } = req.nextUrl;
    if (!needsGuard(pathname)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$2d$auth$40$4$2e$24$2e$13_next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$1_dc2c226e60bf9fddbb52654d8aba4889$2f$node_modules$2f$next$2d$auth$2f$jwt$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["getToken"])({
        req,
        secret: process.env.NEXTAUTH_SECRET
    });
    const tokenRole = token?.role;
    const cookieRole = req.cookies.get(ROLE_COOKIE)?.value;
    const role = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["normalizeRole"])(tokenRole ?? cookieRole);
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$acl$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["roleAllows"])(role, pathname)) {
        const res = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
        res.cookies.set(ROLE_COOKIE, role, {
            path: "/",
            httpOnly: false
        });
        return res;
    }
    const destination = role === "OFFICIAL" ? "/admin" : "/";
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = destination;
    redirectUrl.searchParams.set("from", pathname);
    const res = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(redirectUrl);
    res.cookies.set(TOAST_COOKIE, "unauthorized", {
        path: "/",
        httpOnly: false,
        sameSite: "lax"
    });
    return res;
}
const config = {
    matcher: [
        "/admin/:path*",
        "/events/:path*",
        "/officials/:path*",
        "/requests/:path*",
        "/approvals/:path*",
        "/assignments/:path*",
        "/announcements/:path*",
        "/teams/:path*",
        "/venues/:path*",
        "/analytics/:path*",
        "/activity/:path*",
        "/api-explorer/:path*",
        "/dev-tools/:path*",
        "/profile/:path*"
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__10cfd29a._.js.map
(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/nav.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
_c = KNOWN_ROLES;
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
var _c;
__turbopack_context__.k.register(_c, "KNOWN_ROLES");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/demo-nav.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "demoPathForPath",
    ()=>demoPathForPath,
    "mapNavItemsToDemo",
    ()=>mapNavItemsToDemo
]);
const DEMO_ROUTE_MAP = {
    "/admin": "/demo",
    "/admin/leagues": "/demo/leagues",
    "/admin/schools": "/demo/schools",
    "/admin/teams": "/demo/teams",
    "/admin/venues": "/demo/venues",
    "/events": "/demo/events",
    "/officials": "/demo/officials",
    "/requests": "/demo/requests",
    "/approvals": "/demo/approvals",
    "/assignments": "/demo/assignments",
    "/announcements": "/demo/announcements",
    "/admin/users": "/demo/users",
    "/admin/feature-flags": "/demo/feature-flags",
    "/admin/settings": "/demo/settings",
    "/analytics": "/demo/analytics",
    "/activity": "/demo/activity",
    "/api-explorer": "/demo/api-explorer",
    "/dev-tools": "/demo/dev-tools",
    "/teams": "/demo/teams",
    "/venues": "/demo/venues",
    "/profile": "/demo/profile"
};
function mapNavItemsToDemo(items) {
    return items.map((item)=>{
        const href = DEMO_ROUTE_MAP[item.href];
        if (!href) return null;
        return {
            ...item,
            href
        };
    }).filter((item)=>Boolean(item));
}
function demoPathForPath(href) {
    return DEMO_ROUTE_MAP[href] ?? null;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/button.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.1_@babel+core@7.28.5_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.1_@babel+core@7.28.5_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$2$2e$4_$40$types$2b$react$40$18$2e$3$2e$26_react$40$18$2e$3$2e$1$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-slot@1.2.4_@types+react@18.3.26_react@18.3.1/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$class$2d$variance$2d$authority$40$0$2e$7$2e$1$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/class-variance-authority@0.7.1/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$class$2d$variance$2d$authority$40$0$2e$7$2e$1$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
            destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
            outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
            secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
            default: "h-9 px-4 py-2",
            sm: "h-8 rounded-md px-3 text-xs",
            lg: "h-10 rounded-md px-8",
            icon: "h-9 w-9"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
const Button = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, variant, size, asChild = false, ...props }, ref)=>{
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$2$2e$4_$40$types$2b$react$40$18$2e$3$2e$26_react$40$18$2e$3$2e$1$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/button.jsx",
        lineNumber: 40,
        columnNumber: 6
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Button;
Button.displayName = "Button";
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Button$React.forwardRef");
__turbopack_context__.k.register(_c1, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/button.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.jsx [app-client] (ecmascript)");
;
const Button = __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"];
const buttonVariants = __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buttonVariants"];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/sheet.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Sheet",
    ()=>Sheet,
    "SheetClose",
    ()=>SheetClose,
    "SheetContent",
    ()=>SheetContent,
    "SheetDescription",
    ()=>SheetDescription,
    "SheetFooter",
    ()=>SheetFooter,
    "SheetHeader",
    ()=>SheetHeader,
    "SheetOverlay",
    ()=>SheetOverlay,
    "SheetPortal",
    ()=>SheetPortal,
    "SheetTitle",
    ()=>SheetTitle,
    "SheetTrigger",
    ()=>SheetTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/sheet.jsx [app-client] (ecmascript)");
;
const Sheet = __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sheet"];
const SheetClose = __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetClose"];
const SheetContent = __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetContent"];
const SheetDescription = __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetDescription"];
const SheetFooter = __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetFooter"];
const SheetHeader = __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetHeader"];
const SheetOverlay = __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetOverlay"];
const SheetPortal = __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetPortal"];
const SheetTitle = __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetTitle"];
const SheetTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetTrigger"];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/demo/_data/mockData.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mockData",
    ()=>mockData
]);
const now = new Date();
const mockData = {
    leagues: [
        {
            id: "league-1",
            name: "Summit Athletic Association",
            region: "Midwest",
            contactEmail: "info@summitathletics.org"
        },
        {
            id: "league-2",
            name: "Coastal Prep League",
            region: "Southeast",
            contactEmail: "admin@coastalprep.org"
        },
        {
            id: "league-3",
            name: "Metro Elite Conference",
            region: "Northeast",
            contactEmail: "support@metroelite.org"
        }
    ],
    schools: [
        {
            id: "school-1",
            leagueId: "league-1",
            name: "Central High",
            mascot: "Lions",
            city: "Louisville",
            state: "KY"
        },
        {
            id: "school-2",
            leagueId: "league-1",
            name: "Riverdale Prep",
            mascot: "Eagles",
            city: "Indianapolis",
            state: "IN"
        },
        {
            id: "school-3",
            leagueId: "league-2",
            name: "Harborview Academy",
            mascot: "Pelicans",
            city: "Charleston",
            state: "SC"
        },
        {
            id: "school-4",
            leagueId: "league-3",
            name: "North Ridge",
            mascot: "Wolves",
            city: "Boston",
            state: "MA"
        }
    ],
    teams: [
        {
            id: "team-1",
            schoolId: "school-1",
            name: "Central Lions Varsity",
            sport: "Basketball",
            level: "Varsity",
            record: "18-3"
        },
        {
            id: "team-2",
            schoolId: "school-2",
            name: "Riverdale Eagles Varsity",
            sport: "Basketball",
            level: "Varsity",
            record: "16-5"
        },
        {
            id: "team-3",
            schoolId: "school-3",
            name: "Harborview Pelicans JV",
            sport: "Soccer",
            level: "JV",
            record: "9-4-2"
        },
        {
            id: "team-4",
            schoolId: "school-4",
            name: "North Ridge Wolves Varsity",
            sport: "Football",
            level: "Varsity",
            record: "11-1"
        }
    ],
    venues: [
        {
            id: "venue-1",
            name: "Central Fieldhouse",
            capacity: 2400,
            address: "100 Summit Ave",
            city: "Louisville",
            state: "KY"
        },
        {
            id: "venue-2",
            name: "Riverdale Pavilion",
            capacity: 1800,
            address: "55 Riverside Way",
            city: "Indianapolis",
            state: "IN"
        },
        {
            id: "venue-3",
            name: "Coastal Arena",
            capacity: 2200,
            address: "120 Ocean Blvd",
            city: "Charleston",
            state: "SC"
        }
    ],
    users: [
        {
            id: "user-superadmin",
            name: "Avery Thompson",
            email: "avery@theofficial.app",
            role: "SUPER_ADMIN",
            status: "Active",
            sports: [
                "Basketball",
                "Football"
            ],
            availability: [
                "Weekdays",
                "Weekends"
            ]
        },
        {
            id: "user-school-admin",
            name: "Dana Morales",
            email: "dana.morales@summitathletics.org",
            role: "ADMIN",
            status: "Active",
            sports: [
                "Basketball",
                "Soccer"
            ],
            availability: [
                "Weekdays"
            ]
        },
        {
            id: "user-ad",
            name: "Jordan Fisher",
            email: "jordan@centralhigh.edu",
            role: "AD",
            status: "Active",
            sports: [
                "Basketball",
                "Soccer"
            ],
            availability: [
                "Weekdays"
            ]
        },
        {
            id: "user-official-1",
            name: "Morgan Lee",
            email: "morgan.official@league.org",
            role: "OFFICIAL",
            status: "Active",
            sports: [
                "Basketball"
            ],
            availability: [
                "Weeknights",
                "Weekends"
            ]
        },
        {
            id: "user-official-2",
            name: "Riley Chen",
            email: "riley.official@league.org",
            role: "OFFICIAL",
            status: "Active",
            sports: [
                "Football",
                "Soccer"
            ],
            availability: [
                "Weekends"
            ]
        },
        {
            id: "user-coach",
            name: "Samira Patel",
            email: "spatel@harborview.edu",
            role: "COACH",
            status: "Active",
            sports: [
                "Soccer"
            ],
            availability: [
                "Weekdays"
            ]
        },
        {
            id: "user-viewer",
            name: "Casey Morgan",
            email: "casey.viewer@theofficial.app",
            role: "STAFF",
            status: "Active",
            sports: [
                "Basketball"
            ],
            availability: [
                "Observer"
            ]
        }
    ],
    events: [
        {
            id: "event-1",
            title: "Central Lions vs Riverdale Eagles",
            leagueId: "league-1",
            schoolId: "school-1",
            homeTeamId: "team-1",
            awayTeamId: "team-2",
            venueId: "venue-1",
            sport: "Basketball",
            level: "Varsity",
            start: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            end: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
            status: "Scheduled",
            notes: "Throwback night. Confirm halftime entertainment.",
            createdBy: "user-ad"
        },
        {
            id: "event-2",
            title: "Pelicans vs Wolves",
            leagueId: "league-2",
            schoolId: "school-3",
            homeTeamId: "team-3",
            awayTeamId: "team-4",
            venueId: "venue-3",
            sport: "Soccer",
            level: "Varsity",
            start: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            end: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
            status: "Scheduled",
            notes: "Streaming on regional network.",
            createdBy: "user-superadmin"
        },
        {
            id: "event-3",
            title: "North Ridge Wolves vs Coastal All-Stars",
            leagueId: "league-3",
            schoolId: "school-4",
            homeTeamId: "team-4",
            awayTeamId: "team-2",
            venueId: "venue-2",
            sport: "Football",
            level: "Varsity",
            start: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            end: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
            status: "Completed",
            notes: "Scout attendance confirmed.",
            createdBy: "user-ad"
        },
        {
            id: "event-4",
            title: "Summit Showcase vs Metro Elite",
            leagueId: "league-1",
            schoolId: "school-2",
            homeTeamId: "team-2",
            awayTeamId: "team-1",
            venueId: "venue-2",
            sport: "Basketball",
            level: "JV",
            start: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            end: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
            status: "Scheduled",
            notes: "Officials requested; highlight youth mentorship.",
            createdBy: "user-school-admin"
        },
        {
            id: "event-5",
            title: "Riverdale Invitational",
            leagueId: "league-2",
            schoolId: "school-3",
            homeTeamId: "team-3",
            awayTeamId: "team-4",
            venueId: "venue-3",
            sport: "Soccer",
            level: "Varsity",
            start: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            end: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
            status: "Scheduled",
            notes: "Streamed with multi-camera replay.",
            createdBy: "user-ad"
        }
    ],
    requests: [
        {
            id: "request-1",
            eventId: "event-1",
            userId: "user-official-1",
            status: "PENDING",
            submittedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
            message: "Available to work varsity basketball doubleheader."
        },
        {
            id: "request-2",
            eventId: "event-2",
            userId: "user-official-2",
            status: "APPROVED",
            submittedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
            message: "Certified for varsity soccer assignments."
        },
        {
            id: "request-3",
            eventId: "event-3",
            userId: "user-official-1",
            status: "DECLINED",
            submittedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            message: "Conflict with travel. Pending future availability."
        },
        {
            id: "request-4",
            eventId: "event-4",
            userId: "user-official-2",
            status: "PENDING",
            submittedAt: new Date(now.getTime() - 90 * 60 * 1000).toISOString(),
            message: "Available for showcase double-header."
        },
        {
            id: "request-5",
            eventId: "event-5",
            userId: "user-official-1",
            status: "PENDING",
            submittedAt: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
            message: "Can run center referee if needed."
        }
    ],
    assignments: [
        {
            id: "assignment-1",
            eventId: "event-2",
            userId: "user-official-2",
            position: "Referee Crew Chief",
            confirmedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString()
        },
        {
            id: "assignment-2",
            eventId: "event-1",
            userId: "user-official-1",
            position: "Lead Referee",
            confirmedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
            id: "assignment-3",
            eventId: "event-3",
            userId: "user-official-2",
            position: "Replay Official",
            confirmedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()
        }
    ],
    announcements: [
        {
            id: "announcement-1",
            title: "Playoff schedules lock on Friday",
            body: "Confirm travel approvals for round one. Officials can update postseason availability in the portal.",
            createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString()
        },
        {
            id: "announcement-2",
            title: "Officials onboarding session",
            body: "New basketball officials onboarding call is scheduled for Monday at 7pm ET.",
            createdAt: new Date(now.getTime() - 26 * 60 * 60 * 1000).toISOString()
        }
    ],
    featureFlags: {
        MOCK_DATA_ENABLED: true,
        EXPERIMENTAL_UI: false,
        BETA_ANALYTICS: true
    },
    waitlist: [
        {
            id: "demo-wl-1",
            name: "Jamie Rivera",
            organization: "Metro Catholic League",
            role: "AD",
            createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
            id: "demo-wl-2",
            name: "Taylor Brooks",
            organization: "Summit Officials Assoc.",
            role: "Official",
            createdAt: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString()
        }
    ],
    auditLogs: [
        {
            id: "audit-1",
            message: "Jordan Fisher approved Morgan Lee for Event 2",
            timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
            id: "audit-2",
            message: "Branding asset updated for Summit Athletic Association",
            timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString()
        },
        {
            id: "audit-3",
            message: "Feature flag EXPERIMENTAL_UI toggled off",
            timestamp: new Date(now.getTime() - 16 * 60 * 60 * 1000).toISOString()
        },
        {
            id: "audit-4",
            message: "Morgan Lee requested the Summit Showcase event",
            timestamp: new Date(now.getTime() - 50 * 60 * 1000).toISOString()
        },
        {
            id: "audit-5",
            message: "Dana Morales generated 12 sample teams for preview deck",
            timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
        }
    ],
    notifications: [
        {
            id: "notif-1",
            summary: "System health check: database, edge cache, and realtime services operational.",
            timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString()
        },
        {
            id: "notif-2",
            summary: "3 new officials completed onboarding this week.",
            timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
            id: "notif-3",
            summary: "Waitlist signups increased 18% after latest campaign.",
            timestamp: new Date(now.getTime() - 28 * 60 * 60 * 1000).toISOString()
        }
    ]
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/demo/_state/demoStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "personaOptions",
    ()=>personaOptions,
    "useDemoStore",
    ()=>useDemoStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$4$2e$5$2e$7_$40$types$2b$react$40$18$2e$3$2e$26_react$40$18$2e$3$2e$1$2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@4.5.7_@types+react@18.3.26_react@18.3.1/node_modules/zustand/esm/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$4$2e$5$2e$7_$40$types$2b$react$40$18$2e$3$2e$26_react$40$18$2e$3$2e$1$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zustand@4.5.7_@types+react@18.3.26_react@18.3.1/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$demo$2f$_data$2f$mockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/demo/_data/mockData.ts [app-client] (ecmascript)");
'use client';
;
;
;
const personaOptions = [
    {
        label: "League Admin",
        userId: "user-superadmin",
        summary: "Oversees league-wide operations and unlocks every control surface.",
        highlights: [
            "Launch seasons across multiple schools",
            "Approve budgets, staffing, and workflows",
            "Roll out new feature flags to programs"
        ]
    },
    {
        label: "School Admin",
        userId: "user-school-admin",
        summary: "Manages school schedules, teams, and coordinator workflows.",
        highlights: [
            "Publish schedules and manage venues",
            "Invite officials and assign staff",
            "Review approvals from coaches and ADs"
        ]
    },
    {
        label: "Athletic Director",
        userId: "user-ad",
        summary: "Reviews requests, confirms officials, and communicates with crews.",
        highlights: [
            "Approve or decline staffing requests",
            "Monitor assignment coverage",
            "Send updates to teams and officials"
        ]
    },
    {
        label: "Coach",
        userId: "user-coach",
        summary: "Keeps rosters, events, and communications aligned for teams.",
        highlights: [
            "Track schedules and roster availability",
            "Submit staffing requests for upcoming events",
            "Receive official confirmations in real time"
        ]
    },
    {
        label: "Official",
        userId: "user-official-1",
        summary: "Requests assignments and confirms availability on the go.",
        highlights: [
            "Request to work marquee events",
            "Update travel windows and certifications",
            "Track assignments and payouts"
        ]
    },
    {
        label: "Viewer",
        userId: "user-viewer",
        summary: "Observes schedules and dashboards without edit permissions.",
        highlights: [
            "Monitor upcoming events and alerts",
            "Follow assignment changes in real time",
            "Review activity feeds and analytics"
        ]
    }
];
const generateId = ()=>{
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID();
    }
    return `demo-${Math.random().toString(36).slice(2, 10)}`;
};
const addActivity = (activity, message)=>{
    const entry = {
        id: generateId(),
        message,
        timestamp: new Date().toISOString()
    };
    return [
        entry,
        ...activity
    ].slice(0, 40);
};
const initialPersona = personaOptions[0];
const initialUser = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$demo$2f$_data$2f$mockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockData"].users.find((user)=>user.id === initialPersona.userId) ?? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$demo$2f$_data$2f$mockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockData"].users[0];
const getUserById = (users, id)=>users.find((user)=>user.id === id);
const useDemoStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$4$2e$5$2e$7_$40$types$2b$react$40$18$2e$3$2e$26_react$40$18$2e$3$2e$1$2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$4$2e$5$2e$7_$40$types$2b$react$40$18$2e$3$2e$26_react$40$18$2e$3$2e$1$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        leagues: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$demo$2f$_data$2f$mockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockData"].leagues,
        schools: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$demo$2f$_data$2f$mockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockData"].schools,
        teams: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$demo$2f$_data$2f$mockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockData"].teams,
        venues: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$demo$2f$_data$2f$mockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockData"].venues,
        users: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$demo$2f$_data$2f$mockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockData"].users,
        events: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$demo$2f$_data$2f$mockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockData"].events,
        requests: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$demo$2f$_data$2f$mockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockData"].requests,
        assignments: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$demo$2f$_data$2f$mockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockData"].assignments,
        announcements: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$demo$2f$_data$2f$mockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockData"].announcements,
        waitlist: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$demo$2f$_data$2f$mockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockData"].waitlist,
        notifications: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$demo$2f$_data$2f$mockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockData"].notifications,
        featureFlags: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$demo$2f$_data$2f$mockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockData"].featureFlags,
        activity: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$demo$2f$_data$2f$mockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockData"].auditLogs,
        branding: {},
        rateLimits: {
            burst: 180,
            sustained: 1200
        },
        notesByEvent: {},
        activeUserId: initialUser.id,
        currentRole: initialUser.role,
        currentPersona: initialPersona.label,
        requestToWork: (eventId)=>{
            const state = get();
            if (state.currentRole !== "OFFICIAL") {
                set({
                    activity: addActivity(state.activity, "Tried to request work, but this persona cannot request assignments.")
                });
                return;
            }
            const user = getUserById(state.users, state.activeUserId);
            const event = state.events.find((e)=>e.id === eventId);
            if (!user || !event) return;
            const alreadyRequested = state.requests.some((req)=>req.eventId === eventId && req.userId === user.id && req.status === "PENDING");
            if (alreadyRequested) {
                set({
                    activity: addActivity(state.activity, `${user.name} already has a pending request for ${event.title}.`)
                });
                return;
            }
            const newRequest = {
                id: generateId(),
                eventId,
                userId: user.id,
                status: "PENDING",
                submittedAt: new Date().toISOString(),
                message: "Ready to work – added via interactive demo."
            };
            set({
                requests: [
                    newRequest,
                    ...state.requests
                ],
                activity: addActivity(state.activity, `${user.name} requested to work ${event.title}.`)
            });
        },
        approveRequest: (requestId)=>{
            const state = get();
            if (![
                "SUPER_ADMIN",
                "ADMIN",
                "AD"
            ].includes(state.currentRole)) {
                set({
                    activity: addActivity(state.activity, "Approval blocked — this persona does not have permission.")
                });
                return;
            }
            const request = state.requests.find((r)=>r.id === requestId);
            if (!request) return;
            const event = state.events.find((e)=>e.id === request.eventId);
            const user = getUserById(state.users, request.userId);
            const approver = getUserById(state.users, state.activeUserId);
            if (!event || !user || !approver) return;
            const updatedRequests = state.requests.map((req)=>req.id === requestId ? {
                    ...req,
                    status: "APPROVED"
                } : req);
            const assignment = {
                id: generateId(),
                eventId: request.eventId,
                userId: request.userId,
                position: `${event.sport} Official`,
                confirmedAt: new Date().toISOString()
            };
            set({
                requests: updatedRequests,
                assignments: [
                    assignment,
                    ...state.assignments
                ],
                activity: addActivity(state.activity, `${approver.name} approved ${user.name} for ${event.title}.`)
            });
        },
        declineRequest: (requestId)=>{
            const state = get();
            if (![
                "SUPER_ADMIN",
                "ADMIN",
                "AD"
            ].includes(state.currentRole)) {
                set({
                    activity: addActivity(state.activity, "Decline blocked — this persona does not have permission.")
                });
                return;
            }
            const request = state.requests.find((r)=>r.id === requestId);
            if (!request) return;
            const user = getUserById(state.users, request.userId);
            const event = state.events.find((e)=>e.id === request.eventId);
            const approver = getUserById(state.users, state.activeUserId);
            if (!user || !event || !approver) return;
            set({
                requests: state.requests.map((req)=>req.id === requestId ? {
                        ...req,
                        status: "DECLINED"
                    } : req),
                activity: addActivity(state.activity, `${approver.name} declined ${user.name} for ${event.title}.`)
            });
        },
        approveRequests: (requestIds)=>{
            const { approveRequest } = get();
            requestIds.forEach((id)=>{
                approveRequest(id);
            });
        },
        declineRequests: (requestIds)=>{
            const { declineRequest } = get();
            requestIds.forEach((id)=>{
                declineRequest(id);
            });
        },
        toggleFlag: (key)=>{
            const state = get();
            set({
                featureFlags: {
                    ...state.featureFlags,
                    [key]: !state.featureFlags[key]
                },
                activity: addActivity(state.activity, `${state.featureFlags[key] ? "Disabled" : "Enabled"} feature flag ${key}.`)
            });
        },
        generateSample: (count)=>{
            const state = get();
            const createdEvents = [];
            const createdSchools = [];
            const createdTeams = [];
            const now = Date.now();
            for(let i = 0; i < count; i += 1){
                const league = state.leagues[i % state.leagues.length] ?? state.leagues[0];
                const venue = state.venues[i % state.venues.length] ?? state.venues[0];
                const schoolId = generateId();
                const teamId = generateId();
                const opponent = state.teams[(i + 1) % state.teams.length];
                createdSchools.push({
                    id: schoolId,
                    leagueId: league.id,
                    name: `Sample Prep ${i + 1}`,
                    mascot: [
                        "Falcons",
                        "Chargers",
                        "Titans",
                        "Hawks"
                    ][i % 4],
                    city: [
                        "Asheville",
                        "Madison",
                        "Fairview",
                        "Brighton"
                    ][i % 4],
                    state: [
                        "NC",
                        "WI",
                        "OH",
                        "MI"
                    ][i % 4]
                });
                createdTeams.push({
                    id: teamId,
                    schoolId,
                    name: `Sample Prep ${i + 1} ${[
                        "Lions",
                        "Storm",
                        "Ravens",
                        "Bears"
                    ][i % 4]}`,
                    sport: opponent?.sport ?? "Basketball",
                    level: opponent?.level ?? "Varsity",
                    record: `${10 + i}-${i}`
                });
                createdEvents.push({
                    id: generateId(),
                    title: `${createdTeams[i]?.name ?? "Sample"} vs ${opponent?.name ?? "Opponent"}`,
                    leagueId: league.id,
                    schoolId,
                    homeTeamId: teamId,
                    awayTeamId: opponent?.id ?? state.teams[0]?.id ?? teamId,
                    venueId: venue.id,
                    sport: createdTeams[i]?.sport ?? "Basketball",
                    level: createdTeams[i]?.level ?? "Varsity",
                    start: new Date(now + (i + 1) * 3_600_000).toISOString(),
                    end: new Date(now + (i + 1.5) * 3_600_000).toISOString(),
                    status: "Scheduled",
                    notes: "Generated via demo tools.",
                    createdBy: state.activeUserId
                });
            }
            set({
                schools: [
                    ...createdSchools,
                    ...state.schools
                ],
                teams: [
                    ...createdTeams,
                    ...state.teams
                ],
                events: [
                    ...createdEvents,
                    ...state.events
                ],
                activity: addActivity(state.activity, `Generated ${count} sample schools, teams, and events for quick demos.`)
            });
        },
        wipeStore: ()=>{
            const state = get();
            set({
                events: [],
                requests: [],
                assignments: [],
                announcements: [],
                waitlist: [],
                activity: addActivity([], "Cleared demo data via dev tools.")
            });
        },
        reseed: ()=>{
            set({
                leagues: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$demo$2f$_data$2f$mockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockData"].leagues,
                schools: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$demo$2f$_data$2f$mockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockData"].schools,
                teams: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$demo$2f$_data$2f$mockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockData"].teams,
                venues: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$demo$2f$_data$2f$mockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockData"].venues,
                users: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$demo$2f$_data$2f$mockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockData"].users,
                events: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$demo$2f$_data$2f$mockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockData"].events,
                requests: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$demo$2f$_data$2f$mockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockData"].requests,
                assignments: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$demo$2f$_data$2f$mockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockData"].assignments,
                announcements: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$demo$2f$_data$2f$mockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockData"].announcements,
                waitlist: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$demo$2f$_data$2f$mockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockData"].waitlist,
                notifications: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$demo$2f$_data$2f$mockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockData"].notifications,
                activity: addActivity(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$demo$2f$_data$2f$mockData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockData"].auditLogs, "Reseeded demo store to defaults.")
            });
        },
        setBranding: (logoDataUrl)=>{
            const state = get();
            set({
                branding: {
                    logoDataUrl
                },
                activity: addActivity(state.activity, logoDataUrl ? "Updated brand logo for the dashboard." : "Cleared custom branding.")
            });
        },
        setRateLimits: (limits)=>{
            const state = get();
            set({
                rateLimits: limits,
                activity: addActivity(state.activity, `Adjusted rate limits to burst ${limits.burst}/min and sustained ${limits.sustained}/hr.`)
            });
        },
        updateNotes: (eventId, notes)=>{
            const state = get();
            set({
                notesByEvent: {
                    ...state.notesByEvent,
                    [eventId]: notes
                }
            });
        },
        setPersona: (personaLabel)=>{
            const state = get();
            const persona = personaOptions.find((option)=>option.label === personaLabel);
            if (!persona) return;
            const user = getUserById(state.users, persona.userId);
            if (!user) return;
            set({
                currentPersona: persona.label,
                activeUserId: persona.userId,
                currentRole: user.role,
                activity: addActivity(state.activity, `Switched persona to ${persona.label}.`)
            });
        },
        setRole: (role)=>{
            const state = get();
            set({
                currentRole: role,
                activity: addActivity(state.activity, `Switched role context to ${role}.`)
            });
        },
        logAction: (message)=>{
            const state = get();
            set({
                activity: addActivity(state.activity, message)
            });
        },
        updateUserRole: (userId, role)=>{
            const state = get();
            const actor = getUserById(state.users, state.activeUserId);
            if (!actor || actor.role !== "SUPER_ADMIN") return;
            set({
                users: state.users.map((user)=>user.id === userId ? {
                        ...user,
                        role
                    } : user),
                activity: addActivity(state.activity, `${actor.name} changed ${state.users.find((u)=>u.id === userId)?.name ?? "user"} to role ${role}.`)
            });
        }
    }), {
    name: "theofficialapp-demo-store",
    storage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zustand$40$4$2e$5$2e$7_$40$types$2b$react$40$18$2e$3$2e$26_react$40$18$2e$3$2e$1$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createJSONStorage"])(()=>localStorage),
    partialize: (state)=>({
            featureFlags: state.featureFlags,
            branding: state.branding,
            rateLimits: state.rateLimits,
            notesByEvent: state.notesByEvent,
            activeUserId: state.activeUserId,
            currentRole: state.currentRole,
            currentPersona: state.currentPersona
        })
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/Sidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Sidebar",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.1_@babel+core@7.28.5_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.1_@babel+core@7.28.5_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.1_@babel+core@7.28.5_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.1_@babel+core@7.28.5_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/nav.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$demo$2d$nav$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/demo-nav.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/sheet.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$demo$2f$_state$2f$demoStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/demo/_state/demoStore.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
function mapPath(variant, href) {
    if (variant === "demo") {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$demo$2d$nav$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapNavItemsToDemo"])([
            {
                label: "",
                href
            }
        ])[0]?.href ?? null;
    }
    return href;
}
function Sidebar({ initialRole, variant = "app", title = variant === "demo" ? "Demo" : "Navigation" }) {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])() ?? "/";
    const demoRole = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$demo$2f$_state$2f$demoStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDemoStore"])({
        "Sidebar.useDemoStore[demoRole]": (state)=>state.currentRole
    }["Sidebar.useDemoStore[demoRole]"]);
    const role = variant === "demo" ? demoRole : initialRole;
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const navItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Sidebar.useMemo[navItems]": ()=>{
            const items = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNavForRole"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeRole"])(role));
            if (variant === "demo") {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$demo$2d$nav$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapNavItemsToDemo"])(items);
            }
            return items;
        }
    }["Sidebar.useMemo[navItems]"], [
        role,
        variant
    ]);
    const navList = navItems.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "flex flex-col gap-1",
        "aria-label": "Primary",
        children: navItems.map((item)=>{
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: item.href,
                onClick: ()=>setOpen(false),
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-2xl px-4 py-2 text-sm font-medium text-muted-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent))]", isActive && "bg-[hsl(var(--accent)/0.15)] text-[hsl(var(--accent))] shadow-[0_0_0_1px_rgba(47,255,203,0.3)]", !isActive && "hover:text-foreground"),
                children: item.label
            }, item.href, false, {
                fileName: "[project]/components/Sidebar.tsx",
                lineNumber: 56,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/components/Sidebar.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        className: "text-xs text-muted-foreground",
        children: "No destinations for this role yet."
    }, void 0, false, {
        fileName: "[project]/components/Sidebar.tsx",
        lineNumber: 73,
        columnNumber: 5
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full rounded-3xl border border-border/60 bg-card/50 p-4 lg:w-64 lg:shrink-0 lg:border-transparent lg:bg-transparent lg:p-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "lg:hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sheet"], {
                    open: open,
                    onOpenChange: setOpen,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetTrigger"], {
                            asChild: true,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "outline",
                                className: "w-full border-border/70 text-sm text-muted-foreground",
                                children: [
                                    "Open ",
                                    title
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/Sidebar.tsx",
                                lineNumber: 81,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/Sidebar.tsx",
                            lineNumber: 80,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetContent"], {
                            side: "left",
                            className: "w-64 bg-background text-foreground",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs uppercase tracking-[0.3em] text-[hsl(var(--accent))]",
                                        children: title
                                    }, void 0, false, {
                                        fileName: "[project]/components/Sidebar.tsx",
                                        lineNumber: 90,
                                        columnNumber: 15
                                    }, this),
                                    navList
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/Sidebar.tsx",
                                lineNumber: 89,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/Sidebar.tsx",
                            lineNumber: 88,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/Sidebar.tsx",
                    lineNumber: 79,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/Sidebar.tsx",
                lineNumber: 78,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: "hidden lg:flex lg:flex-col lg:gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs uppercase tracking-[0.3em] text-[hsl(var(--accent))]",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/components/Sidebar.tsx",
                        lineNumber: 99,
                        columnNumber: 9
                    }, this),
                    navList
                ]
            }, void 0, true, {
                fileName: "[project]/components/Sidebar.tsx",
                lineNumber: 98,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/Sidebar.tsx",
        lineNumber: 77,
        columnNumber: 5
    }, this);
}
_s(Sidebar, "ftzy7dS7X2O5NWbHoCO1BMvixL0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$demo$2f$_state$2f$demoStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDemoStore"]
    ];
});
_c = Sidebar;
var _c;
__turbopack_context__.k.register(_c, "Sidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/select.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Select",
    ()=>Select,
    "SelectContent",
    ()=>SelectContent,
    "SelectGroup",
    ()=>SelectGroup,
    "SelectItem",
    ()=>SelectItem,
    "SelectLabel",
    ()=>SelectLabel,
    "SelectScrollDownButton",
    ()=>SelectScrollDownButton,
    "SelectScrollUpButton",
    ()=>SelectScrollUpButton,
    "SelectSeparator",
    ()=>SelectSeparator,
    "SelectTrigger",
    ()=>SelectTrigger,
    "SelectValue",
    ()=>SelectValue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.1_@babel+core@7.28.5_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.1_@babel+core@7.28.5_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$select$40$2$2e$2$2e$6_$40$types$2b$react$2d$dom$40$18$2e$3$2e$7_$40$types$2b$react$40$18$2e$3$2e$26_$5f40$types$2b$react_199ed6ad26a2c25a700b9dc4fae1b6cf$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-select@2.2.6_@types+react-dom@18.3.7_@types+react@18.3.26__@types+react_199ed6ad26a2c25a700b9dc4fae1b6cf/node_modules/@radix-ui/react-select/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$475$2e$0_react$40$18$2e$3$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.475.0_react@18.3.1/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$475$2e$0_react$40$18$2e$3$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.475.0_react@18.3.1/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$475$2e$0_react$40$18$2e$3$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.475.0_react@18.3.1/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
const Select = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$select$40$2$2e$2$2e$6_$40$types$2b$react$2d$dom$40$18$2e$3$2e$7_$40$types$2b$react$40$18$2e$3$2e$26_$5f40$types$2b$react_199ed6ad26a2c25a700b9dc4fae1b6cf$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"];
const SelectGroup = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$select$40$2$2e$2$2e$6_$40$types$2b$react$2d$dom$40$18$2e$3$2e$7_$40$types$2b$react$40$18$2e$3$2e$26_$5f40$types$2b$react_199ed6ad26a2c25a700b9dc4fae1b6cf$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"];
const SelectValue = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$select$40$2$2e$2$2e$6_$40$types$2b$react$2d$dom$40$18$2e$3$2e$7_$40$types$2b$react$40$18$2e$3$2e$26_$5f40$types$2b$react_199ed6ad26a2c25a700b9dc4fae1b6cf$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Value"];
const SelectTrigger = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$select$40$2$2e$2$2e$6_$40$types$2b$react$2d$dom$40$18$2e$3$2e$7_$40$types$2b$react$40$18$2e$3$2e$26_$5f40$types$2b$react_199ed6ad26a2c25a700b9dc4fae1b6cf$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
        ...props,
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$select$40$2$2e$2$2e$6_$40$types$2b$react$2d$dom$40$18$2e$3$2e$7_$40$types$2b$react$40$18$2e$3$2e$26_$5f40$types$2b$react_199ed6ad26a2c25a700b9dc4fae1b6cf$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$475$2e$0_react$40$18$2e$3$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                    className: "h-4 w-4 opacity-50"
                }, void 0, false, {
                    fileName: "[project]/components/ui/select.jsx",
                    lineNumber: 25,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/components/ui/select.jsx",
                lineNumber: 24,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/select.jsx",
        lineNumber: 16,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = SelectTrigger;
SelectTrigger.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$select$40$2$2e$2$2e$6_$40$types$2b$react$2d$dom$40$18$2e$3$2e$7_$40$types$2b$react$40$18$2e$3$2e$26_$5f40$types$2b$react_199ed6ad26a2c25a700b9dc4fae1b6cf$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"].displayName;
const SelectScrollUpButton = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$select$40$2$2e$2$2e$6_$40$types$2b$react$2d$dom$40$18$2e$3$2e$7_$40$types$2b$react$40$18$2e$3$2e$26_$5f40$types$2b$react_199ed6ad26a2c25a700b9dc4fae1b6cf$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollUpButton"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex cursor-default items-center justify-center py-1", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$475$2e$0_react$40$18$2e$3$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/components/ui/select.jsx",
            lineNumber: 36,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/ui/select.jsx",
        lineNumber: 32,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c2 = SelectScrollUpButton;
SelectScrollUpButton.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$select$40$2$2e$2$2e$6_$40$types$2b$react$2d$dom$40$18$2e$3$2e$7_$40$types$2b$react$40$18$2e$3$2e$26_$5f40$types$2b$react_199ed6ad26a2c25a700b9dc4fae1b6cf$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollUpButton"].displayName;
const SelectScrollDownButton = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$select$40$2$2e$2$2e$6_$40$types$2b$react$2d$dom$40$18$2e$3$2e$7_$40$types$2b$react$40$18$2e$3$2e$26_$5f40$types$2b$react_199ed6ad26a2c25a700b9dc4fae1b6cf$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollDownButton"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex cursor-default items-center justify-center py-1", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$475$2e$0_react$40$18$2e$3$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/components/ui/select.jsx",
            lineNumber: 46,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/ui/select.jsx",
        lineNumber: 42,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c3 = SelectScrollDownButton;
SelectScrollDownButton.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$select$40$2$2e$2$2e$6_$40$types$2b$react$2d$dom$40$18$2e$3$2e$7_$40$types$2b$react$40$18$2e$3$2e$26_$5f40$types$2b$react_199ed6ad26a2c25a700b9dc4fae1b6cf$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollDownButton"].displayName;
const SelectContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c4 = ({ className, children, position = "popper", ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$select$40$2$2e$2$2e$6_$40$types$2b$react$2d$dom$40$18$2e$3$2e$7_$40$types$2b$react$40$18$2e$3$2e$26_$5f40$types$2b$react_199ed6ad26a2c25a700b9dc4fae1b6cf$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$select$40$2$2e$2$2e$6_$40$types$2b$react$2d$dom$40$18$2e$3$2e$7_$40$types$2b$react$40$18$2e$3$2e$26_$5f40$types$2b$react_199ed6ad26a2c25a700b9dc4fae1b6cf$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
            ref: ref,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
            position: position,
            ...props,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SelectScrollUpButton, {}, void 0, false, {
                    fileName: "[project]/components/ui/select.jsx",
                    lineNumber: 64,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$select$40$2$2e$2$2e$6_$40$types$2b$react$2d$dom$40$18$2e$3$2e$7_$40$types$2b$react$40$18$2e$3$2e$26_$5f40$types$2b$react_199ed6ad26a2c25a700b9dc4fae1b6cf$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Viewport"], {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
                    children: children
                }, void 0, false, {
                    fileName: "[project]/components/ui/select.jsx",
                    lineNumber: 65,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SelectScrollDownButton, {}, void 0, false, {
                    fileName: "[project]/components/ui/select.jsx",
                    lineNumber: 70,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/components/ui/select.jsx",
            lineNumber: 54,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/ui/select.jsx",
        lineNumber: 53,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c5 = SelectContent;
SelectContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$select$40$2$2e$2$2e$6_$40$types$2b$react$2d$dom$40$18$2e$3$2e$7_$40$types$2b$react$40$18$2e$3$2e$26_$5f40$types$2b$react_199ed6ad26a2c25a700b9dc4fae1b6cf$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"].displayName;
const SelectLabel = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c6 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$select$40$2$2e$2$2e$6_$40$types$2b$react$2d$dom$40$18$2e$3$2e$7_$40$types$2b$react$40$18$2e$3$2e$26_$5f40$types$2b$react_199ed6ad26a2c25a700b9dc4fae1b6cf$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-2 py-1.5 text-sm font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/select.jsx",
        lineNumber: 77,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c7 = SelectLabel;
SelectLabel.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$select$40$2$2e$2$2e$6_$40$types$2b$react$2d$dom$40$18$2e$3$2e$7_$40$types$2b$react$40$18$2e$3$2e$26_$5f40$types$2b$react_199ed6ad26a2c25a700b9dc4fae1b6cf$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"].displayName;
const SelectItem = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c8 = ({ className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$select$40$2$2e$2$2e$6_$40$types$2b$react$2d$dom$40$18$2e$3$2e$7_$40$types$2b$react$40$18$2e$3$2e$26_$5f40$types$2b$react_199ed6ad26a2c25a700b9dc4fae1b6cf$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$select$40$2$2e$2$2e$6_$40$types$2b$react$2d$dom$40$18$2e$3$2e$7_$40$types$2b$react$40$18$2e$3$2e$26_$5f40$types$2b$react_199ed6ad26a2c25a700b9dc4fae1b6cf$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemIndicator"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$475$2e$0_react$40$18$2e$3$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/select.jsx",
                        lineNumber: 94,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/components/ui/select.jsx",
                    lineNumber: 93,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/components/ui/select.jsx",
                lineNumber: 92,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$select$40$2$2e$2$2e$6_$40$types$2b$react$2d$dom$40$18$2e$3$2e$7_$40$types$2b$react$40$18$2e$3$2e$26_$5f40$types$2b$react_199ed6ad26a2c25a700b9dc4fae1b6cf$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemText"], {
                children: children
            }, void 0, false, {
                fileName: "[project]/components/ui/select.jsx",
                lineNumber: 97,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/select.jsx",
        lineNumber: 85,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c9 = SelectItem;
SelectItem.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$select$40$2$2e$2$2e$6_$40$types$2b$react$2d$dom$40$18$2e$3$2e$7_$40$types$2b$react$40$18$2e$3$2e$26_$5f40$types$2b$react_199ed6ad26a2c25a700b9dc4fae1b6cf$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"].displayName;
const SelectSeparator = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c10 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$select$40$2$2e$2$2e$6_$40$types$2b$react$2d$dom$40$18$2e$3$2e$7_$40$types$2b$react$40$18$2e$3$2e$26_$5f40$types$2b$react_199ed6ad26a2c25a700b9dc4fae1b6cf$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("-mx-1 my-1 h-px bg-muted", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/select.jsx",
        lineNumber: 103,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c11 = SelectSeparator;
SelectSeparator.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$select$40$2$2e$2$2e$6_$40$types$2b$react$2d$dom$40$18$2e$3$2e$7_$40$types$2b$react$40$18$2e$3$2e$26_$5f40$types$2b$react_199ed6ad26a2c25a700b9dc4fae1b6cf$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"].displayName;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11;
__turbopack_context__.k.register(_c, "SelectTrigger$React.forwardRef");
__turbopack_context__.k.register(_c1, "SelectTrigger");
__turbopack_context__.k.register(_c2, "SelectScrollUpButton");
__turbopack_context__.k.register(_c3, "SelectScrollDownButton");
__turbopack_context__.k.register(_c4, "SelectContent$React.forwardRef");
__turbopack_context__.k.register(_c5, "SelectContent");
__turbopack_context__.k.register(_c6, "SelectLabel$React.forwardRef");
__turbopack_context__.k.register(_c7, "SelectLabel");
__turbopack_context__.k.register(_c8, "SelectItem$React.forwardRef");
__turbopack_context__.k.register(_c9, "SelectItem");
__turbopack_context__.k.register(_c10, "SelectSeparator$React.forwardRef");
__turbopack_context__.k.register(_c11, "SelectSeparator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/select.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Select",
    ()=>Select,
    "SelectContent",
    ()=>SelectContent,
    "SelectItem",
    ()=>SelectItem,
    "SelectTrigger",
    ()=>SelectTrigger,
    "SelectValue",
    ()=>SelectValue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/select.jsx [app-client] (ecmascript)");
;
const Select = __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"];
const SelectContent = __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"];
const SelectItem = __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"];
const SelectTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"];
const SelectValue = __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/demo/_components/DemoShell.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DemoShell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.1_@babel+core@7.28.5_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.1_@babel+core@7.28.5_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.1_@babel+core@7.28.5_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.1_@babel+core@7.28.5_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/select.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/use-toast.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$site$2f$theme$2d$toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/site/theme-toggle.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$demo$2d$nav$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/demo-nav.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/nav.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$demo$2f$_state$2f$demoStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/demo/_state/demoStore.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
function DemoShell({ children }) {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const branding = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$demo$2f$_state$2f$demoStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDemoStore"])({
        "DemoShell.useDemoStore[branding]": (state)=>state.branding
    }["DemoShell.useDemoStore[branding]"]);
    const currentPersona = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$demo$2f$_state$2f$demoStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDemoStore"])({
        "DemoShell.useDemoStore[currentPersona]": (state)=>state.currentPersona
    }["DemoShell.useDemoStore[currentPersona]"]);
    const currentRole = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$demo$2f$_state$2f$demoStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDemoStore"])({
        "DemoShell.useDemoStore[currentRole]": (state)=>state.currentRole
    }["DemoShell.useDemoStore[currentRole]"]);
    const setPersona = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$demo$2f$_state$2f$demoStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDemoStore"])({
        "DemoShell.useDemoStore[setPersona]": (state)=>state.setPersona
    }["DemoShell.useDemoStore[setPersona]"]);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { toast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const allowedPaths = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DemoShell.useMemo[allowedPaths]": ()=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$demo$2d$nav$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapNavItemsToDemo"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNavForRole"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$nav$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["normalizeRole"])(currentRole)));
        }
    }["DemoShell.useMemo[allowedPaths]"], [
        currentRole
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DemoShell.useEffect": ()=>{
            if (!pathname?.startsWith("/demo")) return;
            const isAllowed = allowedPaths.some({
                "DemoShell.useEffect.isAllowed": (item)=>pathname === item.href || pathname.startsWith(`${item.href}/`)
            }["DemoShell.useEffect.isAllowed"]);
            if (!isAllowed) {
                router.replace("/demo");
                toast({
                    title: "You don't have access to that demo tab",
                    description: "Switch personas to preview restricted workflows."
                });
            }
        }
    }["DemoShell.useEffect"], [
        allowedPaths,
        pathname,
        router,
        toast
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex min-h-screen flex-col bg-background lg:flex-row",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sidebar"], {
                variant: "demo",
                title: "Demo"
            }, void 0, false, {
                fileName: "[project]/app/demo/_components/DemoShell.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-1 flex-col",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "border-b border-border bg-background/80 px-4 py-4 backdrop-blur",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/",
                                                className: "text-sm font-semibold text-foreground",
                                                children: "The Official App"
                                            }, void 0, false, {
                                                fileName: "[project]/app/demo/_components/DemoShell.tsx",
                                                lineNumber: 64,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "rounded-full border border-[hsl(var(--accent)/0.3)] bg-[hsl(var(--accent)/0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[hsl(var(--accent))]",
                                                children: "Interactive Demo"
                                            }, void 0, false, {
                                                fileName: "[project]/app/demo/_components/DemoShell.tsx",
                                                lineNumber: 67,
                                                columnNumber: 15
                                            }, this),
                                            branding.logoDataUrl ? // eslint-disable-next-line @next/next/no-img-element
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: branding.logoDataUrl,
                                                alt: "Custom logo",
                                                className: "hidden h-8 w-8 rounded-full object-cover lg:block"
                                            }, void 0, false, {
                                                fileName: "[project]/app/demo/_components/DemoShell.tsx",
                                                lineNumber: 72,
                                                columnNumber: 17
                                            }, this) : null
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/demo/_components/DemoShell.tsx",
                                        lineNumber: 63,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PersonaSelect, {
                                                currentPersona: currentPersona,
                                                setPersona: setPersona,
                                                currentRole: currentRole
                                            }, void 0, false, {
                                                fileName: "[project]/app/demo/_components/DemoShell.tsx",
                                                lineNumber: 80,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$site$2f$theme$2d$toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeToggle"], {}, void 0, false, {
                                                fileName: "[project]/app/demo/_components/DemoShell.tsx",
                                                lineNumber: 85,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/demo/_components/DemoShell.tsx",
                                        lineNumber: 79,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/demo/_components/DemoShell.tsx",
                                lineNumber: 62,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-4 text-xs uppercase tracking-[0.3em] text-[hsl(var(--accent))]",
                                children: [
                                    "Demo / ",
                                    formatBreadcrumb(pathname ?? "/demo")
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/demo/_components/DemoShell.tsx",
                                lineNumber: 88,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/demo/_components/DemoShell.tsx",
                        lineNumber: 61,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "flex-1 overflow-y-auto bg-background px-6 pb-16 pt-10",
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/app/demo/_components/DemoShell.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/demo/_components/DemoShell.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/demo/_components/DemoShell.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
_s(DemoShell, "Il6hy9PXYKp8KuW7D2HcmZ5eFqA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$demo$2f$_state$2f$demoStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDemoStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$demo$2f$_state$2f$demoStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDemoStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$demo$2f$_state$2f$demoStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDemoStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$demo$2f$_state$2f$demoStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDemoStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c = DemoShell;
function PersonaSelect({ currentPersona, setPersona, currentRole }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-xs uppercase tracking-[0.3em] text-muted-foreground",
                children: "Role"
            }, void 0, false, {
                fileName: "[project]/app/demo/_components/DemoShell.tsx",
                lineNumber: 111,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                value: currentPersona,
                onValueChange: setPersona,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                        className: "w-48 border-none bg-transparent text-sm text-foreground focus:ring-0 focus:ring-offset-0",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {
                            placeholder: "Select role"
                        }, void 0, false, {
                            fileName: "[project]/app/demo/_components/DemoShell.tsx",
                            lineNumber: 116,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/demo/_components/DemoShell.tsx",
                        lineNumber: 115,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                        className: "bg-card text-card-foreground",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$demo$2f$_state$2f$demoStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["personaOptions"].map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                value: option.label,
                                children: option.label
                            }, option.label, false, {
                                fileName: "[project]/app/demo/_components/DemoShell.tsx",
                                lineNumber: 120,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/demo/_components/DemoShell.tsx",
                        lineNumber: 118,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/demo/_components/DemoShell.tsx",
                lineNumber: 114,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$1_$40$babel$2b$core$40$7$2e$28$2e$5_react$2d$dom$40$18$2e$3$2e$1_react$40$18$2e$3$2e$1_$5f$react$40$18$2e$3$2e$1$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "rounded-full bg-[hsl(var(--accent)/0.15)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--accent))]",
                children: currentRole
            }, void 0, false, {
                fileName: "[project]/app/demo/_components/DemoShell.tsx",
                lineNumber: 126,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/demo/_components/DemoShell.tsx",
        lineNumber: 110,
        columnNumber: 5
    }, this);
}
_c1 = PersonaSelect;
function formatBreadcrumb(pathname) {
    const normalized = pathname.replace("/demo", "") || "/";
    if (normalized === "/") return "Overview";
    return normalized.split("/").filter(Boolean).map((segment)=>segment.replace(/-/g, " ")).map((segment)=>segment.charAt(0).toUpperCase() + segment.slice(1)).join(" / ");
}
var _c, _c1;
__turbopack_context__.k.register(_c, "DemoShell");
__turbopack_context__.k.register(_c1, "PersonaSelect");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_9ea9d169._.js.map
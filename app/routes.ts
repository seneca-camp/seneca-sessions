import {
    type RouteConfig,
    route,
    index,
    layout,
    prefix,
} from "@react-router/dev/routes";

export default [
    layout("./routes/layout.tsx", [
        index("./routes/index.tsx"),
        route("rooms", "./routes/rooms.tsx"),
    ]),
    ...prefix("admin", [
        layout("./routes/admin/layout.tsx", [
            index("./routes/admin/index.tsx"),
            route("schedule/:scheduleId", "./routes/admin/schedule.$scheduleId.tsx"),
        ])
    ])
] satisfies RouteConfig;

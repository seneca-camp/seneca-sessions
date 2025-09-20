import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./routes/layout.tsx", [
    index("./routes/index.tsx"),
    route("rooms", "./routes/rooms.tsx"),
    route("api/likes/sync", "./routes/api.likes.sync.tsx"),
  ]),
  ...prefix("admin", [
    layout("./routes/admin/layout.tsx", [
      index("./routes/admin/index.tsx"),
      route("rooms", "./routes/admin/rooms.tsx"),
      route("schedule/:scheduleId", "./routes/admin/schedule.$scheduleId.tsx"),
    ]),
  ]),
] satisfies RouteConfig;

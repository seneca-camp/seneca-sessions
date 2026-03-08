import { db } from "~/utils/db.server";
import { ActionFunctionArgs, redirect, useLoaderData } from "react-router";
import {
  createSchedule,
  deleteSchedule,
  toggleVisibility,
} from "~/models/schedule";
import { DeleteForm } from "~/components/DeleteForm";
import { ListItem } from "~/components/ui/ListItem";
import Button from "~/components/ui/Button";
import { Schedule } from "~/generated/client";

export const loader = async () => {
  const schedules = await db.schedule.findMany({ orderBy: { date: "asc" } });
  return schedules;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const type = form.get("type")?.toString() ?? "";

  if (type === "toggleVisibility") {
    await toggleVisibility(form);
  }
  if (type === "create") {
    const schedule = await createSchedule(form);
    if ("error" in schedule) {
      return schedule.error;
    }
    return redirect(`/admin/schedule/${schedule.id}`);
  }
  if (type === "delete") {
    await deleteSchedule(form);
  }
};

export default function IndexRoute() {
  const schedules = useLoaderData<typeof loader>();

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="mb-4 text-2xl font-bold leading-none tracking-tight text-white">
        Schedules
      </h1>
      <ul className="space-y-2">
        {schedules.length > 0 && <Schedules schedules={schedules} />}
        {schedules.length === 0 && (
          <li className="text-gray-300">No schedules yet.</li>
        )}
      </ul>

      <h1 className="mb-4 text-2xl font-bold leading-none tracking-tight text-white">
        Create Schedule
      </h1>
      <CreateScheduleForm />
    </div>
  );
}

function Schedules({ schedules }: { schedules: Schedule[] }) {
  return schedules.map((s) => (
    <ListItem className="flex flex-row justify-between items-center" key={s.id}>
      <a
        className="text-white text-2xl hover:underline"
        href={`/admin/schedule/${s.id}`}
      >
        {s.name}
      </a>
      <div className="text-gray-20 text-sm">
        {new Date(s.date).toLocaleDateString()}
      </div>
      <div className="flex flex-row items-center gap-2">
        <form method="post">
          <input type="hidden" name="type" value="toggleVisibility" />
          <input type="hidden" name="scheduleId" value={s.id} />
          <Button
            variant={s.isPublic ? "solid" : "outline"}
            aria-label={s.isPublic ? "Make private" : "Make public"}
            color={s.isPublic ? "primary" : "neutral"}
            type="submit"
          >
            <i className={s.isPublic ? "ri-eye-line" : "ri-eye-off-line"}></i>
            <span className="ml-2">{s.isPublic ? "Public" : "Private"}</span>
          </Button>
        </form>
        <DeleteForm id={s.id}>
          <i className="ri-delete-bin-line text-white text-2xl"></i>
        </DeleteForm>
      </div>
    </ListItem>
  ));
}

function CreateScheduleForm() {
  return (
    <form
      method="post"
      className="bg-gray-90 rounded-lg shadow-md px-8 pt-6 pb-8"
    >
      <input type="hidden" name="type" value="create" />
      <div className="mb-4">
        <label className="block text-gray-20 text-sm font-bold mb-2">
          Name
          <input
            type="text"
            name="name"
            className="mt-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-20 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="block text-gray-20 text-sm font-bold mb-2">
          Date
          <input
            type="date"
            name="date"
            className="dark:[color-scheme:dark] mt-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-20 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </label>
      </div>
      <Button type="submit">Create</Button>
    </form>
  );
}

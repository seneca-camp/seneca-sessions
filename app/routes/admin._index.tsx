import { db } from "~/utils/db.server";
import { ActionFunctionArgs, LoaderFunctionArgs, redirect, useLoaderData } from "react-router";
import { createSchedule, deleteSchedule, toggleVisibility } from "~/models/schedule";
import { DeleteForm } from "~/components/DeleteForm";

export const loader = async (_args: LoaderFunctionArgs) => {
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
      <div>
        <h1 className="mb-4 text-2xl font-bold leading-none tracking-tight text-white">Schedules</h1>
        <ul className="space-y-2">
          {schedules.map(s => (
            <li key={s.id} className="bg-white rounded px-4 py-3 shadow flex flex-row justify-between items-center">
              <a className="text-blue-600 hover:underline" href={`/admin/schedule/${s.id}`}>
                {s.name}
              </a>
              <div className="text-gray-600 text-sm">
                {new Date(s.date).toLocaleDateString()}
              </div>
              <div className="flex flex-row items-center gap-2">
                <form method="post">
                  <input type="hidden" name="type" value="toggleVisibility" />
                  <input type="hidden" name="scheduleId" value={s.id} />
                  <button type="submit" className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline cursor-pointer flex flex-row items-center ${s.isPublic ? "bg-blue-500 hover:bg-blue-700" : "bg-gray-500 hover:bg-gray-700"}`}>
                    <input type="hidden" name="type" value="toggleVisibility" />
                    <i className={s.isPublic ? "ri-eye-line" : "ri-eye-off-line"}></i>
                    <span className="ml-2">
                      {s.isPublic ? "Public" : "Private"}
                    </span>
                  </button>
                </form>
                <DeleteForm id={s.id}>
                  <i className="ri-delete-bin-line text-2xl"></i>
                </DeleteForm>
              </div>
            </li>
          ))}
          {schedules.length === 0 && (
            <li className="text-gray-300">No schedules yet.</li>
          )}
        </ul>
      </div>

      <div>
        <h2 className="mb-2 text-xl font-semibold text-white">Create Schedule</h2>
        <form method="post" className="bg-white shadow-md rounded px-8 pt-6 pb-8">
          <input type="hidden" name="type" value="create" />
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Name
              <input
                type="text"
                name="name"
                className="mt-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Date
              <input
                type="date"
                name="date"
                className="mt-1 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </label>
          </div>
          <div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

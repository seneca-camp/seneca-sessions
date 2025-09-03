import { db } from "~/utils/db.server";
import { ActionFunctionArgs, LoaderFunctionArgs, redirect, useLoaderData } from "react-router";

export const loader = async (_args: LoaderFunctionArgs) => {
  const schedules = await db.schedule.findMany({ orderBy: { date: "asc" } });
  return schedules;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const name = form.get("name")?.toString() ?? "";
  const dateInput = form.get("date")?.toString() ?? "";

  if (!name.trim() || !dateInput.trim()) {
    return { error: "Name and date are required." };
  }

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    return { error: "Invalid date format." };
  }

  const schedule = await db.schedule.create({ data: { name, date } });
  return redirect(`/admin/${schedule.id}`);
};

export default function IndexRoute(){
  const schedules = useLoaderData<typeof loader>();

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="mb-4 text-2xl font-bold leading-none tracking-tight text-white">Schedules</h1>
        <ul className="space-y-2">
          {schedules.map(s => (
            <li key={s.id} className="bg-white rounded px-4 py-3 shadow flex flex-row justify-between">
              <a className="text-blue-600 hover:underline" href={`/admin/${s.id}`}>
                {s.name}
              </a>
              <div className="text-gray-600 text-sm">
                {new Date(s.date).toLocaleDateString()}
              </div>
              <div className="text-gray-600 text-sm">
                {s.isPublic ? "Published" : "Unpublished"}
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

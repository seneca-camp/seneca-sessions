import { ActionFunctionArgs, useLoaderData } from "react-router";
import { DeleteForm } from "~/components/DeleteForm";
import Button from "~/components/ui/Button";
import { ListItem } from "~/components/ui/ListItem";
import {
    createRoom,
    deleteRoom,
    getRooms,
    moveRoomDown,
    moveRoomUp,
    renameRoom,
} from "~/models/rooms";

export const loader = async () => {
  const rooms = await getRooms();
  return { rooms };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const type = form.get("type")?.toString() ?? "";

  if (type === "create") {
    const name = form.get("name")?.toString() ?? "";
    return await createRoom(name);
  }
  if (type === "rename") {
    const id = form.get("id")?.toString() ?? "";
    const name = form.get("name")?.toString() ?? "";
    return await renameRoom(id, name);
  }
  if (type === "delete") {
    const id = form.get("id")?.toString() ?? "";
    return await deleteRoom(id);
  }
  if (type === "moveUp") {
    const id = form.get("id")?.toString() ?? "";
    return await moveRoomUp(id);
  }
  if (type === "moveDown") {
    const id = form.get("id")?.toString() ?? "";
    return await moveRoomDown(id);
  }
};

export default function AdminRoomsRoute() {
  const { rooms } = useLoaderData<typeof loader>();
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="mb-4 text-2xl font-bold leading-none tracking-tight text-white">
        Rooms
      </h1>
      <ul className="space-y-2">
        {rooms.length > 0 &&
          rooms.map((room, index) => (
            <ListItem
              key={room.id}
              className="flex flex-row justify-between items-center gap-2"
            >
              <div className="flex-1 text-white text-xl">{room.name}</div>
              <div className="flex flex-row items-center gap-2">
                <form method="post">
                  <input type="hidden" name="type" value="moveUp" />
                  <input type="hidden" name="id" value={room.id} />
                  <Button
                    type="submit"
                    variant="ghost"
                    color="neutral"
                    aria-label="Move up"
                    disabled={index === 0}
                  >
                    <i className="ri-arrow-up-line"></i>
                  </Button>
                </form>
                <form method="post">
                  <input type="hidden" name="type" value="moveDown" />
                  <input type="hidden" name="id" value={room.id} />
                  <Button
                    type="submit"
                    variant="ghost"
                    color="neutral"
                    aria-label="Move down"
                    disabled={index === rooms.length - 1}
                  >
                    <i className="ri-arrow-down-line"></i>
                  </Button>
                </form>
                <RenameForm id={room.id} name={room.name} />
                <DeleteForm id={room.id}>
                  <i className="ri-delete-bin-line text-white text-2xl"></i>
                </DeleteForm>
              </div>
            </ListItem>
          ))}
        {rooms.length === 0 && (
          <li className="text-gray-300">No rooms yet.</li>
        )}
      </ul>

      <h2 className="mb-4 text-2xl font-bold leading-none tracking-tight text-white">
        Create Room
      </h2>
      <CreateRoomForm />
    </div>
  );
}

function CreateRoomForm() {
  return (
    <form method="post" className="bg-gray-90 rounded-lg px-8 pt-6 pb-8">
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
      <Button type="submit">Create</Button>
    </form>
  );
}

function RenameForm({ id, name }: { id: string; name: string }) {
  return (
    <form method="post" className="flex flex-row items-center gap-2">
      <input type="hidden" name="type" value="rename" />
      <input type="hidden" name="id" value={id} />
      <input
        type="text"
        name="name"
        defaultValue={name}
        className="shadow appearance-none border rounded py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
      />
      <Button type="submit" variant="outline" color="neutral">
        Save
      </Button>
    </form>
  );
}



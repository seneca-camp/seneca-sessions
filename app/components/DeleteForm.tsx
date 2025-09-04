export function DeleteForm({id}: {id: string}) {
    const confirmDelete = (e: React.FormEvent<HTMLFormElement>) => {
        if (!confirm("Are you sure you? This cannot be undone!")) {
            e.preventDefault();
        }
    }

    return (
        <form method="post" onSubmit={confirmDelete}>
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="type" value="delete" />
            <button type="submit" className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline cursor-pointer flex flex-row items-center">
                <i className="ri-delete-bin-line"></i>
            </button>
        </form>
    );
}
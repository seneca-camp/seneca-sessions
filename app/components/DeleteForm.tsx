export function DeleteForm({id, children}: {id: string} & React.PropsWithChildren) {
    const confirmDelete = (e: React.FormEvent<HTMLFormElement>) => {
        if (!confirm("Are you sure you? This cannot be undone!")) {
            e.preventDefault();
        }
    }

    return (
        <form method="post" onSubmit={confirmDelete}>
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="type" value="delete" />
            <button type="submit" className={`rounded cursor-pointer`} aria-label="Delete">
                {children}
            </button>
        </form>
    );
}
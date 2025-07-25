import { useQuery } from "@tanstack/react-query";
import { fetchNotes, deleteNote } from "../../services/noteService";
import type { Note } from "../../types/note";
import css from "./NoteList.module.css";

interface NoteListProps {
  page: number;
  search: string;
}

function NoteList({ page, search }: NoteListProps) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes({ page, perPage: 12, search }),
  });

  const handleDelete = async (id: string) => {
    await deleteNote(id);
    refetch();
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError || !data) return <p>Error loading notes.</p>;
  if (data.results.length === 0) return <p>No notes found.</p>;

  return (
    <ul className={css.list}>
      {data.results.map((note: Note) => (
        <li className={css.listItem} key={note.id}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              onClick={() => handleDelete(note.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default NoteList;

import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import SearchBox from "../SearchBox/SearchBox";
import { Pagination } from "../Pagination/Pagination";
import NoteList from "../NoteList/NoteList";
import { NoteForm } from "../NoteForm/NoteForm";
import { Modal } from "../Modal/Modal";
import { fetchNotes, createNote } from "../../services/noteService";
import type {
  FetchNotesResponse,
  CreateNotePayload,
  Note,
} from "../../services/noteService";
import css from "./App.module.css";

function App() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);

  const queryClient = useQueryClient();

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data, isLoading, isError } = useQuery<FetchNotesResponse, Error>({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () => fetchNotes({ page, perPage: 12, search: debouncedSearch }),
  });

  const createNoteMutation = useMutation<Note, Error, CreateNotePayload>({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setShowModal(false);
    },
  });

  const handleAddNote = (title: string, content: string) => {
    createNoteMutation.mutate({
      title,
      content,
      tag: "Todo",
    });
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} />
        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        )}
        <button className={css.button} onClick={() => setShowModal(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading notes.</p>}
      {data && data.results.length === 0 && <p>No notes found.</p>}

      {data && data.results.length > 0 && (
        <NoteList page={page} search={debouncedSearch} />
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <NoteForm
          onSubmit={handleAddNote}
          onSuccess={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
}

export default App;

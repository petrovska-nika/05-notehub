import { useState } from "react";
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
  NoteTag,
} from "../../services/noteService";

import css from "./App.module.css";

function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [debouncedQuery] = useDebounce(query, 500);

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<FetchNotesResponse, Error>({
    queryKey: ["notes", page, debouncedQuery],
    queryFn: () => fetchNotes({ page, perPage: 12, search: debouncedQuery }),
    placeholderData: (prev) => prev,
  });

  const createNoteMutation = useMutation<Note, Error, CreateNotePayload>({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleSearchChange = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const handleAddNote = (title: string, content: string, tag: NoteTag) => {
    createNoteMutation.mutate({ title, content, tag });
    setShowModal(false);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={query} onChange={handleSearchChange} />
        <button className={css.button} onClick={() => setShowModal(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading notes.</p>}

      {data && data.notes.length > 0 && (
        <>
          <NoteList notes={data.notes} />
          {data.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={data.totalPages}
              onPageChange={(newPage) => setPage(newPage)}
            />
          )}
        </>
      )}

      {data && data.notes.length === 0 && <p>No notes found.</p>}

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

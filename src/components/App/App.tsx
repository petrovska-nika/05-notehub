import { useState } from "react";
import { useDebounce } from "use-debounce";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SearchBox from "../SearchBox/SearchBox";
import { Pagination } from "../Pagination/Pagination";
import NoteList from "../NoteList/NoteList";
import { NoteForm } from "../NoteForm/NoteForm";
import { Modal } from "../Modal/Modal";
import css from "./App.module.css";

const queryClient = new QueryClient();

function App() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);

  const handleAddNote = (title: string, content: string) => {
    console.log("Нова нотатка:", { title, content });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox value={search} onChange={setSearch} />
          <Pagination
            currentPage={page}
            totalPages={10}
            onPageChange={setPage}
          />
          <button className={css.button} onClick={() => setShowModal(true)}>
            Create note +
          </button>
        </header>

        <NoteList page={page} search={debouncedSearch} />

        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <NoteForm
            onSubmit={handleAddNote}
            onSuccess={() => setShowModal(false)}
          />
        </Modal>
      </div>
    </QueryClientProvider>
  );
}

export default App;

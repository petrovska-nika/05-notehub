import { useState } from "react";
import styles from "./NoteForm.module.css";

interface NoteFormProps {
  onSubmit: (title: string, content: string) => void;
  onSuccess: () => void;
}

export const NoteForm: React.FC<NoteFormProps> = ({ onSubmit, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onSubmit(title, content);
    onSuccess();

    setTitle("");
    setContent("");
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className={styles.textarea}
        rows={4}
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button className={styles.button} type="submit">
        Add Note
      </button>
    </form>
  );
};

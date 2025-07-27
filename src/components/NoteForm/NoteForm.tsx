import { useState } from "react";
import type { NoteTag } from "../../services/noteService";
import styles from "./NoteForm.module.css";

interface NoteFormProps {
  onSubmit: (title: string, content: string, tag: NoteTag) => void;
  onSuccess: () => void;
}

export const NoteForm: React.FC<NoteFormProps> = ({ onSubmit, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState<NoteTag>("Todo");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSubmit(title.trim(), content.trim(), tag);
    setTitle("");
    setContent("");
    setTag("Todo");
    onSuccess();
  };

  const handleCancel = () => {
    onSuccess();
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
      <select
        className={styles.select}
        value={tag}
        onChange={(e) => setTag(e.target.value as NoteTag)}
      >
        <option value="Todo">Todo</option>
        <option value="Work">Work</option>
        <option value="Personal">Personal</option>
        <option value="Meeting">Meeting</option>
        <option value="Shopping">Shopping</option>
      </select>
      <div className={styles.buttons}>
        <button className={styles.button} type="submit">
          Add Note
        </button>
        <button className={styles.button} type="button" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

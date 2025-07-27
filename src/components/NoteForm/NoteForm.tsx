import { useState, useCallback } from "react";
import styles from "./NoteForm.module.css";

interface NoteFormProps {
  onSubmit: (title: string, content: string) => void;
  onSuccess: () => void;
}

export const NoteForm: React.FC<NoteFormProps> = ({ onSubmit, onSuccess }) => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const trimmedTitle = title.trim();
      const trimmedContent = content.trim();
      if (!trimmedTitle || !trimmedContent) return;

      onSubmit(trimmedTitle, trimmedContent);
      onSuccess();
      setTitle("");
      setContent("");
    },
    [title, content, onSubmit, onSuccess]
  );

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setTitle(e.target.value)
        }
      />
      <textarea
        className={styles.textarea}
        rows={4}
        placeholder="Content"
        value={content}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setContent(e.target.value)
        }
      />
      <button className={styles.button} type="submit">
        Add Note
      </button>
    </form>
  );
};

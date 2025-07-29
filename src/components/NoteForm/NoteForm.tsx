import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/noteService";
import type {
  NoteTag,
  CreateNotePayload,
  Note,
} from "../../services/noteService";
import styles from "./NoteForm.module.css";

interface NoteFormProps {
  onSuccess: () => void;
}

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Must be at least 3 characters")
    .max(50, "Must be at most 50 characters")
    .required("Title is required"),
  content: Yup.string().max(500, "Must be at most 500 characters"),
  tag: Yup.mixed<NoteTag>()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Tag is required"),
});

export const NoteForm: React.FC<NoteFormProps> = ({ onSuccess }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Note, Error, CreateNotePayload>({
    mutationFn: createNote,
  });

  return (
    <Formik
      initialValues={{ title: "", content: "", tag: "Todo" as NoteTag }}
      validationSchema={validationSchema}
      onSubmit={(values, actions) => {
        mutation.mutate(values, {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            onSuccess();
            actions.resetForm();
          },
        });
      }}
    >
      <Form className={styles.form}>
        <Field className={styles.input} name="title" placeholder="Title" />
        <ErrorMessage name="title" component="div" className={styles.error} />

        <Field
          className={styles.textarea}
          as="textarea"
          name="content"
          rows={4}
          placeholder="Content"
        />
        <ErrorMessage name="content" component="div" className={styles.error} />

        <Field as="select" name="tag" className={styles.select}>
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </Field>
        <ErrorMessage name="tag" component="div" className={styles.error} />

        <div className={styles.buttons}>
          <button className={styles.button} type="submit">
            Create note
          </button>
          <button
            className={styles.button}
            type="button"
            onClick={() => onSuccess()}
          >
            Cancel
          </button>
        </div>
      </Form>
    </Formik>
  );
};

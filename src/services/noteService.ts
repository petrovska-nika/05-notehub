import axios from "axios";
import type { Note, NoteTag } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api";

const token = import.meta.env.VITE_NOTEHUB_TOKEN;
if (!token) {
  throw new Error(
    "VITE_NOTEHUB_TOKEN is missing. Set it in Vercel project settings."
  );
}

const headers = {
  Authorization: `Bearer ${token}`,
};

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export interface CreateNotePayload {
  title: string;
  content?: string;
  tag: NoteTag;
}

export const fetchNotes = async ({
  page,
  perPage,
  search,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = {
    page,
    perPage,
  };

  if (search) {
    params.search = search;
  }

  const { data } = await axios.get<FetchNotesResponse>(`${BASE_URL}/notes`, {
    headers,
    params,
  });

  return data;
};

export const createNote = async (
  noteData: CreateNotePayload
): Promise<Note> => {
  const { data } = await axios.post<Note>(`${BASE_URL}/notes`, noteData, {
    headers,
  });
  return data;
};

export const deleteNote = async (id: string | number): Promise<Note> => {
  const { data } = await axios.delete<Note>(`${BASE_URL}/notes/${id}`, {
    headers,
  });
  return data;
};

export type { Note, NoteTag };

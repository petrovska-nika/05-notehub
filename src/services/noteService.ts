import axios from "axios";
import { Note } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api";
const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const headers = {
  Authorization: `Bearer ${token}`,
};

export interface FetchNotesResponse {
  results: Note[];
  totalPages: number;
}

interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export const fetchNotes = async ({
  page,
  perPage,
  search,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response = await axios.get(`${BASE_URL}/notes`, {
    headers,
    params: { page, perPage, search },
  });
  return response.data;
};

export const createNote = async (data: Omit<Note, "id">): Promise<Note> => {
  const response = await axios.post(`${BASE_URL}/notes`, data, { headers });
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete(`${BASE_URL}/notes/${id}`, { headers });
  return response.data;
};

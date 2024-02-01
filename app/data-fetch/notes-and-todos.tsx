"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/clerk-react";
import { createClient } from "@supabase/supabase-js";
import NotesInput from "./notes-input";
import TodosInput from "./todos-input";
import {
  createSupabaseClientForClerkAuth,
  createSupabaseClientForClerkAuthWithFrontEndToken,
} from "@/lib/supabase";
import { createBrowserClient } from "@supabase/ssr";

function NotesAndTodos({ notes, todos }: { notes: any; todos: any }) {
  const [supabaseClerk, setSupabaseClerk] = React.useState<any>(null);
  const [selectedNotes, setSelectedNotes] = React.useState<string[]>([]);
  const router = useRouter();
  const { getToken } = useAuth();

  React.useEffect(() => {
    console.log("selectedNotes", selectedNotes);
  }, [selectedNotes]);

  React.useEffect(() => {
    const initializeForClerkAuth = async () => {
      const token = await getToken({ template: "supabase" });
      // const client = createBrowserClient(
      //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
      //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      //   {
      //     global: {
      //       headers: {
      //         Authorization: `Bearer ${token}`,
      //       },
      //     },
      //   }
      // );

      // const client = createBrowserClient(
      //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
      //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      //   // {
      //   //   global: {
      //   //     headers: {
      //   //       Authorization: `Bearer ${token}`,
      //   //     },
      //   //   },
      //   // }
      // );
      //   // console.log("supabase client clerk:", client);
      //   setSupabaseClerk(client);
      createSupabaseClientForClerkAuthWithFrontEndToken(token!).then(
        (client) => {
          setSupabaseClerk(client);
        }
      );
    };
    initializeForClerkAuth();
  }, []);

  const handleDeleteSelectedNotes = async (event: any) => {
    event.preventDefault();
    console.log("selectedNotes", selectedNotes);
    try {
      const { data, error } = await supabaseClerk
        .from("notes_clerk")
        .delete()
        .in("id", selectedNotes);
      if (error) {
        throw error;
      }
      console.log("notes:", data);
      setSelectedNotes([]);
      router.refresh();
      return data;
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleAddNoteToSelectedNotes = async (event: any) => {
    const noteId = event.target.id.split("-")[1];
    if (event.target.checked) {
      setSelectedNotes([...selectedNotes, noteId]);
    } else {
      setSelectedNotes(selectedNotes.filter((id) => id !== noteId));
    }
  };

  const handleInputNote = async (event: any) => {
    event.preventDefault();
    const input = event.target[0].value;
    console.log("input", input);
    event.target[0].value = "";
    try {
      const { data, error } = await supabaseClerk
        .from("notes_clerk")
        .insert([{ title: input }]);
      if (error) {
        throw error;
      }
      console.log("notes:", data);
      router.refresh();
      return data;
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  return (
    <>
      <h2 className="text-lg font-bold">Notes (rls policy anon)</h2>
      <button
        onClick={handleDeleteSelectedNotes}
        className="border px-2 py-1 rounded bg-gray-100 my-4"
      >
        Delete Selected Notes
      </button>
      {/* <div>{JSON.stringify(notes)}</div> */}
      <ul>
        {notes?.map((note: any) => (
          <li key={note.id}>
            <input
              type="checkbox"
              id={`checkbox-${note.id}`}
              onChange={handleAddNoteToSelectedNotes}
            />
            <label htmlFor={`checkbox-${note.id}`}> {note.title} </label>
          </li>
        ))}
      </ul>
      <div className="my-4">
        {/* <NotesInput /> */}
        <div>
          <div>Notes Input (client component)</div>
          <form onSubmit={handleInputNote}>
            <div>
              <input className="border-2 rounded" type="text" />
            </div>
          </form>
        </div>
      </div>
      ---
      <h2 className="text-lg font-bold my-4">
        Todos (rls policy authenticated)
      </h2>
      <ul>
        {todos?.map((todo: any) => (
          <li key={todo.id}>- {`${todo.todo}`}</li>
        ))}
      </ul>
      <div className="my-4">{/* <TodosInput /> */}</div>
    </>
  );
}

export default NotesAndTodos;

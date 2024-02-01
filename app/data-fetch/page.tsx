import {
  createSupabaseClientForClerkAuth,
  createSupabaseClient,
} from "@/lib/supabase";
import User from "@/components/auth/user";
import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs";
import RefreshButton from "@/components/refresh-button";
import NotesInput from "./notes-input";
import TodosInput from "./todos-input";
import { FormEvent } from "react";
import NotesAndTodos from "./notes-and-todos";

const NotesPage = async () => {
  //
  const { userId } = auth();
  //
  const user = await currentUser();
  // console.log("user", user);
  //
  // const initializeSupabase = async () => {
  //   const client = await createSupabaseClient();
  //   return client;
  // };

  // const supabase = await initializeSupabase();

  const initializeSupabaseForClerkAuth = async () => {
    const client = await createSupabaseClientForClerkAuth();
    return client;
  };

  const supabaseClerk = await initializeSupabaseForClerkAuth();

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabaseClerk
        .from("notes_clerk")
        .select("*");
      if (error) {
        throw error;
      }
      // console.log("notes:", data);
      return data;
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const fetchTodos = async () => {
    console.log("fetch todos with user id:", userId);

    try {
      const { data, error } = await supabaseClerk
        .from("todos_clerk")
        .select()
        .eq("user_id", userId);

      if (error) {
        throw error;
      }

      console.log("userId", userId);

      return data;
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const notes = await fetchNotes();
  const todos = await fetchTodos();

  return (
    <div className="flex flex-col gap-8">
      {/* <RefreshButton /> */}
      <div>
        <NotesAndTodos notes={notes} todos={todos} />
        {/* <ul>
          {notes?.map((note: any) => (
            <li key={note.id}>
              <input type="checkbox" id={`checkbox-${note.id}`} />
              <label htmlFor={`checkbox-${note.id}`}> {note.title} </label>
            </li>
          ))}
        </ul> */}
      </div>
      {/* form */}
      {/* form */}
      ---
      <div className="">
        {!user && <div>No Authorization...</div>}
        {!todos && <div>No todos fetched...</div>}
        {/* <ul>
          {todos?.map((todo: any) => (
            <li key={todo.id}>- {`${todo.todo}`}</li>
          ))}
        </ul>
        <div>
          <TodosInput />
        </div> */}
      </div>
      {/* form */}
      {/* form */}
      ---
      <div>
        <h2 className="text-lg font-bold">User Id (server):</h2>
        {!user && <div>No Authorization...</div>}
        <div>{`${userId}`}</div>
      </div>
      <div>
        <h2 className="text-lg font-bold">Current User (server):</h2>
        {!user && <div>No Authorization...</div>}
        <div>{`${user?.firstName} ${user?.lastName}`}</div>
      </div>
      <div>
        <h2 className="text-lg font-bold">User (client component):</h2>
        {!user && <div>No Authorization...</div>}
        <User />
      </div>
    </div>
  );
};

export default NotesPage;

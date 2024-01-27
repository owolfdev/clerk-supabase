import {
  createSupabaseClientForClerkAuth,
  createSupabaseClient,
} from "@/lib/supabase";

const NotesPage = async () => {
  const initializeSupabase = async () => {
    const client = await createSupabaseClient();
    return client;
  };

  const supabase = await initializeSupabase();

  const initializeSupabaseForClerkAuth = async () => {
    const client = await createSupabaseClientForClerkAuth();
    return client;
  };

  const supabaseClerk = await initializeSupabaseForClerkAuth();

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase.from("notes").select("*");
      if (error) {
        throw error;
      }
      console.log("notes:", data);
      return data;
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const fetchTodos = async () => {
    try {
      const { data, error } = await supabaseClerk.from("todos").select("*");
      if (error) {
        throw error;
      }
      console.log("todos:", data);
      return data;
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const notes = await fetchNotes();
  const todos = await fetchTodos();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-lg font-bold">Notes (rls policy anon)</h1>
        <ul>
          {notes?.map((note: any) => (
            <li key={note.id}>- {note.title}</li>
          ))}
        </ul>
      </div>
      ---
      <div className="">
        <h1 className="text-lg font-bold">Todos (rls policy authenticated)</h1>
        <ul>
          {todos?.map((todo: any) => (
            <li key={todo.id}>- {todo.todo}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NotesPage;

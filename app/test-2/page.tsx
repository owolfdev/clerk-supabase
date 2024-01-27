import { createSupabaseClient } from "@/lib/supabase";

const NotesPage = async () => {
  const initializeSupabase = async () => {
    const client = await createSupabaseClient();
    return client;
  };

  const supabase = await initializeSupabase();

  initializeSupabase();
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
      const { data, error } = await supabase.from("todos").select("*");
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
    <div>
      <h1 className="text-lg font-bold">Notes (rls policy anon)</h1>
      <ul>
        {notes?.map((note: any) => (
          <li key={note.id}>- {note.title}</li>
        ))}
      </ul>
      ---
      <h1 className="text-lg font-bold">Todos (rls policy authenticated)</h1>
      <ul>
        {todos?.map((todo: any) => (
          <li key={todo.id}>- {todo.todo}</li>
        ))}
      </ul>
    </div>
  );
};

export default NotesPage;

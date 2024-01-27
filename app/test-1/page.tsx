import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

async function TestClient() {
  const { getToken } = auth();
  const token = await getToken({ template: "supabase" });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );

  //   supabase.auth.setAuth(token);

  const fetchNotes = async (supabase: any) => {
    const { data, error } = await supabase.from("notes").select("*");
    return data;
  };

  const fetchTodos = async (supabase: any) => {
    const { data, error } = await supabase.from("todos").select("*");
    return data;
  };

  const notes = await fetchNotes(supabase);
  const todos = await fetchTodos(supabase);

  return (
    <div>
      <div>todos:{JSON.stringify(todos)}</div>
      <div>notes:{JSON.stringify(notes)}</div>
    </div>
  );
}

export default TestClient;

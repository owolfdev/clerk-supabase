"use client";
import React from "react";
import {
  createSupabaseClient,
  createSupabaseClientForClerkAuth,
} from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/clerk-react";
import { createClient } from "@supabase/supabase-js";

function TodosInput() {
  const [supabaseClerk, setSupabaseClerk] = React.useState<any>(null);
  const router = useRouter();
  const { getToken } = useAuth();
  const { userId } = useAuth();

  React.useEffect(() => {
    const initializeForClerkAuth = async () => {
      const client = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          global: {
            headers: {
              Authorization: `Bearer ${await getToken({
                template: "supabase",
              })}`,
            },
          },
        }
      );
      //   console.log("supabase client clerk:", client);
      setSupabaseClerk(client);
    };
    initializeForClerkAuth();
  }, []);

  const handleInputNote = async (event: any) => {
    event.preventDefault();
    const input = event.target[0].value;
    console.log("input", input);
    event.target[0].value = "";
    try {
      const { data, error } = await supabaseClerk
        .from("todos_clerk")
        .insert([{ todo: input, user_id: userId }]);
      if (error) {
        throw error;
      }
      console.log("todos:", data);
      router.refresh();
      return data;
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  return (
    <div>
      <div>Todos Input (client component)</div>
      <form onSubmit={handleInputNote}>
        <div>
          <input className="border-2 rounded" type="text" />
        </div>
      </form>
    </div>
  );
}

export default TodosInput;

"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

function RefreshButton() {
  //
  const [supabase, setSupabase] = useState<SupabaseClient<
    any,
    "public",
    any
  > | null>(null);

  useEffect(() => {
    const initializeSupabase = async () => {
      const client = await createSupabaseClient();
      setSupabase(client); // Set the state inside the async function
    };
    initializeSupabase();
  }, []);

  const router = useRouter();
  const handleRefresh = async () => {
    console.log("refresh");
    router.refresh();
    const data = await supabase?.from("todos_clerk").select();
    console.log("data", data?.data);
  };
  return (
    <div>
      <button
        className="border px-2 py-1 rounded bg-gray-100"
        onClick={handleRefresh}
      >
        Refresh (client side component)
      </button>
    </div>
  );
}

export default RefreshButton;

"use client";

import React, { use, useEffect, useState } from "react";
import {
  createSupabaseClient,
  createSupabaseClientForClerkAuth,
  createSupabaseClientForClerkAuthWithFrontEndToken,
} from "@/lib/supabase";
import { SupabaseClient } from "@supabase/supabase-js";
import { useAuth } from "@clerk/clerk-react";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";

type Note = {
  id: number;
  title: string;
  // ... other note properties
};

type Todo = {
  id: number;
  todo: string;
  // ... other todo properties
};

const NotesPage = () => {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [supabaseClerk, setSupabaseClerk] = useState<SupabaseClient | null>(
    null
  );
  const [notes, setNotes] = useState<Note[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [token, setToken] = useState<string | null>(null);
  // const userObject = useAuth();
  const { isSignedIn, user, isLoaded } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    console.log("user", user);
  }, [user]);

  useEffect(() => {
    // Initialize Supabase client
    const initialize = async () => {
      const client = await createSupabaseClient();
      console.log("supabase client:", client);
      setSupabase(client);
    };
    initialize();

    // Initialize Supabase client for Clerk Auth

    const getClerk = async () => {
      const token = await getToken();
      setToken(token);
      const initializeForClerkAuth = async () => {
        const client = createClient(
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
        // console.log("supabase client clerk:", client);
        setSupabaseClerk(client);
      };
      initializeForClerkAuth();
    };
    getClerk();
  }, []);

  useEffect(() => {
    if (token) {
      const initializeForClerkAuth = async () => {
        const client = createClient(
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
        // console.log("supabase client clerk:", client);
        setSupabaseClerk(client);
      };
      initializeForClerkAuth();
    }
  }, [token]);

  // Fetch notes and todos once supabase is initialized
  useEffect(() => {
    if (supabase) {
      fetchNotes();
    }
    if (supabaseClerk) {
      fetchTodos();
    }
  }, [supabase, supabaseClerk, token, user]);

  const fetchNotes = async () => {
    try {
      const response = await supabase?.from("notes").select("*");
      if (response?.data) {
        setNotes(response.data as Note[]);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const fetchTodos = async () => {
    console.log("fetchTodos!!!!");
    console.log("supabaseClerk!!!:", supabaseClerk);
    try {
      const response = await supabaseClerk?.from("todos").select();
      console.log("todos, response.data:", response?.data);

      if (response?.data) {
        setTodos(response.data as Todo[]);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

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
      ---
      <div>
        <div>User:</div>
        <div>{`${user?.firstName} ${user?.lastName}`}</div>
        <div>{user?.emailAddresses[0].emailAddress}</div>
        <div>{user?.id}</div>
      </div>
    </div>
  );
};

export default NotesPage;

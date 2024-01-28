import React from "react";
import AuthButton from "../auth/auth-button";
import Link from "next/link";

function NavBar() {
  return (
    <div className="flex items-center ">
      <div className="flex items-center gap-4 justify-between w-full">
        <Link href="/">
          <h1 className="text-3xl font-bold">Clerk and Supabase</h1>
        </Link>
        <AuthButton />
      </div>
    </div>
  );
}

export default NavBar;

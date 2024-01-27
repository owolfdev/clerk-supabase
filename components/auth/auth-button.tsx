import React from "react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

function AuthButton() {
  const { userId } = auth();
  console.log("user id:", userId);
  return (
    <div>
      {userId ? (
        <UserButton afterSignOutUrl="/" />
      ) : (
        <Link href="/sign-in">Log In</Link>
      )}
    </div>
  );
}

export default AuthButton;

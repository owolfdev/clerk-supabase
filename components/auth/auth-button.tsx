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
        <div className="border-2 rounded-full w-[35px] h-[35px]">
          <UserButton afterSignOutUrl="/" />
        </div>
      ) : (
        <Link
          href="/sign-in"
          className="border-2 rounded-lg px-4 py-2 font-bold"
        >
          Log In
        </Link>
      )}
    </div>
  );
}

export default AuthButton;

"use client";
import { useUser } from "@clerk/nextjs";
import React from "react";

function User() {
  const { isSignedIn, user, isLoaded } = useUser();
  return <div>{`${user?.firstName} ${user?.lastName}`}</div>;
}

export default User;

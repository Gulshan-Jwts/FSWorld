"use client";
import { signIn } from "next-auth/react";
import React from "react";

const Page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <button
        onClick={() => signIn("github")}
        className="bg-black text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-800 transition"
      >
        Continue with GitHub
      </button>
    </div>
  );
};

export default Page;

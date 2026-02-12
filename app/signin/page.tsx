"use client";

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function SignIn() {

  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">

      <div className="bg-zinc-900/80 backdrop-blur-xl p-10 rounded-2xl w-[420px] border border-zinc-800 shadow-2xl">

        {/* Logo */}
        <h1 className="text-3xl font-serif text-center mb-1">
          BOMBAY BUREAU
        </h1>

        {/* Tagline */}
        <p className="text-xs text-gray-400 text-center">
          Global affairs, Indian perspective
        </p>

        {/* Sign in text */}
        <p className="text-xl text-white text-center font-bold mt-5 mb-8">
  Sign in to continue
</p>

        {/* Google */}
        <button
          onClick={handleGoogle}
          className="bg-white text-black w-full py-3 rounded-full font-semibold mb-6 hover:bg-gray-200 transition"
        >
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-[1px] bg-gray-700"></div>
          <span className="text-gray-400 text-sm">OR</span>
          <div className="flex-1 h-[1px] bg-gray-700"></div>
        </div>

        {/* Email */}
        <input
          placeholder="Email"
          className="w-full p-3 mb-3 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-white"
        />

        <input
          placeholder="Password"
          type="password"
          className="w-full p-3 mb-5 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-white"
        />

        <button className="border border-white w-full py-3 rounded-full hover:bg-white hover:text-black transition">
          Sign in with Email
        </button>

      </div>
    </div>
  );
}
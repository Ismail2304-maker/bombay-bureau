"use client";
import Link from "next/link";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "@/lib/firebase";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  // GOOGLE LOGIN
  const handleGoogle = async () => {
    if (!accepted) return;

    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    router.push("/admin");
  };

  // EMAIL LOGIN
  const handleEmail = async () => {
    if (!accepted) return;

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
      return;
    } catch (loginError: any) {
      if (loginError.code === "auth/user-not-found") {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          router.push("/admin");
          return;
        } catch {
          alert("Account creation failed");
        }
      }

      if (loginError.code === "auth/wrong-password") {
        alert("Wrong password");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-zinc-900 rounded-2xl w-[420px] p-10 border border-zinc-800 shadow-2xl">

        <h1 className="text-3xl font-serif text-white text-center mb-1">
          BOMBAY BUREAU
        </h1>

        <p className="text-gray-400 text-center text-sm mb-8">
          Sign in or create account
        </p>

        {/* EMAIL */}
        <input
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          className="w-full p-3 bg-black border border-gray-700 rounded-lg mb-3 text-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          className="w-full p-3 bg-black border border-gray-700 rounded-lg mb-4 text-white"
        />

        {/* CONTINUE BUTTON */}
        <button
          onClick={handleEmail}
          disabled={!accepted || loading}
          className={`w-full py-3 rounded-lg font-semibold transition
          ${accepted 
            ? "bg-black border border-white text-white hover:bg-white hover:text-black"
            : "bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed"}
          `}
        >
          {loading ? "Please wait..." : "CONTINUE"}
        </button>

        {/* DIVIDER */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-[1px] bg-gray-700"></div>
          <span className="text-gray-400 text-sm">OR</span>
          <div className="flex-1 h-[1px] bg-gray-700"></div>
        </div>

        {/* GOOGLE */}
        <button
          onClick={handleGoogle}
          disabled={!accepted}
          className={`w-full flex items-center justify-center gap-3 py-3 rounded-lg transition
          ${accepted 
            ? "border border-gray-600 hover:bg-white hover:text-black"
            : "border border-gray-800 text-gray-500 cursor-not-allowed"}
          `}
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            className="w-5 h-5"
          />
          Sign in with Google
        </button>

        {/* TERMS */}
        <div className="flex items-start gap-2 mt-6 text-xs text-gray-400">
  <input
  type="checkbox"
  checked={accepted}
  onChange={() => setAccepted(!accepted)}
  className="w-4 h-4 accent-white border border-gray-500 mt-[2px]"
/>

  <span className="leading-relaxed">
    I agree to the{" "}
    <Link href="/terms" className="underline hover:text-white">
      Terms of Use
    </Link>{" "}
    and{" "}
    <Link href="/privacy" className="underline hover:text-white">
      Privacy Policy
    </Link>
  </span>
</div>

      </div>
    </div>
  );
}
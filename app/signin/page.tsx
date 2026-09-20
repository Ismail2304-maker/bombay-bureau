"use client";

import Link from "next/link";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { isAdmin } from "@/lib/admin";
import { useState } from "react";
import { useRouter } from "next/navigation";

function friendlyAuthError(error: any) {
  switch (error?.code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
      return "The email or password is incorrect.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/email-already-in-use":
      return "An account with this email already exists. Try signing in with your password.";
    case "auth/popup-closed-by-user":
      return "The Google sign-in window was closed before sign-in completed.";
    case "auth/popup-blocked":
      return "Your browser blocked the Google sign-in window. Allow pop-ups for Bombay Bureau and try again.";
    case "auth/unauthorized-domain":
      return "This website is not authorized for Firebase sign-in yet. Add bombay-bureau.vercel.app to Firebase Authentication → Settings → Authorized domains.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    default:
      return error?.message || "Sign-in failed. Please try again.";
  }
}

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"idle" | "error" | "success">("idle");
  const [message, setMessage] = useState("");

  const finishLogin = (emailAddress?: string | null) => {
    if (isAdmin(emailAddress)) {
      router.push("/admin");
    } else {
      router.push("/");
    }
  };

  const handleGoogle = async () => {
    if (!accepted || loading) return;

    setLoading(true);
    setMode("idle");
    setMessage("");

    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      setMode("success");
      setMessage("Signed in successfully. Redirecting…");
      finishLogin(result.user.email);
    } catch (error: any) {
      setMode("error");
      setMessage(friendlyAuthError(error));
      setLoading(false);
    }
  };

  const handleEmail = async () => {
    if (!accepted || loading) return;

    if (!email.trim() || !password) {
      setMode("error");
      setMessage("Enter your email and password first.");
      return;
    }

    setLoading(true);
    setMode("idle");
    setMessage("");

    try {
      const result = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      setMode("success");
      setMessage("Signed in successfully. Redirecting…");
      finishLogin(result.user.email);
    } catch (loginError: any) {
      if (loginError?.code === "auth/user-not-found") {
        try {
          const result = await createUserWithEmailAndPassword(
            auth,
            email.trim(),
            password
          );
          setMode("success");
          setMessage("Your account was created. Redirecting…");
          finishLogin(result.user.email);
          return;
        } catch (createError: any) {
          setMode("error");
          setMessage(friendlyAuthError(createError));
        }
      } else {
        setMode("error");
        setMessage(friendlyAuthError(loginError));
      }

      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-12">
      <Link
        href="/"
        className="fixed top-6 left-5 md:left-8 text-gray-400 hover:text-white transition z-50 text-sm uppercase tracking-[0.16em]"
      >
        ← Back
      </Link>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-[10px] uppercase tracking-[0.28em] text-gray-500 mb-3">
            BOMBAY BUREAU
          </p>
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight">
            Sign in
          </h1>
          <p className="text-gray-500 mt-3 text-sm">
            Create an account or continue with your existing account.
          </p>
        </div>

        <section className="rounded-2xl border border-gray-800 bg-[#0b0b0b] p-6 md:p-8 shadow-2xl">
          <label className="block text-xs uppercase tracking-[0.16em] text-gray-500 mb-2">
            Email
          </label>
          <input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-black px-4 py-3 text-white outline-none focus:border-white transition"
          />

          <label className="block text-xs uppercase tracking-[0.16em] text-gray-500 mb-2 mt-5">
            Password
          </label>
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleEmail();
            }}
            className="w-full rounded-lg border border-gray-700 bg-black px-4 py-3 text-white outline-none focus:border-white transition"
          />

          <label className="flex items-start gap-3 mt-5 text-xs text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-white"
            />
            <span className="leading-relaxed">
              I agree to the{" "}
              <Link href="/terms" className="text-white underline">
                Terms of Use
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-white underline">
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          <button
            type="button"
            onClick={handleEmail}
            disabled={!accepted || loading}
            className="w-full mt-6 rounded-lg bg-white text-black py-3 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-200 transition"
          >
            {loading ? "Please wait…" : "Continue with email"}
          </button>

          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-gray-800" />
            <span className="text-xs text-gray-600">OR</span>
            <div className="h-px flex-1 bg-gray-800" />
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={!accepted || loading}
            aria-label="Continue with Google"
            className="w-full rounded-lg border border-gray-700 py-3 font-medium hover:bg-white hover:text-black disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-3"
          >
            <span className="text-base font-bold">G</span>
            Continue with Google
          </button>

          {mode !== "idle" && (
            <div
              role={mode === "error" ? "alert" : "status"}
              className={`mt-5 rounded-lg border px-4 py-3 text-sm ${
                mode === "error"
                  ? "border-red-900 bg-red-950/30 text-red-300"
                  : "border-gray-700 bg-gray-900 text-gray-200"
              }`}
            >
              {message}
            </div>
          )}

          <p className="text-[11px] text-gray-600 mt-6 leading-relaxed">
            Your account is used for sign-in and site features. Administrator
            access is granted separately to authorized newsroom accounts.
          </p>
        </section>
      </div>
    </main>
  );
}

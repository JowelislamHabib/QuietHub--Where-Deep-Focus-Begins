"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, FieldError, Form, Input, TextField } from "@heroui/react";
import {
  RiArrowRightLine,
  RiLockPasswordLine,
  RiMailLine,
} from "react-icons/ri";
import { authClient } from "@/lib/auth-client";

const LoginPage = () => {
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    const { data, error } = await authClient.signIn.email({
      email: email,
      password: password,
      callbackURL: "/",
    });

    if (!error) {
      router.push("/");
    }
  };

  const signIn = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  };

  return (
    <div className="min-h-screen bg-stone-50 relative flex items-center justify-center px-6 py-16 overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-stone-200/50 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="backdrop-blur-xl bg-white/60 p-10 rounded-3xl border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.04)]">
          <div className="mb-8 text-left">
            <h1 className="text-3xl font-bold font-heading text-gray-900 tracking-tight mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-500 font-medium text-sm">
              Sign in to continue your focus session.
            </p>
          </div>

          <Form
            className="space-y-5"
            onSubmit={onSubmit}
            validationBehavior="native"
          >
            <TextField
              isRequired
              name="email"
              validate={(value) =>
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
                  ? "Invalid email format"
                  : null
              }
              className="flex flex-col gap-1.5"
            >
              <span className="text-xs font-semibold text-gray-900 ml-3">
                Email Address
              </span>
              <div className="relative flex items-center">
                <RiMailLine className="absolute left-4 text-gray-500 text-lg z-10" />
                <Input
                  aria-label="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-14 pr-5 h-12 bg-white/40 backdrop-blur-md border border-white/60 rounded-full text-gray-900 font-medium text-sm transition-all duration-200 focus:border-indigo-500 focus:bg-white/80 outline-none"
                />
              </div>
              <FieldError className="text-red-500 text-xs font-medium mt-1 ml-3" />
            </TextField>

            <TextField
              isRequired
              name="password"
              validate={(value) =>
                value.length < 8 ? "Minimum 8 characters" : null
              }
              className="flex flex-col gap-1.5"
            >
              <span className="text-xs font-semibold text-gray-900 ml-3">
                Password
              </span>
              <div className="relative flex items-center">
                <RiLockPasswordLine className="absolute left-4 text-gray-500 text-lg z-10" />
                <Input
                  aria-label="Password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="w-full pl-14 pr-5 h-12 bg-white/40 backdrop-blur-md border border-white/60 rounded-full text-gray-900 transition-all duration-200 focus:border-indigo-500 focus:bg-white/80 outline-none"
                />
              </div>
              <FieldError className="text-red-500 text-xs font-medium mt-1 ml-3" />
            </TextField>

            <Button
              type="submit"
              className="w-full h-12 bg-indigo-500 text-white rounded-full font-medium text-sm flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all duration-150 shadow-md shadow-indigo-500/10 mt-2"
            >
              <span>Secure Login</span>
              <RiArrowRightLine className="text-lg" />
            </Button>
          </Form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200/50" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white/80 backdrop-blur-sm px-4 rounded-full border border-gray-100 text-gray-400 font-medium text-xs py-0.5">
                or continue with
              </span>
            </div>
          </div>

          <Button
            onClick={() => signIn()}
            className="w-full h-12 bg-white/50 hover:bg-white/80 backdrop-blur-md text-gray-900 border border-white/80 rounded-full font-medium text-sm flex items-center justify-center gap-2.5 transition-all duration-150 shadow-sm"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>Google</span>
          </Button>
        </div>

        <div className="mt-8 text-center flex flex-col gap-3">
          <p className="text-gray-500 text-sm font-medium">
            New to Silentium?{" "}
            <Link
              href="/register"
              className="text-indigo-500 font-medium hover:text-indigo-600 transition-colors"
            >
              Create Account
            </Link>
          </p>
          <Link
            href="/"
            className="text-gray-500 text-sm font-medium hover:text-gray-900 transition-colors mt-2"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

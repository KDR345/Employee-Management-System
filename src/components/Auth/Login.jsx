import React from "react";
import { useState } from "react";

export function Login({ HandleLogin }) {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const submitForm = (e) => {
    e.preventDefault();
    HandleLogin(Email, Password);
    console.log("Email : ", Email);
    console.log("Password : ", Password);

    setEmail("");
    setPassword("");
  };
  return (
    <>
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
          <h2 className="text-3xl font-bold text-center text-white mb-8">Welcome Back</h2>
          <form
            onSubmit={(e) => {
              submitForm(e);
            }}
            className="flex flex-col gap-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
              <input
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                type="email"
                placeholder="admin@me.com or e1@me.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                type="password"
                placeholder="Enter password (123)"
                required
              />
            </div>
            <button className="w-full py-3 px-4 mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg transform transition hover:scale-105 active:scale-95">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

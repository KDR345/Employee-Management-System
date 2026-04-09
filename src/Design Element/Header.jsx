import React from "react";

export const Header = (props) => {
  const logOutUser = () => {
    sessionStorage.removeItem("loggedInUser");
    localStorage.removeItem("loggedInUser"); // Fallback clear
    props.changeUser(null);
  };

  return (
    <div className="flex items-end justify-between bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
      <h1 className="text-2xl text-gray-300 font-medium">
        Hello, <br />{" "}
        <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
          {props.data ? props.data.name : "Admin"} 👋
        </span>
      </h1>
      <button
        onClick={logOutUser}
        className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-sm font-bold text-white px-6 py-3 rounded-xl shadow-lg transform transition hover:-translate-y-1 active:translate-y-0"
      >
        Log Out
      </button>
    </div>
  );
};

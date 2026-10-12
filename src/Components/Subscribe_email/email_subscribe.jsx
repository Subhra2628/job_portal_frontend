import api from "../../../API/api";
import { useState } from "react";

function Subscribes() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubscribe = async () => {
    setMessage("");
    setError("");

    try {
      const response = await api.post("/subscribes", {
        email: email,
      });

      setMessage(response.data.message);
      setEmail("");
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="mt-5">
      <div className="flex">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-w-0 flex-1 rounded-l-lg bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:ring-1 focus:ring-blue-500"
        />

        <button
          onClick={handleSubscribe}
          className="cursor-pointer rounded-r-lg bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-700"
        >
          Subscribe
        </button>
      </div>

      {message && (
        <p className="mt-2 text-sm text-green-400">
          {message}
        </p>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

export default Subscribes;
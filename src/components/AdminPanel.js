import React, { useState, useEffect } from "react";

function AdminPanel() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [upi, setUpi] = useState("");
  const [pixel, setPixel] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = () => {
    if (username === "admin" && password === "demoPassword") {
      setLoggedIn(true);
      setMessage("");
      // Load current files from backend
      fetch("/api/upi")
        .then(res => res.text())
        .then(setUpi);
      fetch("/api/pixel")
        .then(res => res.text())
        .then(setPixel);
    } else {
      setMessage("❌ Invalid credentials");
    }
  };

  const saveUpi = async () => {
    const res = await fetch("/api/upi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: upi })
    });
    setMessage(res.ok ? "✅ UPI updated" : "❌ Failed to save UPI");
  };

  const savePixel = async () => {
    const res = await fetch("/api/pixel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: pixel })
    });
    setMessage(res.ok ? "✅ Pixel code updated" : "❌ Failed to save Pixel");
  };

  if (!loggedIn) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 w-96">
          <h2 className="text-xl font-bold mb-4">Admin Login</h2>
          <input
            type="text"
            placeholder="Username"
            className="border p-2 w-full mb-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 w-full mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          >
            Login
          </button>
          {message && <p className="mt-2 text-red-500">{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">⚙️ Admin Panel</h1>
      {message && <p className="mb-4 text-green-600">{message}</p>}

      {/* UPI Editor */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Edit UPI (upi.txt)</h2>
        <textarea
          className="border p-2 w-full h-32"
          value={upi}
          onChange={(e) => setUpi(e.target.value)}
        />
        <button
          onClick={saveUpi}
          className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
        >
          Save UPI
        </button>
      </div>

      {/* Pixel Editor */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Edit Pixel Code (pixel.html)</h2>
        <textarea
          className="border p-2 w-full h-32"
          value={pixel}
          onChange={(e) => setPixel(e.target.value)}
        />
        <button
          onClick={savePixel}
          className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
        >
          Save Pixel
        </button>
      </div>
    </div>
  );
}

export default AdminPanel;

import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: await auth.forgotPassword(email)
    alert("If this email exists, a reset link will be sent.");
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
      <form onSubmit={submit} className="space-y-4">
        <input
          type="email"
          required
          value={email}
          placeholder="student@miva.university"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border rounded"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded">
          Send reset link
        </button>
      </form>
    </div>
  );
}
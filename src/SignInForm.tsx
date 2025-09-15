"use client";
import { useState } from "react";
import { toast } from "sonner";
import { signInAnonymously } from "./lib/auth";

export function SignInForm() {
  const [submitting, setSubmitting] = useState(false);

  const handleAnonymousSignIn = async () => {
    setSubmitting(true);
    try {
      await signInAnonymously();
      toast.success("Signed in successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to sign in");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-900">
        Welcome to Cafe Buzzer
      </h2>
      <p className="text-gray-600 text-center mb-6">
        Sign in to manage your restaurant's order notifications
      </p>
      
      <button 
        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
        onClick={handleAnonymousSignIn}
        disabled={submitting}
      >
        {submitting ? "Signing in..." : "Continue"}
      </button>
      
      <p className="text-xs text-gray-500 text-center mt-4">
        Anonymous authentication - no personal information required
      </p>
    </div>
  );
}
"use client";
import { signOut } from "./lib/auth";
import { toast } from "sonner";

export function SignOutButton() {
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to sign out");
    }
  };

  return (
    <button
      className="px-4 py-2 rounded bg-white text-gray-700 border border-gray-200 font-semibold hover:bg-gray-50 hover:text-gray-800 transition-colors shadow-sm hover:shadow"
      onClick={handleSignOut}
    >
      Sign out
    </button>
  );
}
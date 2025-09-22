"use client";
import { signOut } from "../lib/auth";
import { toast } from "sonner";
import { FreshButton } from "./FreshButton";

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
    <FreshButton
      variant="secondary"
      size="md"
      onClick={handleSignOut}
    >
      Sign out
    </FreshButton>
  );
}
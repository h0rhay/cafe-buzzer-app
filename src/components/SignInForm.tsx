import { useState, useCallback } from "react";
import { toast } from "sonner";
import { signInWithEmail } from "../lib/auth";
import { FreshButton } from "./FreshButton";

interface SignInFormProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onSignUpClick?: () => void;
}

export function SignInForm({ onSuccess, onError, onSignUpClick }: SignInFormProps = {}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmail(email, password);
      toast.success("Signed in successfully!");
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to sign in";
      toast.error(errorMessage);
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  }, [email, password, onSuccess, onError]);

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-900">
        Welcome Back
      </h2>
      <p className="text-gray-600 text-center mb-6">
        Sign in to your Cafe Buzzer account
      </p>
      
      <form onSubmit={handleSignIn} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="w-full">
          <FreshButton
            variant="primary"
            size="lg"
            onClick={() => handleSignIn({} as React.FormEvent)}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </FreshButton>
        </div>
      </form>

      {onSignUpClick && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <FreshButton
              variant="tertiary"
              size="sm"
              onClick={onSignUpClick}
              className="p-0 h-auto"
            >
              Sign Up
            </FreshButton>
          </p>
        </div>
      )}
    </div>
  );
}
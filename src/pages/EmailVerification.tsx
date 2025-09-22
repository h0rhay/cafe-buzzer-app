import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";
import { LoadingSpinner } from "../components/LoadingSpinner";

export function EmailVerification() {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Get the current user (should be authenticated after email verification)
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          setStatus('error');
          setErrorMessage('Email verification failed. Please try signing in again.');
          return;
        }

        setStatus('success');
        
        // Redirect to the app (which will handle business setup if needed)
        setTimeout(() => {
          navigate('/app/dashboard');
        }, 2000);

      } catch (error) {
        console.error('Email verification error:', error);
        setStatus('error');
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    };

    handleEmailVerification();
  }, [navigate]);

  if (status === 'verifying') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border p-8 text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Verifying Your Email
          </h1>
          <p className="text-gray-600">
            Please wait while we verify your email address...
          </p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Email Verified!
          </h1>
          <p className="text-gray-600 mb-6">
            Your email has been verified successfully. Redirecting you to set up your business...
          </p>
          <LoadingSpinner size="md" className="mx-auto" />
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border p-8 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Verification Failed
        </h1>
        <p className="text-gray-600 mb-6">
          {errorMessage}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/app')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
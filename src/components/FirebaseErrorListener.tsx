'use client';

import { useState, useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, AuthError } from '@/firebase/errors';
import { toast } from '@/hooks/use-toast';

/**
 * An invisible component that listens for globally emitted Firebase events.
 * It throws permission errors to be caught by Next.js's global-error.tsx
 * and shows toasts for authentication errors.
 */
export function FirebaseErrorListener() {
  // Use the specific error type for the state for type safety.
  const [error, setError] = useState<FirestorePermissionError | null>(null);

  useEffect(() => {
    // The callback now expects a strongly-typed error, matching the event payload.
    const handlePermissionError = (error: FirestorePermissionError) => {
      // Set error in state to trigger a re-render.
      setError(error);
    };

    const handleAuthError = (error: AuthError) => {
      toast({
        title: "Erreur d'authentification",
        description: error.message,
        variant: "destructive"
      });
    };

    // The typed emitter will enforce that the callback for 'permission-error'
    // matches the expected payload type (FirestorePermissionError).
    errorEmitter.on('permission-error', handlePermissionError);
    errorEmitter.on('auth-error', handleAuthError);

    // Unsubscribe on unmount to prevent memory leaks.
    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
      errorEmitter.off('auth-error', handleAuthError);
    };
  }, []);

  // On re-render, if an error exists in state, throw it.
  if (error) {
    throw error;
  }

  // This component renders nothing.
  return null;
}

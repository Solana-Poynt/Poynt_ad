"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { PropsWithChildren } from "react";

// For Next.js, we need to use NEXT_PUBLIC_ prefix for client-side env variables
const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;

if (!googleClientId) {
  throw new Error(
    "Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID. Please add it to your .env.local file"
  );
}

export default function Providers({ children }: PropsWithChildren) {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      {children}
    </GoogleOAuthProvider>
  );
}

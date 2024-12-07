"use client";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";

export interface GoogleCredentialResponse {
  credential?: string;
  clientId?: string;
  select_by?: string;
}

interface GoogleLoginButtonProps {
  isLoading: boolean;
  onSuccess: (response: GoogleCredentialResponse) => void;
}

const GoogleLoginButton = ({
  isLoading,
  onSuccess,
}: GoogleLoginButtonProps) => {
  return (
    <motion.div
      whileHover={{ scale: isLoading ? 1 : 1.02 }}
      whileTap={{ scale: isLoading ? 1 : 0.98 }}
      className="relative w-full"
    >
      {/* Semi-transparent overlay during loading */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-overlay rounded-full z-10 flex items-center justify-center backdrop-blur-sm"
        >
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </motion.div>
      )}

      <div className={isLoading ? "pointer-events-none" : ""}>
        <GoogleLogin
          onSuccess={onSuccess}
          onError={() => {
            console.error("Login Failed");
          }}
          type="standard"
          theme="outline"
          text="continue_with"
          shape="pill"
          logo_alignment="center"
          size="large"
          width="600"
        />
      </div>
    </motion.div>
  );
};

export default GoogleLoginButton;

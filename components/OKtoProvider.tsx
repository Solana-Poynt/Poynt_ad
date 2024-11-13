// "use client";

// import { PropsWithChildren } from "react";
// import { OktoProvider, BuildType } from "okto-sdk-react";

// const OKTO_CLIENT_API_KEY = process.env.NEXT_PUBLIC_OKTO_CLIENT_API_KEY!;

// if (!OKTO_CLIENT_API_KEY) {
//   throw new Error(
//     "Missing OKTO CLIENT KEY. Please add it to your .env.local file"
//   );
// }

// export default function OktoProviders({ children }: PropsWithChildren) {
//   return (
//     <OktoProvider apiKey={OKTO_CLIENT_API_KEY} buildType={BuildType.SANDBOX}>
//       {children}
//     </OktoProvider>
//   );
// }

// types/next-auth.d.ts
import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"]
  }

  interface User {
    id: string;
    name: string;
    email: string;
  }
}

// You might also need to extend the JWT type if you're using it
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}
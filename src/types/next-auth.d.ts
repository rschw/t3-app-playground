import { DefaultSession } from "next-auth";
import "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as prop
   */
  interface Session {
    user?: {
      id?: string;
    } & DefaultSession["user"];
  }
}

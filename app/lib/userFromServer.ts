import { getServerSession } from "next-auth"
import { NEXT_AUTH_CONFIG } from "./auth";
async function getUser() {
  const session = await getServerSession(NEXT_AUTH_CONFIG);
  return session?.user;
}
export const userFromServer=getUser();

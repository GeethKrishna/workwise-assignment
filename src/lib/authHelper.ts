import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
export async function checkauth() {
    const session = await getServerSession(authOptions);
    return session;
}
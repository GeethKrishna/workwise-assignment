import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
export async function checkauth() {
    const session = await getServerSession(authOptions);
    return session;
}
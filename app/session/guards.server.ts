import { redirect } from "@remix-run/node";
import { getUserIdFromSession } from "./session.server"

// no cookie > redirect to login
export const requireUser = async (request: Request) => {
    const userId = await getUserIdFromSession(request);
    if(!userId) {
        throw redirect("/login");
    }

}
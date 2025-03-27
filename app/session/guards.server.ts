import { redirect } from "@remix-run/node";
import { getUserIdFromSession } from "./session.server"

// no cookie > redirect to login
export const requireUser = async (request: Request) => {
    const organizationId = await getUserIdFromSession(request);
    if(!organizationId) {
        throw redirect("/login");
    }
    // next >>  check if org exist in the database 
}
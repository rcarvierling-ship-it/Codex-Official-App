import { cookies, headers } from "next/headers";

import { normalizeRole, type Role } from "./nav";

const ROLE_COOKIE = "theofficialapp-role";

export async function getServerRole(): Promise<Role> {
  const headerRole = headers().get("x-user-role");
  const cookieRole = cookies().get(ROLE_COOKIE)?.value;
  return normalizeRole(headerRole ?? cookieRole);
}

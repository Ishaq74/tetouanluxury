import { auth } from "@auth/index";
import type { APIRoute } from "astro";

export const ALL: APIRoute = async (context) => {
  return auth.handler(context.request);
};

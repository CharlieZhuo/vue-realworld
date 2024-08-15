import createClient, { Client } from "openapi-fetch";
import type { paths } from "./schema"; // generated by openapi-typescript

//read base url from env
const baseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
if (!baseUrl) {
  throw new Error("VITE_API_BASE_URL is not set");
}

export let ApiClient: Client<paths> = createClient({ baseUrl });

// 更新API客户端的令牌
// 当用户登录或注销时，我们需要更新API客户端的令牌
export function updateClientToken(authToken?: string) {
  ApiClient = createClient({
    baseUrl,
    // add authorization header if authToken is provided
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
  });
  return ApiClient;
}

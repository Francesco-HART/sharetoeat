import { OpenAPI } from "@/generated/index";

export function initApiClient(url: string) {
  OpenAPI.BASE = url;
}

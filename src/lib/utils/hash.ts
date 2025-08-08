import { randomBytes } from "crypto";

export function generateUuid(): string {
  return randomBytes(16).toString("hex");
}

export function generateApiKey(): string {
  return "sk-" + randomBytes(32).toString("hex");
}

export function generateInviteCode(): string {
  return randomBytes(8).toString("hex").toUpperCase();
}

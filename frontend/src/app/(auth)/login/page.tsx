import { LoginForm } from "@/features/auth/components/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ログイン - Kiroku",
};

export default function LoginPage() {
  return <LoginForm />;
}

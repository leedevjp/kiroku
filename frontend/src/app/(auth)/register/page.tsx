import { RegisterForm } from "@/features/auth/components/RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "会員登録 - Kiroku",
};

export default function RegisterPage() {
  return <RegisterForm />;
}

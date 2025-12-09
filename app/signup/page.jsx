import { getUserFromCookies } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignupForm from "./signupForm";

export default async function SignUpPage() {
  const user = await getUserFromCookies();

  if (user) {
    redirect("/"); 
  }

  return <SignupForm />; 
}
import { getUserFromCookies } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "./loginForm";


export default async function LogInPage() {
  const user = await getUserFromCookies();

  if (user) {
    redirect("/"); 
  }

  return <LoginForm />; 
}
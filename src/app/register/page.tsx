"use server";

import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import { getUserNivelByEmail } from "../entryandexit/api/getUserNivelByEmail";
import Header from "../components/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RegisterForm from "./components/RegisterForm";

export default async function Register() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/");
  }

  const nivel = await getUserNivelByEmail(session.user.email);

  if (nivel !== "Admin") {
    redirect("/"); 
  }

  return (
    <div>
      <Header isAdmin />
      <div className="flex justify-center text-white mt-5">
        <Card className="w-[800px] h-auto">
          <CardHeader className="flex flex-col items-center mb-7">
            <CardTitle className="text-3xl">Registrar</CardTitle>
            <CardDescription className="text-lg">
              Entre em sua conta!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

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
import Footer from "../components/Footer";

export default async function Register() {
  // const session = await auth();

  // if (!session?.user?.email) {
  //   redirect("/");
  // }

  // const nivel = await getUserNivelByEmail(session.user.email);

  // if (nivel !== "Admin") {
  //   redirect("/");
  // }

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        // isAdmin={nivel === "Admin"}
        // userName={session.user?.name ?? null}
      />

      <main className="flex-grow flex justify-center items-start text-white py-10 px-4">
        <Card className="w-[800px] max-w-full">
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
      </main>

      <Footer />
    </div>
  );
}

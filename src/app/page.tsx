"use server";
import Header from "./components/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginForm from "./components/LoginForm";
import Footer from "./components/Footer";
import { auth } from "../../auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex flex-col min-h-screen">
      <Header userName={session?.user?.name ?? null} />

      <main className="flex-grow flex justify-center items-start text-white py-10 px-4">
        <Card className="w-[800px] max-w-full">
          <CardHeader className="flex flex-col items-center mb-7">
            <CardTitle className="text-3xl">Entrar</CardTitle>
            <CardDescription className="text-lg">
              Entre em sua conta!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}

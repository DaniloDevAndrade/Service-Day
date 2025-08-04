'use server'
import Header from "./components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "./components/LoginForm";


export default async function Home() {
  return (
   <div>
      <Header />
      <div className="flex justify-center text-white mt-5">
      <Card className="w-[800px] h-auto">
        <CardHeader className="flex flex-col items-center mb-7">
          <CardTitle className="text-3xl">Entrar</CardTitle>
          <CardDescription className="text-lg">Entre em sua conta!</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm></LoginForm>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}

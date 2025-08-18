"use server";

import { fetchMovimentos } from "./api/fetchMovimentos";
import Header from "../components/header";
import TableInit from "./components/table";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import { getUserNivelByEmail } from "./api/getUserNivelByEmail";
import Footer from "../components/Footer";

export default async function EntryAndExit() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }

  const userEmail = session.user?.email as string;

  const nivel = await getUserNivelByEmail(userEmail);
  if (!nivel) {
    redirect("/"); // segurança adicional
  }

  const { success, movimentos, listaId } = await fetchMovimentos(userEmail);

  if (!success) return <div>Erro ao carregar dados</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        isAdmin={nivel === "Admin"}
        userName={session.user?.name ?? null}
      />

      <main className="flex-grow px-4 py-6">
        <TableInit
          initialMovimentos={movimentos ?? []}
          userEmail={userEmail}
          initialListaId={listaId ?? null}
        />
      </main>

      <Footer />
    </div>
  );
}

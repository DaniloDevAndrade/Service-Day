"use server";

import { fetchMovimentos } from "./api/fetchMovimentos";
import Header from "../components/header";
import TableInit from "./components/table";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import { getUserNivelByEmail } from "./api/getUserNivelByEmail";

export default async function EntryAndExit() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }

  const userEmail = session.user?.email as string;

  const nivel = await getUserNivelByEmail(userEmail);
  if (!nivel) {
    redirect("/"); // segurança adicional: se usuário não existe mais no banco
  }

  const { success, movimentos, listaId } = await fetchMovimentos(userEmail);

  if (!success) return <div>Erro ao carregar dados</div>;

  return (
    <div>
      <Header isAdmin={nivel === "Admin"} />
      <TableInit
        initialMovimentos={movimentos ?? []}
        userEmail={userEmail}
        initialListaId={listaId ?? null}
      />
    </div>
  );
}

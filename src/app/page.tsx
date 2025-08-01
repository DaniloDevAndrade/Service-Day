'use server'
import { fetchMovimentos } from "./api/fetchMovimentos";
import Header from "./components/header";
import TableInit from "./components/table";


export default async function Home() {
  const { success, movimentos } = await fetchMovimentos()

  if (!success || !movimentos) return <div>Erro ao carregar dados</div>;

  return (
   <div>
      <Header />
      <TableInit initialMovimentos={movimentos}/>
    </div>
  );
}

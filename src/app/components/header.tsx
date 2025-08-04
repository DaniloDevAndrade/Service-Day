import Image from "next/image";
import Link from "next/link";

type HeaderProps = {
  isAdmin?: boolean;
};

export default function Header({ isAdmin }: HeaderProps) {
  return (
    <div className="relative p-5 h-40 w-full bg-[#333] border-b-4 border-[#FF0E18] flex items-center">
      {/* Logo à esquerda */}
      <div className="absolute left-5">
        <Image
          alt="Logo-PMESP"
          src="/logo_pmesp.png"
          width={170}
          height={170}
          className="object-contain"
        />
      </div>

      {/* Texto centralizado */}
      <div className="absolute left-1/2 transform -translate-x-1/2 text-center text-white font-bold">
        <h1 className="text-2xl leading-none">Serviço de Dia</h1>
        <h3 className="text-lg leading-none mt-2">33ºBPM/M</h3>
      </div>

      {/* Navegação à direita */}
      <nav className="absolute right-5 flex flex-row gap-5 text-white">
        {isAdmin && (
          <>
            <Link href="/" className="hover:font-bold font-medium">
              Início
            </Link>
            <Link href="/register" className="hover:font-bold font-medium">
              Registrar
            </Link>
          </>
        )}
        <Link href="/entryandexit" className="hover:font-bold font-medium">
          Entrada de Pessoas e Veículos
        </Link>
      </nav>
    </div>
  );
}

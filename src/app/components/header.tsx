import Image from "next/image";

export default function Header(){
    return (
    <div className="p-5 h-40 w-screen flex flex-row bg-[#333] items-center border-b-3 justify-between border-[#FF0E18]">
        <Image alt="Logo-PMESP" src="/logo_pmesp.png" width='180' height='180' ></Image>
        <div className="flex flex-col justify-center items-center font-bold text-2xl">
            <h1>Serviço de Dia</h1>
            <h3>33ºBPM/M</h3>
        </div>
        <nav className="flex flex-row gap-5">
            <a href="#" className="hover:font-bold font-medium ">Entrada de Pessoas e Veiculos</a>
            {/* <a href="#">Mapa Força</a> */}
        </nav>
    </div>
    )
}
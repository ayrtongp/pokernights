import Image from 'next/image'
import { Inter } from 'next/font/google'
import Jogos_new from '@/actions/Jogos_new'
import { useEffect, useState } from 'react'
import TabelaPadrao from '@/components/Tabelas/TabelaPadrao'
import Jogos_getAll from '@/actions/Jogos_getAll'
import Link from 'next/link'
import { useRouter } from 'next/router';


export default function Home() {

  const router = useRouter();
  const [novoJogo, setNovoJogo] = useState();
  const [jogos, setJogos] = useState();

  const handleNewGame = async () => {
    const result = await Jogos_new();
    setNovoJogo(result)
  }

  const handleGameClick = (e: any) => {
    router.push(`/jogo/${e}`);
  }

  useEffect(() => {
    async function fetchData() {
      const getJogos = await Jogos_getAll();
      setJogos(getJogos)
    }
    fetchData();
  }, [novoJogo])

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="container w-full text-center font-mono text-sm lg:flex">
        <p className='text-center mx-auto'>Poker Nights</p>
      </div>

      <div className='mt-10'>
        <button onClick={handleNewGame} className='rounded-sm shadow-sm bg-blue-400 hover:bg-blue-600 px-3 py-2'>
          Novo Jogo
        </button>
      </div>

      <div>
        <p>Tabela de Jogos</p>
        <TabelaPadrao esconderPaginacao
          id='t_jogos' resultData={jogos}
          arrayHeaderNames={['_id', '_id', 'aberto']} arrayRowsNames={['_id', '_id', 'aberto']}
          onRowClick={handleGameClick} handlePageChange={() => null} />
      </div>
    </main>
  )
}

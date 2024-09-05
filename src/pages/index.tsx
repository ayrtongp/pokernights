import Jogos_new from '@/actions/Jogos_new'
import { useEffect, useState } from 'react'
import TabelaPadrao from '@/components/Tabelas/TabelaPadrao'
import Jogos_getAll from '@/actions/Jogos_getAll'
import { useRouter } from 'next/router';
import TextInputM2 from '@/components/Forms/TextInputM2'
import { Jogos_deleteGame } from '@/actions/Jogos'
import { Jogadores_deleteGame } from '@/actions/Jogadores';
import { Financeiro_deleteGame } from '@/actions/Financeiro';
import { formatDateBRL } from '@/utils/functions';
import { getJSDocParameterTags } from 'typescript';
import { sendMessage } from './api/WhatsApp';


export default function Home() {

  const router = useRouter();
  const [novoJogo, setNovoJogo] = useState();
  const [jogos, setJogos] = useState();
  const [idJogoDelete, setIdJogoDelete] = useState<string>('');

  const handleNewGame = async () => {
    const result = await Jogos_new();
    const { id } = result
    const message = `*Hoje Tem!:* 🃏🎲🎰 \n\n https://pokernights.vercel.app/jogo/${id}`
    await sendMessage(process.env.NEXT_PUBLIC_POKERGROUP as string, message)
    setNovoJogo(result)
  }

  const handleGameClick = (e: any) => {
    router.push(`/jogo/${e}`);
  }

  const handleDeleteJogo = async () => {
    if (idJogoDelete != undefined && idJogoDelete != null && idJogoDelete != '') {
      const { data: data1, responseOk: res1 } = await Jogos_deleteGame(idJogoDelete);
      if (res1) {
        const { data: data2, responseOk: res2 } = await Jogadores_deleteGame(idJogoDelete);
        if (res2) {
          const { data: data3, responseOk: res3 } = await Financeiro_deleteGame(idJogoDelete);

        }
      }
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const getJogos = await Jogos_getAll();
        const formatted = getJogos.map((a: any, b: number) => ({
          ...a,
          dataBRL: formatDateBRL(a.createdAt)

        }))
        setJogos(formatted);
      } catch (error) {
        console.error('Failed to fetch jogos:', error);
      }
    }

    fetchData();
  }, [novoJogo]);

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
          columns={[
            { headerLabel: '_id', headerName: '_id', alignment: 'text-center' },
            { headerLabel: 'Data', headerName: 'dataBRL', alignment: 'text-center' },
            { headerLabel: 'Aberto', headerName: 'aberto', alignment: 'text-center' },
          ]}
          onRowClick={handleGameClick} handlePageChange={() => null} />
      </div>

      <div className='flex text-center justify-center flex-col mt-10 border shadow-md rounded-md p-2'>
        <TextInputM2 disabled={false} label='Deletar Jogo' name='deleteJogo' onChange={(e: any) => setIdJogoDelete(e.target.value)} value={idJogoDelete} />
        <div className='mt-2 px-3 py-2 bg-blue-600 border shadow-md rounded-md' onClick={handleDeleteJogo}>
          Deletar Jogo
        </div>
      </div>
    </main>
  )
}

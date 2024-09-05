import TextInputM2 from '@/components/Forms/TextInputM2'
import PokerTable from '@/components/Poker/PokerTable'
import TabelaPadrao from '@/components/Tabelas/TabelaPadrao';
import { useEffect, useState } from 'react'
import { formatValue2, notifyError, notifySuccess } from '@/utils/functions'
import AccordionM1 from '@/components/AccordionM1';
import { useRouter } from 'next/router';
import Jogadores_new from '@/actions/Jogadores_new';
import Jogadores_getGame from '@/actions/Jogadores_getGame';
import { Financeiro_deleteId, Financeiro_getGame } from '@/actions/Financeiro';
import CurrencyInput, { formatValue } from 'react-currency-input-field';
import { FaPlus } from 'react-icons/fa';
import DespesaCompartilhada from '@/components/Poker/DespesaCompartilhada';
import html2canvas from 'html2canvas';
import { sendImage } from '../api/WhatsApp';
import { Jogos_closeGame, Jogos_isGameActive } from '@/actions/Jogos';

interface Jogador {
  _id: string

  createdAt?: string;
  updatedAt?: string;
  saldoFichas: number;

  despesas: string;
  fichas: string;
  fichasFinal: string;
  jogo_id: string;
  nome_jogador: string;
  saldo: string;
}

export default function Home() {

  const router = useRouter();
  const { id } = router.query
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [jogadores, setJogadores] = useState([]);
  const [financeiro, setFinanceiro] = useState([]);
  const [tableJogadores, setTableJogadores] = useState<Jogador[]>();
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [novoJogador, setNovoJogador] = useState('');

  const [financeiroFiltrado, setFinanceiroFiltrado] = useState(financeiro);
  const [nomeFiltrado, setNomeFiltrado] = useState<string>('');

  // #################################
  // #################################
  // HANDLERS
  // #################################
  // #################################

  const handleCapture = async () => {
    const imgData = await generateCanvasBase64();
    if (tableJogadores) {
      const caption = rankearJogadores(tableJogadores)
      await sendImage(process.env.NEXT_PUBLIC_POKERGROUP as string, imgData.split(',')[1], caption)
    }
  };


  const handleFilterJogador = (e: any) => {
    const filtered = financeiro.filter((value: any) => value.nome_jogador == e.target.innerText)
    setFinanceiroFiltrado(filtered)
    setNomeFiltrado(e.target.innerText)
  }

  const handleResetFiltro = () => {
    setFinanceiroFiltrado(financeiro)
    setNomeFiltrado('')
  }

  const handleAddJogador = async (e: any) => {
    e.preventDefault();
    const objData = {
      jogo_id: id,
      nome_jogador: novoJogador
    }
    const newJogador = await Jogadores_new(objData);
    setNovoJogador('')
    setTriggerFetch(prev => !prev); // Alterna o estado para disparar o useEffect
  }

  const handleAddFichasSuccess = () => {
    setTriggerFetch(prev => !prev); // Alterna o estado para disparar o useEffect
  };

  const handleDelete = async (e: any) => {
    if (window.confirm("Você realmente deseja fazer isso?")) {
      const { data, responseOk } = await Financeiro_deleteId(e.currentTarget.id)
      if (responseOk) {
        notifySuccess('Despesa Deletada')
        setTriggerFetch(prev => !prev); // Alterna o estado para disparar o useEffect
      }
    } else {
      notifyError('Ação Cancelada')
    }
  }

  const handleFinishGame = async () => {
    const confirmation = window.confirm('Tem certeza que deseja encerrar o jogo?')

    if (confirmation) {
      const closeGame = await Jogos_closeGame(id as string)
    }
  }

  useEffect(() => {
    async function fetchData() {
      if (id != undefined && id != null) {
        const isGameActive = await Jogos_isGameActive(id as string);
        setGameActive(isGameActive.aberto === 'S')
        const getJogadores = await Jogadores_getGame(id as string)
        const { data: getFinanceiro, responseOk: res1 } = await Financeiro_getGame(id as string);
        setJogadores(getJogadores)
        setFinanceiro(getFinanceiro)
        setFinanceiroFiltrado(getFinanceiro)

        const tabelaJogadores = montarTabelaJogadores(getJogadores, getFinanceiro)

        setTableJogadores(tabelaJogadores)
      }
    }
    fetchData();
  }, [id, triggerFetch])

  useEffect(() => { }, [])

  return (
    <div className='container mx-auto bg-green-100'>

      {/* <RoundedButton /> */}

      <div className='text-center'>
        <h1 className="text-4xl font-bold text-center shadow-lg">Poker Night</h1>
      </div>

      <div id='teste' className='max-w-lg text-center mx-auto my-10 p-10'>
        {jogadores && (
          <PokerTable jogadores={jogadores} financeiro={financeiro} onAddFichasSuccess={handleAddFichasSuccess} isGameActive={gameActive} />
        )}
      </div>

      {gameActive && (
        <div className='p-2'>
          <AccordionM1 title={"Adicionar Jogador"} children={
            <form onSubmit={handleAddJogador} className='flex flex-row justify-center mt-5 p-2 items-center gap-2 bg-gray-100 '>
              <div className='border rounded-md shadow-md max-w-[300px] p-2 bg-white'>
                <TextInputM2 disabled={false} label='Nome do Jogador' name='nome_jogador' onChange={(e: any) => setNovoJogador(e.target.value)} value={novoJogador} />
              </div>
              <div className='text-white font-bold w-full text-center'>
                <button type='submit' className='rounded-md shadow-lg border bg-blue-500 px-2 py-3 '>Adicionar Jogador</button>
              </div>
            </form>
          } />
        </div>
      )}

      <div className='p-2'>
        <AccordionM1 title={"Tabela de Jogadores"} children={
          <div>
            <TabelaPadrao id={'tabela-jogadores'}
              resultData={tableJogadores}
              handlePageChange={() => null}
              onRowClick={() => null}
              columns={[
                { headerLabel: '_id', headerName: '_id', alignment: 'text-center' },
                { headerLabel: 'Nome', headerName: 'nome_jogador', alignment: 'text-center' },
                { headerLabel: 'Fichas (R$)', headerName: 'fichas', alignment: 'text-right' },
                { headerLabel: 'Fichas Final', headerName: 'fichasFinal', alignment: 'text-right' },
                { headerLabel: 'Despesas', headerName: 'despesas', alignment: 'text-right' },
                { headerLabel: 'Saldo', headerName: 'saldo', alignment: 'text-right', currencyColor: true },
              ]}
              esconderPaginacao />
          </div>
        } />
      </div>

      <div className='p-2'>
        <AccordionM1 title={"Todas as Despesas"} children={
          <div className=''>
            <div className='my-2'>
              <ul className='flex flex-wrap gap-2 text-xs'>
                <li onClick={handleResetFiltro} className={`px-2 py-1 rounded-md border ${nomeFiltrado == '' ? 'bg-blue-400' : 'bg-gray-100'}`} >Sem Filtro</li>
                {jogadores.map((valor: any, index: number) => {
                  const isFiltered = valor.nome_jogador == nomeFiltrado
                  return (
                    <li key={index} onClick={handleFilterJogador} className={`px-2 py-1 rounded-md border ${isFiltered ? 'bg-blue-400' : 'bg-gray-100'}`}>{valor.nome_jogador}</li>
                  )
                })}
              </ul>
            </div>

            <div className='w-full overflow-x-auto'>
              <table id='tabelaFinanceira' className='table-auto min-w-full bg-white text-xs'>
                <thead>
                  <tr className='bg-black text-white font-bold'>
                    <th className='hidden'>_id</th>
                    <th className='py-2 px-4 border-b uppercase italic'>Hora</th>
                    <th className='py-2 px-4 border-b uppercase italic'>Jogador</th>
                    <th className='py-2 px-4 border-b uppercase italic'>Despesa</th>
                    <th className='py-2 px-4 border-b uppercase italic'>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {financeiroFiltrado.length > 0 && (
                    financeiroFiltrado.map((despesa: any, index: number) => {
                      const criado = (despesa.createdAt).split(' ')
                      const formattedValue2 = formatValue({ value: despesa.valor.toString(), intlConfig: { locale: 'pt-BR', currency: 'BRL' }, });
                      const isNegative = despesa.valor < 0
                      return (
                        <tr id={despesa._id} key={index} onClick={handleDelete} className={`whitespace-nowrap ${index % 2 == 0 ? 'bg-gray-50' : ''}`}>
                          <td className='hidden'>{despesa._id}</td>
                          <td className='py-2 px-4 border-b whitespace-nowrap'>{criado[1]}</td>
                          <td className='py-2 px-4 border-b whitespace-nowrap'>{despesa.nome_jogador}</td>
                          <td className='py-2 px-4 border-b whitespace-nowrap'>{despesa.nome_despesa}</td>
                          <td className={`py-2 px-4 border-b whitespace-nowrap text-right ${isNegative ? 'text-red-400' : ''}`}>{formattedValue2}</td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        } />
      </div>

      {gameActive && id != undefined && typeof id === 'string' && (
        <div className='p-2'>
          <AccordionM1 title={"Despesa Compartilhada"} children={
            <DespesaCompartilhada jogadores={jogadores} jogoId={id} triggerFetch={setTriggerFetch} />
          } />
        </div>
      )}

      {gameActive && (
        <div className='text-center mt-5 pb-5 flex flex-row gap-2 justify-center'>
          <button className='px-3 py-2 bg-blue-300 border-blue-600 rounded-md shadow-md' onClick={handleCapture}>Gerar Relatório</button>
          <button className='px-3 py-2 bg-blue-300 border-blue-600 rounded-md shadow-md' onClick={handleFinishGame}>Encerrar</button>
        </div>
      )}

    </div>


  )
}

// #################################
// #################################
// COMPONENTS
// #################################
// #################################

const EditableTable = ({ jogadores }: any) => {
  const [rows, setRows] = useState([{ nome: '', valor: '' }]);

  useEffect(() => {
    if (rows.length > 0 && rows[rows.length - 1].nome && rows[rows.length - 1].valor) {
      setRows([...rows, { nome: '', valor: '' }]);
    }
  }, [rows]);

  const handleChange = (index: any, field: any, value: any) => {
    const updatedRows = rows.map((row, i) => {
      if (i === index) {
        return { ...row, [field]: value };
      }
      return row;
    });
    setRows(updatedRows);
  };

  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="py-3 px-6">Nome</th>
            <th scope="col" className="py-3 px-6">Valor</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <td className="py-4 px-6">
                <select
                  className="mt-1 block w-full border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md"
                  value={row.nome}
                  onChange={(e) => handleChange(index, 'nome', e.target.value)}
                >
                  <option value="">Selecione um jogador</option>
                  {jogadores.map((player: any, playerIndex: any) => (
                    <option key={playerIndex} value={player.option}>
                      {player.value}
                    </option>
                  ))}
                </select>
              </td>
              <td className="py-4 px-6">
                <input
                  type="text"
                  className="mt-1 block w-full border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md"
                  value={row.valor}
                  onChange={(e) => handleChange(index, 'valor', e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const RoundedButton = () => {
  return (
    <div className="fixed bottom-6 right-6">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-full">
        <FaPlus size={20} />
      </button>
    </div>
  )
}

// #################################
// #################################
// FUNCTIONS
// #################################
// #################################

function formatterBRL(valor: number) {
  const novoValor = formatValue({ value: valor.toString(), intlConfig: { locale: 'pt-BR', currency: 'BRL' }, })
  return novoValor
}

async function generateCanvasBase64(): Promise<string> {
  const container1 = document.getElementById('teste') as HTMLElement;
  const container2 = document.getElementById('tabela-jogadores') as HTMLElement;
  const container3 = document.getElementById('tabelaFinanceira') as HTMLElement;

  // Convert HTML elements to canvas using html2canvas
  const canvas1 = await html2canvas(container1, { scale: 2 });
  const canvas2 = await html2canvas(container2);
  const canvas3 = await html2canvas(container3);

  // Combine the canvases into one
  const combinedCanvas = document.createElement('canvas');
  const context = combinedCanvas.getContext('2d') as CanvasRenderingContext2D;
  const padding = 20; // Space between tables
  combinedCanvas.width = Math.max(canvas1.width, canvas2.width, canvas3.width);
  combinedCanvas.height = canvas1.height + canvas2.height + canvas3.height + (2 * padding);

  context.drawImage(canvas1, 0, 0);
  context.drawImage(canvas2, 0, canvas1.height + padding);
  context.drawImage(canvas3, 0, canvas1.height + canvas2.height + (2 * padding));

  // Convert the combined canvas to Base64 image data
  const imgData: string = combinedCanvas.toDataURL('image/png');

  // Return the Base64 data
  return imgData;
}

function rankearJogadores(jogadores: Jogador[]): string {
  const jogadoresClassificados = jogadores
    .filter((a, b) => a.nome_jogador != 'Total')
    .sort((a, b) => b.saldoFichas - a.saldoFichas);

  const ranking = jogadoresClassificados.map((jogador, index) => {
    if (index === 0) {
      return `${index + 1} - ${jogador.nome_jogador}: ${jogador.saldoFichas} 👑`;
    }
    else if (index === jogadoresClassificados.length - 1) {
      return `${index + 1} - ${jogador.nome_jogador}: ${jogador.saldoFichas} 💣`;
    }
    else {
      return `${index + 1} - ${jogador.nome_jogador}: ${jogador.saldoFichas}`;
    }
  });

  return ranking.join('\n')
}

function montarTabelaJogadores(jogadores: Jogador[], financas: any) {
  const tabelaJogadores = jogadores.map((jogador: Jogador, index: number) => {
    const saldo = financas.reduce((acc: any, financeiro: any) => {
      if (financeiro.jogador_id === jogador._id) {
        return acc + financeiro.valor;
      }
      return acc;
    }, 0);
    const fichas = financas.reduce((acc: any, financeiro: any) => {
      if (financeiro.jogador_id === jogador._id && financeiro.categoria === "Fichas") {
        return acc + financeiro.valor;
      }
      return acc;
    }, 0);
    const despesas = financas.reduce((acc: any, financeiro: any) => {
      if (financeiro.jogador_id === jogador._id && financeiro.categoria === "Despesas") {
        return acc + financeiro.valor;
      }
      return acc;
    }, 0);
    const fichasFinal = financas.reduce((acc: any, financeiro: any) => {
      if (financeiro.jogador_id === jogador._id && financeiro.categoria === "Cash out") {
        return acc + financeiro.valor;
      }
      return acc;
    }, 0);
    const saldoFichas = financas.reduce((acc: any, financeiro: any) => {
      if (financeiro.jogador_id === jogador._id && (financeiro.categoria === "Cash out" || financeiro.categoria === "Fichas")) {
        return acc + financeiro.valor;
      }
      return acc;
    }, 0);

    return {
      ...jogador,
      saldo: formatValue({ value: saldo.toString(), intlConfig: { locale: 'pt-BR', currency: 'BRL' }, }),
      saldoFichas: saldoFichas,
      fichas: formatValue({ value: fichas.toString(), intlConfig: { locale: 'pt-BR', currency: 'BRL' }, }),
      despesas: formatValue({ value: despesas.toString(), intlConfig: { locale: 'pt-BR', currency: 'BRL' }, }),
      fichasFinal: formatValue({ value: fichasFinal.toString(), intlConfig: { locale: 'pt-BR', currency: 'BRL' }, }),
    };
  })

  const ultimaLinha = {
    nome_jogador: "Total",
    saldo: formatterBRL(financas.reduce((total: any, fin: any) => total + fin.valor, 0)),
    fichas: formatterBRL(financas.filter((fin: any) => fin.nome_despesa === 'Compra de Fichas').reduce((total: any, fin: any) => total + fin.valor, 0)),
    despesas: formatterBRL(financas.filter((fin: any) => fin.nome_despesa !== 'Final' && fin.nome_despesa !== 'Compra de Fichas').reduce((total: any, fin: any) => total + fin.valor, 0)),
    fichasFinal: formatterBRL(financas.filter((fin: any) => fin.nome_despesa === 'Final').reduce((total: any, fin: any) => total + fin.valor, 0)),
  };

  tabelaJogadores.push(ultimaLinha as any);

  return tabelaJogadores;
}
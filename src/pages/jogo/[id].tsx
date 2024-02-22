import MoneyInput from '@/components/Forms/MoneyInputM2';
import SelectInputM2 from '@/components/Forms/SelectInputM2';
import TextInputM2 from '@/components/Forms/TextInputM2'
import PokerTable from '@/components/Poker/PokerTable'
import TabelaPadrao from '@/components/Tabelas/TabelaPadrao';
import { useEffect, useState } from 'react'
import { formatValue, notifyError, notifySuccess } from '@/utils/functions'
import AccordionM1 from '@/components/AccordionM1';
import { useRouter } from 'next/router';
import Jogadores_new from '@/actions/Jogadores_new';
import Jogadores_getGame from '@/actions/Jogadores_getGame';
import { Financeiro_deleteId, Financeiro_getGame } from '@/actions/Financeiro';

export default function Home() {

  const router = useRouter();
  const { id } = router.query
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [jogadores, setJogadores] = useState([]);
  const [financeiro, setFinanceiro] = useState([]);
  const [tableJogadores, setTableJogadores] = useState();

  const [nomeJogadorDespesa, setNomeJogadorDespesa] = useState('');
  const [novoJogador, setNovoJogador] = useState('');
  const [nomeDespesa, setNomeDespesa] = useState('');
  const [valorDespesa, setValorDespesa] = useState(0);
  const [valorJogador, setValorJogador] = useState(0);

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
      console.log(e.currentTarget)
      const { data, responseOk } = await Financeiro_deleteId(e.currentTarget.id)
      if (responseOk) {
        notifySuccess('Despesa Deletada')
        setTriggerFetch(prev => !prev); // Alterna o estado para disparar o useEffect
      }
    } else {
      notifyError('Ação Cancelada')
    }
  }

  useEffect(() => {
    async function fetchData() {
      if (id != undefined && id != null) {
        const getJogadores = await Jogadores_getGame(id as string)
        const { data: getFinanceiro, responseOk: res1 } = await Financeiro_getGame(id as string);
        setJogadores(getJogadores)
        setFinanceiro(getFinanceiro)

        const tabelaJogadores = getJogadores.map((jogador: any) => {
          // Calcula o saldo de cada jogador
          const saldo = getFinanceiro.reduce((acc: any, financeiro: any) => {
            if (financeiro.jogador_id === jogador._id) {
              return acc + financeiro.valor; // Assumindo que `valor` é um número
            }
            return acc;
          }, 0); // Inicializa o acumulador com 0
          const fichas = getFinanceiro.reduce((acc: any, financeiro: any) => {
            if (financeiro.jogador_id === jogador._id && financeiro.categoria === "Fichas") {
              return acc + financeiro.valor; // Assumindo que `valor` é um número
            }
            return acc;
          }, 0); // Inicializa o acumulador com 0
          const despesas = getFinanceiro.reduce((acc: any, financeiro: any) => {
            if (financeiro.jogador_id === jogador._id && financeiro.categoria === "Despesas" && financeiro.nome_despesa != 'Final') {
              return acc + financeiro.valor; // Assumindo que `valor` é um número
            }
            return acc;
          }, 0); // Inicializa o acumulador com 0
          const fichasFinal = getFinanceiro.reduce((acc: any, financeiro: any) => {
            if (financeiro.jogador_id === jogador._id && financeiro.categoria === "Despesas" && financeiro.nome_despesa == 'Final') {
              return acc + financeiro.valor; // Assumindo que `valor` é um número
            }
            return acc;
          }, 0); // Inicializa o acumulador com 0

          // Retorna um novo objeto jogador com o saldo adicionado
          return {
            ...jogador,
            saldo: saldo,
            fichas: fichas,
            despesas: despesas,
            fichasFinal: fichasFinal,
          };
        })
        setTableJogadores(tabelaJogadores)
      }
    }
    fetchData();
  }, [id, triggerFetch])

  useEffect(() => { }, [])

  // Trata a mudança do valor, removendo a formatação monetária antes de passar para o callback
  const handleValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
    const numberValue = parseInt(rawValue) / 100; // Converte para número e ajusta os centavos
    if (e.target.name == "jogador-despesa") {
      setValorJogador(numberValue);
    } else if (e.target.name == "valor-total") {
      setValorDespesa(numberValue);
    }
  };

  return (
    <div className='container mx-auto bg-green-100'>

      <div className='text-center'>
        <h1 className="text-4xl font-bold text-center shadow-lg">Poker Night</h1>
      </div>

      <div className='max-w-lg text-center mx-auto my-10'>
        {jogadores && (
          <PokerTable jogadores={jogadores} financeiro={financeiro} onAddFichasSuccess={handleAddFichasSuccess} />
        )}
      </div>

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

      <div className='p-2'>
        <AccordionM1 title={"Tabela de Jogadores"} children={
          <div>
            <TabelaPadrao id={'tabela-jogadores'}
              resultData={tableJogadores}
              arrayHeaderNames={['_id', 'Nome', 'Fichas (R$)', 'Fichas Final', 'Despesas', 'Saldo']}
              arrayRowsNames={['_id', 'nome_jogador', 'fichas', 'fichasFinal', 'despesas', 'saldo']}
              handlePageChange={() => null}
              onRowClick={() => null}
              esconderPaginacao />

            <div className='mt-10'>
              <p className='font-bold'>Compras de Ficha:
                <span className='font-normal pl-2'>{financeiro.filter((fin: any) => fin.categoria === 'Fichas').reduce((total: any, fin: any) => total + fin.valor, 0)}  </span>
              </p>
              <p className='font-bold'>Fichas Final:
                <span className='font-normal pl-2'>{financeiro.filter((fin: any) => fin.nome_despesa === 'Final').reduce((total: any, fin: any) => total + fin.valor, 0)}  </span>
              </p>
              <p className='font-bold'>Despesas:
                <span className='font-normal pl-2'>{financeiro.filter((fin: any) => fin.nome_despesa !== 'Final').reduce((total: any, fin: any) => total + fin.valor, 0)}  </span>
              </p>
            </div>

          </div>
        } />
      </div>

      <div className='p-2'>
        <AccordionM1 title={"Todas as Despesas"} children={
          <div className='w-full overflow-x-auto'>
            <table className='table-auto min-w-full'>
              <thead>
                <tr>
                  <th className='hidden'>_id</th>
                  <th className='py-2 px-4 border-b'>hora</th>
                  <th className='py-2 px-4 border-b'>nome jogador</th>
                  <th className='py-2 px-4 border-b'>despesa</th>
                  <th className='py-2 px-4 border-b'>valor</th>
                </tr>
              </thead>
              <tbody>
                {financeiro.length > 0 && (
                  financeiro.map((despesa: any, index: number) => {
                    const criado = (despesa.createdAt).split(' ')
                    console.log(despesa._id)
                    return (
                      <tr id={despesa._id} key={index} onClick={handleDelete} className='whitespace-nowrap'>
                        <td className='hidden'>{despesa._id}</td>
                        <td className='py-2 px-4 border-b whitespace-nowrap'>{criado[1]}</td>
                        <td className='py-2 px-4 border-b whitespace-nowrap'>{despesa.nome_jogador}</td>
                        <td className='py-2 px-4 border-b whitespace-nowrap'>{despesa.nome_despesa}</td>
                        <td className='py-2 px-4 border-b whitespace-nowrap'>{despesa.valor}</td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        } />
      </div>

      <div className='hidden p-2'>
        <AccordionM1 title={"Despesa Compartilhada"} children={
          <>
            {jogadores != undefined && (
              <>
                <TextInputM2 disabled={false} label='Nome da Despesa' name='despesa' onChange={(e: any) => setNomeDespesa(e.target.value)} value={nomeDespesa} />
                <SelectInputM2 label='Quem pagou' name='quem-pagou' onChange={(e: any) => setNomeJogadorDespesa(e.target.value)} value={nomeJogadorDespesa}
                  options={jogadores.map((player: any) => ({ value: player.nome_jogador, option: player._id as unknown as string }))} />
                <MoneyInput disabled={false} label='Valor Total' name='valor-total' onChange={handleValue} value={formatValue(valorDespesa)} />
                <hr />
                <p className='mt-2 text-center'>Divisão por Jogador</p>
                <EditableTable jogadores={jogadores.map((player: any) => ({ value: player.nome_jogador, option: player._id as unknown as string }))} />
              </>
            )}
          </>
        } />
      </div>
    </div>


  )
}

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

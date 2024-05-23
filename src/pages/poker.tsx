import MoneyInput from '@/components/Forms/MoneyInputM2';
import SelectInputM2 from '@/components/Forms/SelectInputM2';
import TextInputM2 from '@/components/Forms/TextInputM2'
import PokerTable from '@/components/Poker/PokerTable'
import TabelaPadrao from '@/components/Tabelas/TabelaPadrao';
import { useEffect, useState } from 'react'
import AccordionM1 from '@/components/AccordionM1';
import { formatValue2 } from '@/utils/functions';

export default function Home() {

  const [formData, setFormData] = useState({
    nome: ""
  });
  const [nomeJogadorDespesa, setNomeJogadorDespesa] = useState('');
  const [despesaPorJogador, setDespesaPorJogador] = useState('');
  const [nomeDespesa, setNomeDespesa] = useState('');
  const [valorDespesa, setValorDespesa] = useState(0);
  const [valorJogador, setValorJogador] = useState(0);

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

  const players = [
    { _id: 1, nome: 'Ayrton wqew', fichas: 350.57, despesas: 0, saldo: 0 },
    { _id: 12, nome: 'Ayrton', fichas: 350.57, despesas: 0, saldo: 0 },
    { _id: 13, nome: 'Ayrton', fichas: 350.57, despesas: 0, saldo: 0 },
    { _id: 14, nome: 'Ayrton', fichas: 350.57, despesas: 0, saldo: 0 },
    { _id: 15, nome: 'Ayrton', fichas: 350.57, despesas: 0, saldo: 0 },
    { _id: 16, nome: 'Ayrton', fichas: 350.57, despesas: 0, saldo: 0 },
    { _id: 17, nome: 'Robson', fichas: 20, despesas: 0, saldo: 0 },
    { _id: 18, nome: 'Giovanni', fichas: 40, despesas: 0, saldo: 0 },
    { _id: 19, nome: 'Marcelo', fichas: 60, despesas: 0, saldo: 0 },
  ]
  return (
    <div className='container mx-auto bg-green-100'>

      <div className='text-center'>
        <h1 className="text-4xl font-bold text-center shadow-lg">Poker Night</h1>
      </div>

      <div className='max-w-lg text-center mx-auto my-10'>
        {/* <PokerTable players={players} /> */}
      </div>

      <div className='p-2'>
        <AccordionM1 title={"Adicionar Jogador"} children={
          <form className='flex flex-row justify-center mt-5 p-2 items-center gap-2 bg-gray-100 '>
            <div className='border rounded-md shadow-md max-w-[300px] p-2 bg-white'>
              <TextInputM2 disabled={false} label='Nome do Jogador' name='nome_jogador' onChange={() => null} value={formData.nome} />
            </div>
            <div className='text-white font-bold w-full text-center'>
              <button type='submit' className='rounded-md shadow-lg border bg-blue-500 px-2 py-3 '>Adicionar Jogador</button>
            </div>
          </form>
        } />
      </div>

      <div className='p-2'>
        <AccordionM1 title={"Tabela de Jogadores"} children={
          <TabelaPadrao id={'tabela-jogadores'}
            resultData={players}
            columns={[
              { headerLabel: '_id', headerName: '_id', alignment: 'text-center' },
              { headerLabel: 'nome', headerName: 'nome', alignment: 'text-center' },
              { headerLabel: 'fichas', headerName: 'Fichas', alignment: 'text-center' },
              { headerLabel: 'despesas', headerName: 'Despesas', alignment: 'text-center' },
              { headerLabel: 'saldo', headerName: 'Saldo', alignment: 'text-center' },
            ]}
            handlePageChange={() => null}
            onRowClick={() => null}
            esconderPaginacao />
        } />
      </div>

      <div className='p-2'>
        <AccordionM1 title={"Despesa Compartilhada"} children={
          <>
            <TextInputM2 disabled={false} label='Nome da Despesa' name='despesa' onChange={(e: any) => setNomeDespesa(e.target.value)} value={nomeDespesa} />
            <SelectInputM2 label='Quem pagou' name='quem-pagou' onChange={(e: any) => setNomeJogadorDespesa(e.target.value)} value={nomeJogadorDespesa}
              options={players.map(player => ({ value: player.nome, option: player._id as unknown as string }))} />
            <MoneyInput disabled={false} label='Valor Total' name='valor-total' onChange={handleValue} value={formatValue2(valorDespesa)} />
            <hr />
            <p className='mt-2 text-center'>Divisão por Jogador</p>
            <EditableTable players={players.map(player => ({ value: player.nome, option: player._id as unknown as string }))} />
          </>
        } />
      </div>
    </div>


  )
}

const EditableTable = ({ players }: any) => {
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
                  {players.map((player: any, playerIndex: any) => (
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

import React, { useState } from 'react';
import MesaDePoker from '../../../public/images/Mesa de Poker.png'
import Image from 'next/image';
import ModalPadrao from '../ModalPadrao';
import MoneyInput from '../Forms/MoneyInputM2';
import TextInputM2 from '../Forms/TextInputM2';
import Financeiro_addFichas from '@/actions/Financeiro_addFichas';
import { useRouter } from 'next/router';
import { notifySuccess } from '@/utils/functions';
import CurrencyInput from 'react-currency-input-field';

interface Jogador {
  nome_jogador: string;
  fichas: number
  _id: string
}

// Definindo o tipo para as props do componente
interface PokerTableProps {
  jogadores: Jogador[]; // Tipo para o array de jogadores, assumindo que cada jogador é representado por uma string
  financeiro: any; // Tipo para o array de jogadores, assumindo que cada jogador é representado por uma string
  onAddFichasSuccess: any; // Tipo para o array de jogadores, assumindo que cada jogador é representado por uma string
}

const PokerTable: React.FC<PokerTableProps> = ({ jogadores, financeiro, onAddFichasSuccess }) => {

  const router = useRouter();
  const { id } = router.query

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedJogador, setSelectedJogador] = useState<any>({});
  const [novaDespesa, setNovaDespesa] = useState<number>(0);
  const [novaDespesa2, setNovaDespesa2] = useState<number>(0);
  const [descricaoDespesa, setDescricaoDespesa] = useState('');

  const handleCloseModal = () => {
    setIsOpen(false)
  }

  const handleAddDespesa = async () => {
    const body = {
      nome_despesa: descricaoDespesa,
      valor: novaDespesa,
      jogo_id: id,
      jogador_id: selectedJogador._id,
      categoria: "Despesas",
      nome_jogador: selectedJogador.nome_jogador,
    }
    const { data: result, responseOk: resOk } = await Financeiro_addFichas(body);
    if (resOk) {
      setSelectedJogador({})
      setIsOpen(false)
      setDescricaoDespesa('')
      setNovaDespesa(0)
      notifySuccess("Despesa Adicionada")
      onAddFichasSuccess();
    }
  }

  const handleAddFichas = async () => {
    const body = {
      nome_despesa: "Compra de Fichas",
      valor: -20,
      jogo_id: id,
      jogador_id: selectedJogador._id,
      categoria: "Fichas",
      nome_jogador: selectedJogador.nome_jogador,
    }
    const { data: result, responseOk: resOk } = await Financeiro_addFichas(body);
    if (resOk) {
      setSelectedJogador({})
      setIsOpen(false)
      notifySuccess("Fichas Adicionadas")
      onAddFichasSuccess();
    }
  }

  const handleChangeDespesa = (e: any) => {
    setNovaDespesa(e.target.value)
  }

  const handleChangeDescricao = (e: any) => {
    setDescricaoDespesa(e.target.value)
  }

  const handleClickJogador = (e: any) => {
    setIsOpen(true)
    const JogadorId = e.currentTarget.dataset.jogadorid
    const jogadorSelecionado = jogadores.find(jogador => jogador._id === JogadorId);

    if (jogadorSelecionado) {
      setSelectedJogador(jogadorSelecionado)
    }
  }

  function formatToBRL(number: number) {
    return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  const angle = 360 / jogadores.length;

  return (
    <div className="relative flex items-center justify-center h-64 w-64 bg-green-700 rounded-full mx-auto">

      <ModalPadrao isOpen={isOpen} onClose={handleCloseModal}>
        <div className='flex flex-col gap-5'>
          <div onClick={handleAddFichas}
            className='px-3 py-2 bg-blue-600 text-white font-bold'>
            Adicionar Fichas
          </div>
          <div className='flex flex-col gap-1 border shadow-md p-2'>
            <TextInputM2 disabled={false} label='Descrição' name='descricao' onChange={handleChangeDescricao} value={descricaoDespesa} />
            <CurrencyInput value={novaDespesa2} intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}/>
            <MoneyInput disabled={false} label='Adionar Despesa' name='addDespesa' onChange={handleChangeDespesa} value={novaDespesa} />
            <div onClick={handleAddDespesa}
              className='px-3 py-2 bg-green-600 text-white font-bold'>
              Adicionar Outra Despesa
            </div>
          </div>
        </div>
      </ModalPadrao>

      {/* Mesa */}
      <div className=" absolute inset-0 flex justify-center items-center rounded-full overflow-hidden">
        <Image src={MesaDePoker} alt="Mesa de Poker" sizes='100%' layout="fixed" />
      </div>

      {/* Cadeiras */}
      {jogadores.map((jogador, index) => {
        const financasJogador = financeiro.filter((despesa: any) => despesa.jogador_id == jogador._id)
        const somaValor = financasJogador.reduce((soma: any, despesa: any) => soma + despesa.valor, 0)

        return (
          <div
            onClick={handleClickJogador}
            data-jogadorid={jogador._id}
            key={index}
            className="absolute h-16 w-16 bg-blue-500 rounded-full flex flex-col justify-center
          cursor-pointer items-center"
            style={{
              transform: `rotate(${angle * index}deg) translate(8rem) rotate(-${angle * index}deg)`,
              transformOrigin: 'center',
            }}
          >
            <span className="text-white font-bold text-xs">{formatToBRL(somaValor)}</span>
            <span className=" text-xs whitespace-nowra font-bold text-black-800">{jogador.nome_jogador}</span>
          </div>
        )
      })}
    </div>
  );
};

export default PokerTable;

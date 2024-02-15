import React from 'react';
import MesaDePoker from '../../../public/images/Mesa de Poker.png'
import Image from 'next/image';

interface Player {
  nome: string;
  fichas: number
}

// Definindo o tipo para as props do componente
interface PokerTableProps {
  players: Player[]; // Tipo para o array de jogadores, assumindo que cada jogador é representado por uma string
}

const PokerTable: React.FC<PokerTableProps> = ({ players }) => {

  function formatToBRL(number: number) {
    return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  const angle = 360 / players.length;

  return (
    <div className="relative flex items-center justify-center h-64 w-64 bg-green-700 rounded-full mx-auto">
      {/* Mesa */}
      <div className=" absolute inset-0 flex justify-center items-center rounded-full overflow-hidden">
        <Image src={MesaDePoker} alt="Mesa de Poker" sizes='100%' layout="fixed" />
      </div>

      {/* Cadeiras */}
      {players.map((player, index) => (
        <div
          key={index}
          className="absolute h-16 w-16 bg-blue-500 rounded-full flex flex-col justify-center items-center"
          style={{
            transform: `rotate(${angle * index}deg) translate(8rem) rotate(-${angle * index}deg)`,
            transformOrigin: 'center',
          }}
        >
          <span className="text-white font-bold text-xs">{formatToBRL(player.fichas)}</span>
          <span className=" text-xs whitespace-nowra font-bold text-black-800">{player.nome}</span>
        </div>
      ))}
    </div>
  );
};

export default PokerTable;

import { IncrementalCache } from 'next/dist/server/lib/incremental-cache';
import React from 'react';

interface MoneyInputProps {
  label: string;
  name: string;
  value: number; // Alterado para number para facilitar o manuseio de valores monetários
  disabled: boolean;
  onChange: (e: any) => void; // Alterado para facilitar a atualização do estado no componente pai
}

const MoneyInput: React.FC<MoneyInputProps> = ({ label, name, value, onChange, disabled = false }) => {
  // Formata o valor para o formato monetário BRL

  return (
    <div>
      <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor={name}>
        {label}
      </label>
      <input
        type="text"
        name={name}
        disabled={disabled}
        value={value}
        onChange={onChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>
  );
};

export default MoneyInput;

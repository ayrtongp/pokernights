import React from 'react';
import { NumericFormat, NumberFormatValues } from 'react-number-format';

interface MoneyInputProps {
  label: string;
  name: string;
  value: number; // O valor é um número para facilitar o manuseio
  disabled: boolean;
  onChange: (e: { target: { name: string; value: number | undefined } }) => void; // O value pode ser number ou undefined
}

const MoneyInput: React.FC<MoneyInputProps> = ({ label, name, value, onChange, disabled = false }) => {
  // Função para lidar com a mudança de valor
  const handleValueChange = (values: NumberFormatValues) => {
    onChange({
      target: {
        name,
        value: values.floatValue // Se floatValue for undefined, será passado como undefined
      }
    });
  };

  return (
    <div>
      <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor={name}>
        {label}
      </label>
      <NumericFormat
        value={value}
        onValueChange={handleValueChange}
        name={name}
        allowNegative
        decimalSeparator=','
        decimalScale={2}
        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
        disabled={disabled}
      />
    </div>
  );
};

export default MoneyInput;

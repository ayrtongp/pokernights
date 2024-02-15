import React from 'react';

interface SelectInputProps {
  label: string;
  name: string;
  value: string;
  options: { option: string; value: string }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
}

const SelectInputM2: React.FC<SelectInputProps> = ({ label, name, value, options, onChange, disabled = false }) => {

  const defaultOption = { option: '', value: 'Escolha um Valor' };

  return (
    <div className="">
      <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor={name}>
        {label}
      </label>
      <select
        name={name}
        disabled={disabled}
        value={value}
        onChange={onChange}
        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline cursor-pointer"
      >
        {[defaultOption, ...options].map((option) => (
          <option key={option.option} value={option.option} disabled={option.option === ''}>
          {option.value}
        </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInputM2;

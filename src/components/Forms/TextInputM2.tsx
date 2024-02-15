import React from 'react';

interface TextInputProps {
  label: string;
  name: string;
  value: string;
  disabled: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInputM2: React.FC<TextInputProps> = ({ label, name, value, onChange, disabled = false }) => {
  return (
    <div className="">
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

export default TextInputM2;

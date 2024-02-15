import { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

const AccordionM1 = ({ title, children }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-md shadow-lg">
      <div className='flex flex-row items-center'>
        <button
          className="relative flex items-center w-full p-4 font-semibold text-left transition-all ease-in border-b border-solid cursor-pointer border-slate-100 text-slate-700 rounded-t-1 group text-dark-500"
          data-collapse-target="disabled-collapse-3"
          onClick={() => setIsOpen(!isOpen)}
        >
          {title}
        </button>
        <div className='mr-3'>
          <FaPlus size={18} className={isOpen ? 'hidden' : ''} />
          <FaMinus size={18} className={isOpen ? '' : 'hidden'} />
        </div>
      </div>
      {isOpen && (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default AccordionM1;
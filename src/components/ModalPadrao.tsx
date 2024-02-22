import React from 'react';

interface ModalPadraoProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const ModalPadrao: React.FC<ModalPadraoProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
            <div className="h-full p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg">
                <span className="text-right p-1 text-2xl text-red" onClick={onClose}>
                    <button className="text-black">&times;</button>
                </span>

                {children}
            </div>
        </div>
    );
};

export default ModalPadrao;

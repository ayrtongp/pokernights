import React, { useEffect, useState } from "react";

// interface TableRow {
//   // Define the structure of your row data here
//   categoria: string,
//   descricao: string,
// }

// #########################################################################################################
// #########################################################################################################
// ################################### CONDIÇÃO IF '_ID' VISIBILIDADE HIDDEN ###################################
// #########################################################################################################
// #########################################################################################################

interface Props {
  id: string;
  resultData: any;
  handlePageChange: (e: any) => void;
  onRowClick: (e: any) => void;
  esconderPaginacao: boolean;
  marcarUltimaLinha?: boolean;
  columns: Column[];
}

interface Column {
  headerLabel: string;
  headerName: string;
  alignment: string;
  currencyColor?: boolean;
}

const TabelaPadrao = ({ id, resultData, columns, handlePageChange, onRowClick, esconderPaginacao, marcarUltimaLinha = false }: Props) => {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 50;

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handlePageChange2 = (page: number) => {
    setCurrentPage(page);
    handlePageChange(page)
  };

  useEffect(() => {
    setData(resultData)
  }, [resultData])

  return (
    <div className="overflow-x-auto">

      {!esconderPaginacao && (
        <div className="flex justify-between mt-1 mb-2">
          <p>{`Mostrando ${(currentPage - 1) * itemsPerPage + 1} - ${currentPage * itemsPerPage} evoluções`}</p>
          <div>
            <button
              onClick={() => handlePageChange2(currentPage - 1)}
              disabled={currentPage === 1}
              className={`bg-blue-500 text-white px-4 py-2 rounded mr-2 ${currentPage === 1 && 'opacity-50 cursor-not-allowed'}`}
            >
              Anterior
            </button>
            <button
              onClick={() => handlePageChange2(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`bg-blue-500 text-white px-4 py-2 rounded ${currentPage === totalPages && 'opacity-50 cursor-not-allowed'}`}
            >
              Próxima
            </button>
          </div>
        </div>
      )}

      <table id={id} className="min-w-full bg-white border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((row, index) => (
              index != 0 ? (
                <th key={index} className="py-1 px-2 border-b">{row.headerLabel}</th>
              ) : (
                <th key={index} className="hidden py-1 px-2 border-b">{row.headerLabel}</th>
              )
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) && data.length > 0 ? (
            data.map((row: any, index) => (
              <tr onClick={() => onRowClick(row._id)} key={index} 
              className={`cursor-pointer hover:bg-green-300 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white hover:bg-gray-100'} last:font-bold`}>
                {columns.map((nome, ind) => {

                  let textColor = ''
                  if (nome.currencyColor) {
                    const isNegative = row[nome.headerName].toString().includes('-')
                    textColor = isNegative ? 'text-red-400' : 'text-green-600'
                  }

                  return (
                    ind != 0 ? (
                      <td key={ind} className={`py-1 px-2 border-b whitespace-nowrap ${nome.alignment} ${textColor} `}>{row[nome.headerName]}</td>
                    ) : (
                      <td key={ind} className={`hidden`}>{row[nome.headerName]}</td>
                    )
                  )
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2} className="py-2 px-4 border-b text-center">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TabelaPadrao;
import React, { useEffect } from "react";
import PropTypes from "prop-types";

const DynamicTable = ({ 
  tableData, 
  setTableData, 
  columns, 
  handleCellChange, 
  showRowNumber = true, 
  isMetadadosTable = false, 
  isCodingRulesTable = false // Flag para impedir adição de linhas
}) => {
  // Garante que sempre haja pelo menos uma linha na tabela, exceto para a codingRulesTable
  useEffect(() => {
    // Impede a adição de linha na codingRulesTable se já houver uma linha
    if (tableData.length === 0 && !isCodingRulesTable) {
      setTableData([Array(columns.length).fill("")]); // Adiciona uma linha vazia
    } else if (isCodingRulesTable && tableData.length > 1) {
      setTableData([tableData[0]]); // Limita a tabela para apenas uma linha em CodingRules
    }
  }, [tableData, columns.length, setTableData, isCodingRulesTable]);

  const handleDeleteRow = (rowIndex) => {
    // Impede a exclusão da última linha
    if (tableData.length > 1) {
      const updatedTable = tableData.filter((_, index) => index !== rowIndex);
      setTableData(updatedTable);
    }
  };

  return (
    <table>
      <thead>
        <tr>
          {/* A coluna "Nº" será mostrada apenas na tabela de Metadados */}
          {isMetadadosTable && <th>Nº</th>}
          {columns.map((col, index) => (
            <th key={index}>{col}</th>
          ))}
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {/* A coluna "Nº" será mostrada apenas na tabela de Metadados */}
            {isMetadadosTable && <td>{rowIndex + 1}</td>}
            {row.map((cell, colIndex) => (
              <td key={colIndex}>
                <input
                  type="text"
                  value={cell}
                  onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                />
              </td>
            ))}
            <td>
              <button
                type="button"
                onClick={() => handleDeleteRow(rowIndex)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#ff4d4f",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
                title="Excluir"
              >
                X
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

DynamicTable.propTypes = {
  tableData: PropTypes.arrayOf(PropTypes.array).isRequired,
  setTableData: PropTypes.func.isRequired,
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleCellChange: PropTypes.func.isRequired,
  showRowNumber: PropTypes.bool,
  isMetadadosTable: PropTypes.bool, // Nova prop para indicar se é a tabela de Metadados
  isCodingRulesTable: PropTypes.bool, // Nova prop para impedir adição de linhas na tabela de Regras de Codificação
};

export default DynamicTable;

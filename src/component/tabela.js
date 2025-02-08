import React from "react";

function Tabela({ tableData, onTableChange }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Coluna teste</th>
          <th>Coluna 2</th>
          <th>Coluna 3</th>
          <th>Coluna 4</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, colIndex) => (
              <td key={colIndex}>
                <input
                  type="text"
                  value={cell}
                  onChange={(e) =>
                    onTableChange(rowIndex, colIndex, e.target.value)
                  }
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Tabela;

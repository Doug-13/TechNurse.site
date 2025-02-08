import React, { useState } from "react";
import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun } from "docx";
import { saveAs } from "file-saver";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
  });

  const [tableData, setTableData] = useState([
    ["", "", "", ""], // Linha inicial com 4 colunas vazias
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTableChange = (rowIndex, colIndex, value) => {
    const updatedTableData = [...tableData];
    updatedTableData[rowIndex][colIndex] = value;

    // Adiciona uma nova linha se a última linha estiver preenchida
    const isLastRowFilled = updatedTableData[rowIndex].every((cell) => cell.trim() !== "");
    if (isLastRowFilled && rowIndex === tableData.length - 1) {
      updatedTableData.push(["", "", "", ""]);
    }

    setTableData(updatedTableData);
  };

  const generateDocument = async () => {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Relatório",
                  bold: true,
                  size: 28,
                }),
              ],
              alignment: "center",
            }),
            new Paragraph({ text: "" }), // Espaço
            new Paragraph({
              children: [
                new TextRun({ text: `Nome Cliente: ${formData.name}`, size: 24 }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `Analista: ${formData.address}`, size: 24 }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `Job: ${formData.address}`, size: 24 }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Descrição: ${formData.description}`,
                  size: 24,
                }),
              ],
            }),
            new Paragraph({ text: "" }), // Espaço
            new Table({
              rows: tableData.map((row) =>
                new TableRow({
                  children: row.map((cell) =>
                    new TableCell({
                      children: [new Paragraph(cell || "")],
                    })
                  ),
                })
              ),
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "relatorio_com_tabela.docx");
  };

  return (
    <div className="container">
      <h1>Gerador de Documento Word com Tabela</h1>
      <form>
        <label>
          Nome:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Endereço:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Descrição:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </label>
        <h2>Tabela</h2>
        <table>
          <thead>
            <tr>
              <th>Coluna </th>
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
                        handleTableChange(rowIndex, colIndex, e.target.value)
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" onClick={generateDocument}>
          Gerar Documento
        </button>
      </form>
    </div>
  );
}

export default App;

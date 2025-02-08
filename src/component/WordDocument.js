import { Document, Packer, Paragraph, Table, TableRow, TableCell } from "docx";
import { saveAs } from "file-saver";

// Função para criar tabelas
const createTable = (data) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return new Table({ rows: [] });
  }

  return new Table({
    rows: data.map((row) =>
      new TableRow({
        children: row.map((cell) =>
          new TableCell({
            children: [new Paragraph({ text: cell || "" })],
            borders: {
              top: { style: "single", size: 2, color: "000000" },
              bottom: { style: "single", size: 2, color: "000000" },
              left: { style: "single", size: 2, color: "000000" },
              right: { style: "single", size: 2, color: "000000" },
            },
          })
        ),
      })
    ),
  });
};

const WordDocument = async (formData, processes) => {
  const doc = new Document({
    styles: [
      {
        id: "Heading1",
        name: "Main Heading",
        run: {
          bold: true,
          size: 28,
          color: "1F4E78",
        },
        paragraph: {
          alignment: "center",
          spacing: {
            after: 400,
          },
        },
      },
      {
        id: "Heading2",
        name: "Subheading",
        run: {
          bold: true,
          size: 18,
          color: "555555",
        },
        paragraph: {
          spacing: {
            after: 200,
          },
        },
      },
      {
        id: "Normal",
        name: "Normal Text",
        run: {
          size: 12,
          color: "333333",
        },
      },
      {
        id: "TableHeader",
        name: "Table Header",
        run: {
          bold: true,
          size: 12,
        },
        paragraph: {
          alignment: "center",
        },
        shading: {
          fill: "4472C4",
        },
      },
    ],
    sections: [
      {
        children: [
          new Paragraph({
            text: "Form Data",
            style: "Heading1",
          }),
          new Paragraph(`Name: ${formData.name}`),
          new Paragraph(`Analyst: ${formData.analist}`),
          new Paragraph(`Job: ${formData.job}`),
          new Paragraph(`Sales: ${formData.sales}`),
          new Paragraph(`Low Coder: ${formData.lowCoder}`),

          // Mapando os processos e tabelas
          ...processes.flatMap((process) => [
            new Paragraph({
              text: `Process: ${process.processName}`,
              style: "Heading2",
            }),
            new Paragraph("Coding Rules Table:"),
            createTable(process.codingRulesTable),
            new Paragraph("Details Table:"),
            createTable(process.detailsTable),
          ]),
        ],
      },
    ],
  });

  try {
    const buffer = await Packer.toBlob(doc);
    saveAs(buffer, "document.docx");
  } catch (error) {
    console.error("Erro ao gerar documento Word:", error);
  }
};

export default WordDocument;

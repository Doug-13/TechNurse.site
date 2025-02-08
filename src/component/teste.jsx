import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";

// Função para criar uma tabela
const createTable = (data) => {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  if (!data || !Array.isArray(data) || data.length === 0) {
    return { table: { body: [] } };
  }

  return {
    table: {
      headerRows: 1,
      widths: Array(data[0].length).fill("*"),
      body: [
        data[0].map((header) => ({ text: header, style: "tableHeader" })),
        ...data.slice(1).map((row) => row.map((cell) => cell !== null && cell !== undefined ? cell : " ")),
      ],
    },
    layout: "lightHorizontalLines",
  };
};

const generatePdf = (formData, processes) => {
  const documentDefinition = {
    header: {
      table: {
        widths: ["25%", "50%", "25%"], // Define as larguras das colunas
        body: [
          [
            // Primeira linha do cabeçalho
            {
              rowSpan: 2, // Mescla a célula na coluna 1 (1ª e 2ª linha)
              image: "data:image/png;base64,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", // Substitua com base64 válido
              width: 70,
              alignment: "center",
            },
            {
              text: "Especificação Técnica",
              style: "header",
              alignment: "center",
            },
            {
              text: `Data: ${new Date().toLocaleDateString()}`, // Data atual
              alignment: "right",
              margin: [0, 5, 10, 0],
            },
          ],
          [
            // Segunda linha do cabeçalho
            {}, // Coluna 1 vazia (pois já foi mesclada)
            {
              text: `Nome Cliente: ${formData.name || "N/A"}`,
              alignment: "center",
              margin: [0, 5, 0, 5],
              paddingTop: 15,
              paddingBottom: 15,
            },
            {
              text: "Rev. 00",
              alignment: "right",
              margin: [0, 0, 10, 0],
              paddingTop: 15,
              paddingBottom: 15,
            },
          ],
        ],
      },
      layout: {
        hLineWidth: (i, node) => 1, // Define largura das linhas horizontais
        vLineWidth: (i, node) => 1, // Define largura das linhas verticais
        hLineColor: () => "#000000", // Define cor das linhas horizontais
        vLineColor: () => "#000000", // Define cor das linhas verticais
        paddingLeft: () => 5,
        paddingRight: () => 5,
        paddingTop: () => 3,
        paddingBottom: () => 3,
      },
      margin: [10, 10, 10, 0], // Margem do cabeçalho
    },
    footer: (currentPage, pageCount) => ({
      text: `Page ${currentPage} of ${pageCount}`,
      alignment: "center",
      margin: [0, 10, 0, 0],
    }),
    content: [
      { text: "Form Data", style: "body" },
      `Name: ${formData.name || "N/A"}`,
      `Analyst: ${formData.analist || "N/A"}`,
      `Job: ${formData.job || "N/A"}`,
      `Sales: ${formData.sales || "N/A"}`,
      `Low Coder: ${formData.lowCoder || "N/A"}`,
      ...processes.flatMap((process, index) => {
        const content = [
          { text: `Process ${index + 1}: ${process.processName || "Unnamed"}`, style: "subheader" },
        ];

        if (process.detailsTable && process.detailsTable.length > 0) {
          content.push(
            { text: "Details Table:", margin: [0, 10, 0, 5] },
            createTable(process.detailsTable)
          );
        }


        if (process.actionsTable && process.actionsTable.length > 0) {
          content.push(
            { text: "Actions Table:", margin: [0, 10, 0, 5] },
            createTable(process.actionsTable)
          );
        }

        if (process.lists && process.lists.length > 0) {
          process.lists.forEach((list, listIndex) => {
            content.push(
              { text: `List ${listIndex + 1}: ${list.name}`, style: "subheader" },
              createTable(list.table)
            );
          });
        }

        content.push(
          { text: `Preview: ${process.preview || "N/A"}`, margin: [0, 10, 0, 5] },
          { text: `Creation: ${process.creation || "N/A"}`, margin: [0, 10, 0, 5] },
          { text: `Notification: ${process.notification || "N/A"}`, margin: [0, 10, 0, 5] }
        );

        return content;
      }),
    ],
    styles: {
      header: {
        fontSize: 16,
        bold: true,
      },
      body: {
        fontSize: 16,
        bold: true,
        marginTop: 30,
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5],
      },
      tableHeader: {
        bold: true,
        fontSize: 12,
        color: "white",
        fillColor: "#4472C4",
      },
    },
    defaultStyle: {
      fontSize: 10,
    },
  };

  pdfMake.createPdf(documentDefinition).download("document.pdf");
};

export default generatePdf;


// import * as pdfMake from "pdfmake/build/pdfmake";
// import * as pdfFonts from "pdfmake/build/vfs_fonts";

// // Função para criar uma tabela
// const createTable = (data) => {
//   pdfMake.vfs = pdfFonts.pdfMake.vfs;
//   if (!data || !Array.isArray(data) || data.length === 0) {
//     return { table: { body: [] } };
//   }

//   return {
//     table: {
//       headerRows: 1,
//       widths: Array(data[0].length).fill("*"),
//       body: [
//         data[0].map((header) => ({ text: header, style: "tableHeader" })),
//         ...data.slice(1).map((row) => row.map((cell) => cell !== null && cell !== undefined ? cell : " ")),
//       ],
//     },
//     layout: "lightHorizontalLines",
//   };
// };

// const generatePdf = (formData, processes) => {
//   const documentDefinition = {
//     header: {
//       table: {
//         widths: ["20%", "55%", "25%"], // Define as larguras das colunas
//         body: [
//           [
//             // Primeira linha do cabeçalho
//             {
//               // rowSpan: 3, // Mescla a célula na coluna 1 (1ª e 2ª linha)
//               image: "data:image/png;base64,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", // Substitua com base64 válido
//               paddingBottom: 2,
//               alignment: "center",
              
//             },
//             {
//               text: `Especificação Técnica ${formData.name || "N/A"}`, 
//               // text: `Nome Cliente: ${formData.name || "N/A"}`,
//               style: "header",
//               alignment: "center",
//             },
//             {
//               text: `Data: ${new Date().toLocaleDateString()}`, // Data atual
//               alignment: "right",
//               margin: [0, 5, 10, 0],
//             },
//           ],
       
//         ],
//       },
//     layout: {
//            hLineWidth: (i, node) => 1, // Define largura das linhas horizontais
//            vLineWidth: (i, node) => 1, // Define largura das linhas verticais
//            hLineColor: () => "#000000", // Define cor das linhas horizontais
//            vLineColor: () => "#000000", // Define cor das linhas verticais
//            paddingLeft: () => 5,
//            paddingRight: () => 5,
//            paddingTop: () => 3,
//            paddingBottom: () => 3,
//          },
//          margin: [10, 10, 10, 0], // Margem do cabeçalho
//        },
//        footer: (currentPage, pageCount) => ({
//          text: `Page ${currentPage} of ${pageCount}`,
//          alignment: "center",
//          margin: [0, 10, 0, 0],
//        }),
//        content: [
//          { text: "Form Data", style: "body" },
//          `Name: ${formData.name || "N/A"}`,
//          `Analyst: ${formData.analist || "N/A"}`,
//          `Job: ${formData.job || "N/A"}`,
//          `Sales: ${formData.sales || "N/A"}`,
//          `Low Coder: ${formData.lowCoder || "N/A"}`,
//          ...processes.flatMap((process, index) => {
//            const content = [
//              { text: `Process ${index + 1}: ${process.processName || "Unnamed"}`, style: "subheader" },
//            ];
   
//            if (process.detailsTable && process.detailsTable.length > 0) {
//              content.push(
//                { text: "Details Table:", margin: [0, 10, 0, 5] },
//                createTable(process.detailsTable)
//              );
//            }
   
   
//            if (process.actionsTable && process.actionsTable.length > 0) {
//              content.push(
//                { text: "Actions Table:", margin: [0, 10, 0, 5] },
//                createTable(process.actionsTable)
//              );
//            }
   
//            if (process.lists && process.lists.length > 0) {
//              process.lists.forEach((list, listIndex) => {
//                content.push(
//                  { text: `List ${listIndex + 1}: ${list.name}`, style: "subheader" },
//                  createTable(list.table)
//                );
//              });
//            }
   
//            content.push(
//              { text: `Preview: ${process.preview || "N/A"}`, margin: [0, 10, 0, 5] },
//              { text: `Creation: ${process.creation || "N/A"}`, margin: [0, 10, 0, 5] },
//              { text: `Notification: ${process.notification || "N/A"}`, margin: [0, 10, 0, 5] }
//            );
   
//            return content;
//          }),
//        ],
//        styles: {
//          header: {
//            fontSize: 16,
//            bold: true,
//          },
//          body: {
//            fontSize: 16,
//            bold: true,
//            marginTop: 30,
//          },
//          subheader: {
//            fontSize: 14,
//            bold: true,
//            margin: [0, 10, 0, 5],
//          },
//          tableHeader: {
//            bold: true,
//            fontSize: 12,
//            color: "white",
//            fillColor: "#4472C4",
//          },
//        },
//        defaultStyle: {
//          fontSize: 10,
//        },
//      };
   
//      pdfMake.createPdf(documentDefinition).download("document.pdf");
//    };
   
//    export default generatePdf;
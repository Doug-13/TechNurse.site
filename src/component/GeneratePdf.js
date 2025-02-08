import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import Logo from "../../src/Assets/Imagem.png"; // Importe a imagem diretamente
import Capa from "../../src/Assets/Capa.png"; // Importe a imagem diretamente

// Função para converter uma imagem em Base64
const convertImageToBase64 = (imageUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Necessário se a imagem estiver em outro domínio
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      } catch (error) {
        reject(`Erro ao converter imagem: ${error.message}`);
      }
    };
    img.onerror = () => reject("Erro ao carregar a imagem. Verifique o caminho ou URL.");
    img.src = imageUrl;
  });
};

const summary = [];
const processDetails = [];

// Função para gerar o PDF
const generatePdf = async (formData, processes) => {
  console.log('Processes:', processes); // Log processes to check its value
  if (!processes || !Array.isArray(processes)) {
    console.error("processes is not an array or is undefined");
    return;
  }

  let base64Logo, base64Capa, base64Fluxograma;

  try {
    base64Logo = await convertImageToBase64(Logo);
    base64Capa = await convertImageToBase64(Capa);
    base64Fluxograma = processes.imagePreview;
  } catch (error) {
    console.error("Erro ao converter imagens para Base64:", error);
    base64Logo = "";
    base64Capa = "";
    base64Fluxograma = "";
  }

  // Localizar os dados de Objetivo e Escopo no JSON
  const objectiveAndScope = processes.find(
    (process) => process.processName === "Objetivo e Escopo"
  ) || { objective: "", scope: "" };

  const filteredProcesses = processes.filter(
    (process) => process.processName !== "Objetivo e Escopo" && process.processName !== "Notificações, Views e Relatórios"
  );

  // Função para gerar o sumário
  const generateTableOfContents = () => {
    const tableOfContents = [
      [
        { text: "1. OBJETIVO", style: "tocItem" },
        { text: " ", style: "tocPage" }, // Placeholder para o número de página do Objetivo
      ],
      [
        { text: "2. ESCOPO", style: "tocItem" },
        { text: " ", style: "tocPage" }, // Placeholder para o número de página do Escopo
      ],
      ...filteredProcesses.map((process, index) => [
        {
          text: `${index + 3}. ${process.processName}`,
          style: "tocItem",
        },
        {
          text: `${index + 5}`, // Soma 3 para ajustar o índice de página (1 para capa, 2 para sumário, 3 para o primeiro processo)
          style: "tocPage",
          alignment: "right",
        },
      ])
    ];

    return [
      {
        text: "Sumário",
        style: "subheader",
        alignment: "center",
        margin: [0, 20, 0, 10],
      },
      {
        text: "\n", // Adicionando uma quebra de linha (espaço)
        margin: [15, 10, 30, 10], // Margens para ajustar o espaçamento
      },
      {
        style: "tableExample",
        table: {
          widths: [100, 370], // Ajuste para colunas: uma para título, outra para número de página
          body: tableOfContents,
        },
        layout: "noBorders", // Estilo sem bordas
      },
      { text: "\n\n", pageBreak: "after" },
    ];
  };

  const documentDefinition = {
    background: (currentPage) => {
      if (currentPage === 1) {
        return {
          image: base64Capa, // A imagem de capa como fundo
          width: 595, // Largura da página (A4)
          height: 842, // Altura da página (A4)
          absolutePosition: { x: 0, y: 0 }, // A posição da imagem
        };
      }
      return null; // Nenhum background nas outras páginas
    },
    content: [
      // Primeira página com o texto sobre a capa
      {
        alignment: 'center',
        columns: [
          {
            text: ''
          },
          {
            text: [
              {
                text: "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nEspecificação Técnica\n",
                fontSize: 24,
                bold: true,
                color: "#FFFFFF", // Cor branca para contraste com a capa
              },
              {
                text: "\nDetalhamento para Implantação do Greendocs\n",
                fontSize: 14,
                bold: true,
                color: "#FFFFFF", // Cor branca para contraste com a capa
              },
              {
                text: `\n${formData.name} - ${formData.job}`,
                fontSize: 18,
                color: "#FFFFFF", // Cor branca para contraste com a capa
              }
            ],
          }
        ],
        columnGap: -170,
        pageBreak: 'after'
      },
      generateTableOfContents(), // Adicionando o sumário entre a capa e o primeiro processo
      {
        text: "1. OBJETIVO",
        style: "body",
        margin: [30, 10, 30, 10],
        backgroundColor: "#FF0000",
      },
      {
        text: objectiveAndScope.objective,
        style: "normal",
        margin: [30, 0, 30, 30],
        alignment: "justify",
        lineHeight: 1.5,
        pageBreak: 'after'
      },
      {
        text: "2. ESCOPO",
        style: "body",
        margin: [30, 10, 30, 10],
      },
      {
        text: objectiveAndScope.scope,
        style: "normal",
        margin: [15, 0, 30, 30],
        alignment: "justify",
        lineHeight: 1.5,
        pageBreak: 'after'
      },

 
      // Conteúdo dos processos (começa na página 3)
      ...filteredProcesses.map((process, index) => [
        {
          text: `${index + 3}. ${process.processName}`,
          style: "body",
          margin: [15, 10, 30, 10],
          backgroundColor: "#FF0000",
          pageBreak: "before", // Garante que cada processo comece em uma nova página
        },
        {
          text: "\n", // Adicionando uma quebra de linha (espaço)
          margin: [15, 10, 30, 10], // Margens para ajustar o espaçamento
        },
        {
          text: process.objective || "Sem descrição.",
          style: "normal",
          margin: [15, 10, 30, 30],
          alignment: "justify",
          lineHeight: 1.5,
        },
        process.codingRulesTable && {
          text: `${index + 3}.1 REGRA DE CODIFICAÇÃO`,
          style: "subheader",
          margin: [15, 10, 30, 10],
        },
        {
          text: "\n", // Adicionando uma quebra de linha (espaço)
          margin: [15, 10, 30, 10], // Margens para ajustar o espaçamento
        },
        process.codingRulesTable && {
          style: "tableExample",
          table: {
            widths: ["*", "*"],
            body: [
              [
                { text: "REGRA", style: "tableHeader" },
                { text: "DESCRIÇÃO", style: "tableHeader" },
              ],
              ...process.codingRulesTable
            ],
          },
        },
        process.detailsTable && {
          text: `${index + 3}.2 METADADOS`,
          style: "subheader",
          margin: [15, 10, 30, 10],
        },
        {
          text: "\n", // Adicionando uma quebra de linha (espaço)
          margin: [15, 10, 30, 10], // Margens para ajustar o espaçamento
        },
        process.detailsTable && {
          style: "tableExample",
          table: {
            widths: ["*", "*", "*", "*", "*"],
            body: [
              [
                { text: "NOME", style: "tableHeader" },
                { text: "TIPO", style: "tableHeader" },
                { text: "OBRIGATÓRIO?", style: "tableHeader" },
                { text: "APARECE NAS ATIVIDADES", style: "tableHeader" },
                { text: "OBSERVAÇÃO", style: "tableHeader" }
              ],
              ...process.detailsTable
            ],
          },
        },
        {
          text: `${index + 3}.3 LISTAS`, // Adicionando uma quebra de linha (espaço)
          margin: [15, 10, 30, 10], // Margens para ajustar o espaçamento
          style: "subheader",
        },
        {
          text: "\n", // Adicionando uma quebra de linha (espaço)
          margin: [15, 10, 30, 10], // Margens para ajustar o espaçamento
        },
        process.lists && process.lists.map((list) => [
          {
            text: `${list.name}`,
            style: "subheader",
            margin: [15, 10, 30, 10],
          },
          {
            text: "\n", // Adicionando uma quebra de linha (espaço)
            margin: [15, 10, 30, 10], // Margens para ajustar o espaçamento
          },
          {
            style: "tableExample",
            table: {
              widths: list.table[0].length === 1 ? ["*"] : ["*", "*"], // Se uma coluna, usa "*" para largura única, se duas, usa duas larguras
              body: list.table.map(row => row.length === 1 ? [row[0]] : [row[0], row[1]]), // Adapta as linhas dependendo do número de colunas
            },
          },
        ]),

        process.imagePreview && {
          text: `${index + 3}.4 FLUXOGRAMA`,
          style: "subheader",
          margin: [15, 10, 30, 10],
        },
        {
          text: "\n", // Adicionando uma quebra de linha (espaço)
          margin: [15, 20, 30, 10], // Margens para ajustar o espaçamento
        },

        // {
        //   image: base64Fluxograma,
        //   width: 500,
        //   height: 300,
        //   alignment: "center",
        //   margin: [0, 20, 0, 20],
        //   pageBreak: "after", // If you want the fluxograma to be on a new page
        // },

        process.actionsTable && {
          text: `${index + 3}.5 ATIVIDADES / AÇÕES / RESPONSÁVEIS`,
          style: "subheader",
          margin: [15, 10, 30, 10],
        },
        {
          text: "\n", // Adicionando uma quebra de linha (espaço)
          margin: [15, 20, 30, 10], // Margens para ajustar o espaçamento
        },
        process.actionsTable && {
          style: "tableExample",
          table: {
            widths: ["*", "*", "*", "*", "*"],
            body: [
              [
                { text: "ATIVIDADE", style: "tableHeader" },
                { text: "AÇÕES", style: "tableHeader" },
                { text: "RESPONSÁVEIS", style: "tableHeader" },
                { text: "PRAZO", style: "tableHeader" },
                { text: "OBSERVAÇÕES", style: "tableHeader" }
              ],
              ...process.actionsTable
            ],
          },
        },
      ]),

    ],
    header: (currentPage) => {
      if (currentPage === 1) {
        return null;
      }
      return {
        style: "tableExample",
        table: {
          widths: ["20%", "50%", "25%"],
          body: [
            [
              {
                image: base64Logo,
                width: 80,
              },
              `Especificação Técnica \n ${formData.name || "N/A"}`,
              `Data: ${new Date().toLocaleDateString()}\n Rev:00`,
            ],
          ],
        },
        layout: {
          hLineWidth: (i, node) => 0.3,
          vLineWidth: (i, node) => 0.3,
          hLineColor: () => "#000000",
          vLineColor: () => "#000000",
          paddingLeft: () => 5,
          paddingRight: () => 5,
          paddingTop: () => 3,
          paddingBottom: () => 3,
        },
        margin: [65, 10, 30, 0],
      };
    },
    footer: (currentPage) => ({
      text: `       São Leopoldo, RS – Brasil                 51 3081-5900                    w3k.com.br              Página | ${currentPage}`,
      alignment: "center",
      margin: [0, 10, 30, 0],
    }),
    styles: {
      header: {
        fontSize: 10,
        bold: true,
        margin: [10, -30, 0, 80],
        alignment: "center",
      },
      body: {
        fontSize: 16,
        bold: true,
        marginTop: 30,
      },
      normal: {
        fontSize: 12,
        margin: [0, 10, 0, 10],
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5],
      },
      tableHeader: {
        bold: true,
        fontSize: 10,
        color: "white",
        fillColor: "#4472C4",
        alignment: "center",
      },
      tableExample: {
        margin: [10, -30, 0, 80],
        alignment: "center",
        fontSize: 12,
      },
      tocItem: {
        fontSize: 12,
        margin: [0, 5],
      },
      tocPage: {
        fontSize: 12,
        color: "gray",
        margin: [0, 5],
      },
    },
    defaultStyle: {
      fontSize: 10,
    },
    pageMargins: [40, 60, 40, 60],
    pageSize: "A4",
  };

  pdfMake.createPdf(documentDefinition).download("document.pdf");
};

export default generatePdf;

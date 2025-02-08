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

// Função para gerar o PDF
const generatePdf = async (formData, processes) => {
  let base64Logo;
  let base64Capa;

  try {
    base64Logo = await convertImageToBase64(Logo); // Logo do cabeçalho
    base64Capa = await convertImageToBase64(Capa); // Capa da primeira página
  } catch (error) {
    console.error("Erro ao converter imagens para Base64:", error);
    base64Logo = ""; // Use uma string vazia ou imagem placeholder
    base64Capa = ""; // Use uma string vazia ou imagem placeholder
  }

  // Localizar os dados de Objetivo e Escopo no JSON
  const objectiveAndScope = processes.find(
    (process) => process.processName === "Objetivo e Escopo"
  ) || { objective: "", scope: "" };

  const documentDefinition = {
    // Função background condicional
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
      {
        text: "1. OBJETIVO",
        style: "body",
        margin: [30, 60, 30, 10],
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
        margin: [30, 60, 30, 10],

      },
      {
        text: objectiveAndScope.objective,
        style: "normal",
        margin: [30, 0, 30, 30],
        alignment: "justify",
        lineHeight: 1.5,
        pageBreak: 'after'
      },
    ],
    // Cabeçalho da segunda página em diante
    header: (currentPage) => {
      if (currentPage === 1) {
        // Não exibe o cabeçalho na primeira página
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
        margin: [65, 10, 30, 0], // Margem do cabeçalho
      };
    },
    footer: (currentPage, pageCount) => ({
      text: `Page ${currentPage} of ${pageCount}`,
      alignment: "center",
      margin: [0, 10, 0, 0],
    }),
    styles: {
      header: {
        fontSize: 5,
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
        fontSize: 5,
        color: "white",
        fillColor: "#4472C4",
      },
      tableExample: {
        margin: [10, -30, 0, 80],
        alignment: "center",
      },
    },
    defaultStyle: {
      fontSize: 10,
    },
    // Definir margens para as páginas subsequentes
    pageMargins: [40, 30, 30, 30], // Margens para as páginas a partir da segunda página
    pageSize: "A4", // Definir o tamanho da página para A4
  };

  pdfMake.createPdf(documentDefinition).download("document.pdf");
};

export default generatePdf;
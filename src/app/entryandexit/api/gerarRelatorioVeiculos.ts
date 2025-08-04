import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage } from "pdf-lib";
import { saveAs } from "file-saver";
import { MovimentoComRelacionados } from "@/lib/types";

interface GerarRelatorioParams {
  numeroParte: string;
  reResponsavel: string;
  nomeGuerra: string;
  horaInicio: string;
  horaFim: string;
  lista: MovimentoComRelacionados[];
  dataLista: Date;
}

export async function gerarRelatorioVeiculosPdf({
  numeroParte,
  reResponsavel,
  nomeGuerra,
  horaInicio,
  horaFim,
  lista,
  dataLista,
}: GerarRelatorioParams) {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595.28, 841.89]);
  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const pageHeight = page.getHeight();
  let y = pageHeight - 50;

  const rowHeight = 22;
  const marginLeft = 50;
  const marginRight = 50;
  const tableX = marginLeft;

  const columns = [
    { label: "PLACA", width: 65 },
    { label: "MODELO", width: 80 },
    { label: "TIPO", width: 60 },
    { label: "RESPONSÁVEL", width: 90 },
    { label: "RE / CPF", width: 80 },
    { label: "ENT/SAÍ", width: 55 },
    { label: "HORÁRIO", width: 65 },
  ];

  const contentWidth = columns.reduce((acc, col) => acc + col.width, 0);

  const imageBytes = await fetch("/brasao.png").then((res) =>
    res.arrayBuffer()
  );
  const image = await pdfDoc.embedPng(imageBytes);
  page.drawImage(image, {
    x: 40,
    y: pageHeight - 120,
    width: 80,
    height: 100,
  });
  page.drawText(`www.policiamilitar.sp.gov.br`, {
    x: 30,
    y: pageHeight - 140,
    size: 8,
    font: boldFont,
  });

  const formatDate = (d: Date) =>
    d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  page.drawText("SECRETARIA DA SEGURANÇA PÚBLICA", {
    x: 150,
    y,
    size: 14,
    font: boldFont,
  });
  page.drawText("POLÍCIA MILITAR DO ESTADO DE SÃO PAULO", {
    x: 150,
    y: y - 20,
    size: 14,
    font: boldFont,
  });
  page.drawText(`Carapicuíba, ${formatDate(dataLista)}.`, {
    x: 150,
    y: y - 40,
    size: 12,
    font,
  });
  page.drawText(`PARTE N.º ${numeroParte}`, {
    x: 150,
    y: y - 60,
    size: 12,
    font,
  });
  page.drawText(`DO ${nomeGuerra}`, { x: 150, y: y - 80, size: 12, font });
  page.drawText(`Ao Sr Oficial de Semana.`, {
    x: 150,
    y: y - 100,
    size: 12,
    font,
  });
  page.drawText(`Assunto: Relação de Entrada e Saída de Veículos.`, {
    x: 150,
    y: y - 120,
    size: 12,
    font,
  });

  y = drawParagraphHangingIndent({
    page,
    text: `1. Informo a V.S.ª que nesta data, durante o turno de serviço das ${horaInicio}h às ${horaFim}h, adentraram ao quartel os veículos abaixo relacionados:`,
    x: marginLeft + 30,
    y: y - 200,
    maxWidth: contentWidth,
    lineHeight: 14,
    font,
    fontSize: 12,
    firstLineIndent: 70,
  });

  y -= 20;

  const drawText = (
    text: string,
    x: number,
    y: number,
    width: number,
    height: number,
    fontSize = 10,
    bold = false
  ) => {
    const activeFont = bold ? boldFont : font;
    const textWidth = activeFont.widthOfTextAtSize(text, fontSize);
    const textHeight = activeFont.heightAtSize(fontSize);
    const xPos = x + (width - textWidth) / 2;
    const yPos = y + (height - textHeight) / 2 + 2;
    page.drawText(text, { x: xPos, y: yPos, size: fontSize, font: activeFont });
  };

  const drawCell = (
    text: string,
    x: number,
    y: number,
    width: number,
    height: number,
    bold = false
  ) => {
    page.drawRectangle({
      x,
      y,
      width,
      height,
      borderWidth: 1,
      color: rgb(1, 1, 1),
      borderColor: rgb(0, 0, 0),
    });
    drawText(text, x, y, width, height, 9, bold);
  };

  const drawTableHeader = () => {
    let colX = tableX;
    for (const col of columns) {
      drawCell(col.label, colX, y, col.width, rowHeight, true);
      colX += col.width;
    }
    y -= rowHeight;
  };

  const drawTableRow = (mov: MovimentoComRelacionados) => {
    if (!mov.veiculo) return;

    let colX = tableX;
    const rowValues = [
      mov.veiculo.placa,
      mov.veiculo.modelo,
      mov.veiculo.tipo,
      mov.pessoa.nome,
      mov.pessoa.documento,
      mov.tipo,
      mov.datahora.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    ];
    for (let i = 0; i < columns.length; i++) {
      drawCell(rowValues[i] ?? "-", colX, y, columns[i].width, rowHeight);
      colX += columns[i].width;
    }
    y -= rowHeight;
  };

  const startNewPage = () => {
    page = pdfDoc.addPage([595.28, 841.89]);
    y = page.getHeight() - 50;
    drawTableHeader();
  };

  drawTableHeader();
  for (const mov of lista) {
    if (y < 80) startNewPage();
    drawTableRow(mov);
  }

  const blocoFinalAltura = 130;
  if (y < blocoFinalAltura + 60) {
    page = pdfDoc.addPage([595.28, 841.89]);
    y = page.getHeight() - 50;
  }

  // Rodapé padrão
  page.drawText(`Em _____/_____/2025.`, {
    x: marginLeft,
    y: y - 30,
    size: 12,
    font,
  });
  page.drawText(`__________________`, {
    x: marginLeft,
    y: y - 50,
    size: 12,
    font,
  });
  page.drawText(`Do Oficial de Semana`, {
    x: marginLeft,
    y: y - 70,
    size: 12,
    font,
  });
  page.drawText(`Ao Sr. ____________`, {
    x: marginLeft,
    y: y - 90,
    size: 12,
    font,
  });
  page.drawText(`__________________`, {
    x: marginLeft,
    y: y - 110,
    size: 12,
    font,
  });

  page.drawText(`Em _____/_____/2025.`, {
    x: marginLeft + 150,
    y: y - 30,
    size: 12,
    font,
  });
  page.drawText(`__________________`, {
    x: marginLeft + 150,
    y: y - 50,
    size: 12,
    font,
  });
  page.drawText(`Do Sgt de Semana`, {
    x: marginLeft + 150,
    y: y - 70,
    size: 12,
    font,
  });
  page.drawText(`Ao Sr. Oficial de Semana`, {
    x: marginLeft + 150,
    y: y - 90,
    size: 12,
    font,
  });
  page.drawText(`__________________`, {
    x: marginLeft + 150,
    y: y - 110,
    size: 12,
    font,
  });

  const partesNome = nomeGuerra.trim().split(" ");
  const patenteCompleta = partesNome.slice(0, 2).join(" ");
  const nome = partesNome.slice(2).join(" ").toUpperCase();
  const assinaturaTexto = `${abreviarPatente(
    patenteCompleta
  )} ${reResponsavel} ${nome}`;

  const linhaAssinaturaWidth = 180;
  const linhaAssinaturaX = 595.28 - marginRight - linhaAssinaturaWidth;
  const assinaturaWidth = font.widthOfTextAtSize(assinaturaTexto, 12);
  const assinaturaTextoX =
    linhaAssinaturaX + (linhaAssinaturaWidth - assinaturaWidth) / 2;

  page.drawText(`____________________________`, {
    x: linhaAssinaturaX,
    y: y - 30,
    size: 12,
    font,
  });
  page.drawText(`Assinatura`, {
    x: linhaAssinaturaX + 60,
    y: y - 50,
    size: 12,
    font,
  });
  page.drawText(assinaturaTexto, {
    x: assinaturaTextoX,
    y: y - 80,
    size: 12,
    font,
  });
  page.drawText(`Encarregado da Guarda do Quartel`, {
    x: linhaAssinaturaX + 10,
    y: y - 100,
    size: 12,
    font,
  });

  desenharRodapeEmTodasPaginas({ pdfDoc, font });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([new Uint8Array(pdfBytes)], {
    type: "application/pdf",
  });
  saveAs(blob, `Relatorio_Veiculos_${numeroParte}.pdf`);
}

function abreviarPatente(patente: string): string {
  const map: Record<string, string> = {
    Coronel: "CEL",
    TenenteCoronel: "TCEL",
    Major: "MAJ",
    Capitao: "CAP",
    PrimeiroTenente: "1º TEN",
    SegundoTenente: "2º TEN",
    Aspirante: "ASP OF",
    AlunoOficial: "ALOF",
    SubTenente: "STEN",
    PrimeiroSargento: "1º SGT",
    SegundoSargento: "2º SGT",
    TerceiroSargento: "3º SGT",
    Cabo: "CB",
    Soldado: "SD",
    Civil: "CIVIL",
    Outros: "OUT",
  };
  return map[patente] || patente;
}

function drawParagraphHangingIndent({
  page,
  text,
  x,
  y,
  maxWidth,
  lineHeight,
  font,
  fontSize,
  firstLineIndent = 20,
}: {
  page: PDFPage;
  text: string;
  x: number;
  y: number;
  maxWidth: number;
  lineHeight: number;
  font: PDFFont;
  fontSize: number;
  firstLineIndent?: number;
}): number {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";
  let isFirstLine = true;

  for (const word of words) {
    const testLine = (currentLine + word).trim();
    const lineWidth = font.widthOfTextAtSize(testLine, fontSize);
    const availableWidth = maxWidth - (isFirstLine ? firstLineIndent : 0);

    if (lineWidth > availableWidth) {
      lines.push(currentLine.trim());
      currentLine = word + " ";
      isFirstLine = false;
    } else {
      currentLine += word + " ";
    }
  }
  lines.push(currentLine.trim());

  lines.forEach((lineText, index) => {
    const offsetX = index === 0 ? x + firstLineIndent : x;
    page.drawText(lineText, {
      x: offsetX,
      y: y - index * lineHeight,
      size: fontSize,
      font,
    });
  });

  return y - lines.length * lineHeight;
}

function desenharRodapeEmTodasPaginas({
  pdfDoc,
  font,
}: {
  pdfDoc: PDFDocument;
  font: PDFFont;
}) {
  const frase =
    '"Nós Policiais Militares, sob a proteção de Deus, estamos compromissados com a defesa da Vida, da Integridade Física e Dignidade Humana."';
  const pages = pdfDoc.getPages();

  pages.forEach((page) => {
    const pageWidth = page.getWidth();
    const baseY = 30;

    page.drawLine({
      start: { x: 40, y: baseY },
      end: { x: pageWidth - 40, y: baseY },
      thickness: 1,
      color: rgb(0.5, 0.5, 0.5),
    });

    const fraseFontSize = 8;
    const fraseWidth = font.widthOfTextAtSize(frase, fraseFontSize);
    const fraseX = (pageWidth - fraseWidth) / 2;
    page.drawText(frase, {
      x: fraseX,
      y: baseY - 10,
      size: fraseFontSize,
      font,
    });
  });
}

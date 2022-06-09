import { jsPDF } from 'jspdf';
import autoTable, { FontStyle } from 'jspdf-autotable';

export function centerText({
  doc,
  y,
  text,
  x,
  fontSize,
  fontWeight,
  fontColor,
  width,
}: {
  doc: jsPDF;
  y: number;
  text: string;
  x?: number;
  fontSize?: number;
  fontWeight?: FontStyle;
  fontColor?: string;
  width?: 'auto' | 'wrap' | number;
}) {
  autoTable(doc, {
    startY: y,
    tableWidth: width,
    margin: x ? { left: x } : undefined,
    body: [[text]],
    showHead: false,

    columnStyles: {
      0: { halign: 'center', fontSize: fontSize ?? 10 },
    },
    bodyStyles: {
      textColor: fontColor ?? 'black',
      fontStyle: fontWeight ?? 'normal',
      cellPadding: 0,
    },
    theme: 'plain',
  });
}

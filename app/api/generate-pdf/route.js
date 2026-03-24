import { PDFDocument, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const { name, job, computerNo, days } = await req.json();

    const pdfPath = path.join(process.cwd(), 'public', 'eid-template.pdf');
    const existingPdfBytes = fs.readFileSync(pdfPath);

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const page = pdfDoc.getPages()[0];
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const safeName = (name || '').slice(0, 30);

    function drawRightText(text, xRight, y, size = 10) {
      const safeText = String(text || '');
      const textWidth = font.widthOfTextAtSize(safeText, size);

      page.drawText(safeText, {
        x: xRight - textWidth,
        y,
        size,
        font,
      });
    }

    drawRightText(safeName, 570, 610);
    drawRightText(job || '', 430, 610);
    drawRightText(computerNo || '', 300, 610);
    drawRightText(days || '', 170, 610);

    const pdfBytes = await pdfDoc.save();

    return new Response(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="eid-form.pdf"',
      },
    });
  } catch (error) {
    console.error(error);

    return new Response(`PDF generation failed: ${error.message}`, {
      status: 500,
    });
  }
}

import { PDFDocument } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import ArabicReshaper from 'arabic-persian-reshaper';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const { name, job, computerNo, days } = await req.json();

    const pdfPath = path.join(process.cwd(), 'public', 'eid-template.pdf');
    const pdfBytes = fs.readFileSync(pdfPath);

    const pdfDoc = await PDFDocument.load(pdfBytes);
    pdfDoc.registerFontkit(fontkit);

    const page = pdfDoc.getPages()[0];

    const fontPath = path.join(process.cwd(), 'public', 'fonts', 'Amiri-Regular.ttf');
    const fontBytes = fs.readFileSync(fontPath);
    const font = await pdfDoc.embedFont(fontBytes);

    function shapeArabicText(text) {
      const safe = String(text || '').trim();
      if (!safe) return '';

      const hasArabic = /[\u0600-\u06FF]/.test(safe);
      if (!hasArabic) return safe;

      const reshaped = ArabicReshaper.convertArabic(safe);
      return reshaped.split('').reverse().join('');
    }

    function fitTextToWidth(text, size, maxWidth) {
      let safeText = shapeArabicText(text);

      while (
        safeText.length > 0 &&
        font.widthOfTextAtSize(safeText, size) > maxWidth
      ) {
        safeText = safeText.slice(0, -1);
      }

      return safeText;
    }

    function drawRightText(text, xRight, y, size = 12, maxWidth = 140) {
      const safeText = fitTextToWidth(text, size, maxWidth);
      const textWidth = font.widthOfTextAtSize(safeText, size);

      page.drawText(safeText, {
        x: xRight - textWidth,
        y,
        size,
        font,
      });
    }

    drawRightText(name, 560, 610, 12, 150);
    drawRightText(job, 430, 610, 12, 120);
    drawRightText(computerNo, 300, 610, 12, 100);
    drawRightText(days, 170, 610, 12, 70);

    const finalPdf = await pdfDoc.save();

    return new Response(finalPdf, {
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

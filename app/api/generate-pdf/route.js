import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
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
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const pageWidth = page.getWidth();

    const safeName = String(name || '').slice(0, 30);
    const safeJob = String(job || '').slice(0, 20);
    const safeComputerNo = String(computerNo || '').slice(0, 15);
    const safeDays = String(days || '').slice(0, 5);

    // Table position
    const tableX = 82;
    const tableY = 585;
    const tableWidth = 503;
    const tableHeight = 70;
    const headerHeight = 34;
    const rowHeight = tableHeight - headerHeight;

    // Column widths (left to right on page)
    const daysW = 110;
    const computerW = 100;
    const jobW = 120;
    const nameW = tableWidth - daysW - computerW - jobW;

    const x1 = tableX + daysW;
    const x2 = x1 + computerW;
    const x3 = x2 + jobW;

    const headerBottomY = tableY + rowHeight;

    // Cover original table area
    page.drawRectangle({
      x: tableX - 2,
      y: tableY - 2,
      width: tableWidth + 4,
      height: tableHeight + 4,
      color: rgb(1, 1, 1),
    });

    // Draw outer border
    page.drawRectangle({
      x: tableX,
      y: tableY,
      width: tableWidth,
      height: tableHeight,
      borderWidth: 1.2,
      borderColor: rgb(0, 0, 0),
    });

    // Draw header background
    page.drawRectangle({
      x: tableX,
      y: headerBottomY,
      width: tableWidth,
      height: headerHeight,
      color: rgb(0.92, 0.92, 0.92),
    });

    // Redraw outer border on top
    page.drawRectangle({
      x: tableX,
      y: tableY,
      width: tableWidth,
      height: tableHeight,
      borderWidth: 1.2,
      borderColor: rgb(0, 0, 0),
      opacity: 0,
    });

    // Vertical lines
    page.drawLine({
      start: { x: x1, y: tableY },
      end: { x: x1, y: tableY + tableHeight },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    page.drawLine({
      start: { x: x2, y: tableY },
      end: { x: x2, y: tableY + tableHeight },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    page.drawLine({
      start: { x: x3, y: tableY },
      end: { x: x3, y: tableY + tableHeight },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    // Horizontal line between header and values
    page.drawLine({
      start: { x: tableX, y: headerBottomY },
      end: { x: tableX + tableWidth, y: headerBottomY },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    function drawCenteredText(text, x, y, width, height, usedFont, size = 10) {
      const safeText = String(text || '');
      const textWidth = usedFont.widthOfTextAtSize(safeText, size);
      const textHeight = size;
      const textX = x + (width - textWidth) / 2;
      const textY = y + (height - textHeight) / 2 + 2;

      page.drawText(safeText, {
        x: textX,
        y: textY,
        size,
        font: usedFont,
        color: rgb(0, 0, 0),
      });
    }

    // Headers
    drawCenteredText('الاسم', x3, headerBottomY, nameW, headerHeight, boldFont, 10);
    drawCenteredText('الوظيفة', x2, headerBottomY, jobW, headerHeight, boldFont, 10);
    drawCenteredText('رقم الكمبيوتر', x1, headerBottomY, computerW, headerHeight, boldFont, 10);
    drawCenteredText('عدد أيام التكليف', tableX, headerBottomY, daysW, headerHeight, boldFont, 10);

    // Values
    drawCenteredText(safeName, x3, tableY, nameW, rowHeight, font, 9);
    drawCenteredText(safeJob, x2, tableY, jobW, rowHeight, font, 9);
    drawCenteredText(safeComputerNo, x1, tableY, computerW, rowHeight, font, 9);
    drawCenteredText(safeDays, tableX, tableY, daysW, rowHeight, font, 9);

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

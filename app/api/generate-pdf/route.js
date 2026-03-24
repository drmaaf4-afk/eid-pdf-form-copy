import { chromium } from 'playwright';

export async function POST(req) {
  let browser;

  try {
    const { name, job, computerNo, days } = await req.json();

    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

    const url =
      `${baseUrl}/print?` +
      new URLSearchParams({
        name: String(name || ''),
        job: String(job || ''),
        computerNo: String(computerNo || ''),
        days: String(days || ''),
      }).toString();

    browser = await chromium.launch({
      headless: true,
    });

    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: 'networkidle',
    });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '15mm',
        bottom: '15mm',
        left: '15mm',
        right: '15mm',
      },
    });

    return new Response(pdf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="eid-form.pdf"',
      },
    });
  } catch (error) {
    return new Response(`PDF generation failed: ${error.message}`, {
      status: 500,
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

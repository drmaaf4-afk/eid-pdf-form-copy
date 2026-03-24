import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export async function POST(req) {
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

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: 'networkidle0',
    });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();

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
  }
}

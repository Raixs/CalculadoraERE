import { BlobReader, Uint8ArrayWriter, ZipReader } from '@zip.js/zip.js'

export interface PdfExtraidoZip {
  buffer: ArrayBuffer
  nombrePdf: string
  totalPdfs: number
}

export async function leerPdfDesdeZipProtegido(
  archivoZip: Blob,
  password: string,
): Promise<PdfExtraidoZip> {
  let zipReader: ZipReader<Blob> | null = null

  try {
    zipReader = new ZipReader(new BlobReader(archivoZip), { password })
    const entries = await zipReader.getEntries()

    if (!entries.length) {
      throw new Error('zip_empty')
    }

    const pdfEntries = entries.filter(
      (entry) => !entry.directory && entry.filename.toLowerCase().endsWith('.pdf'),
    )

    if (!pdfEntries.length) {
      throw new Error('zip_without_pdf')
    }

    const pdfEntry = pdfEntries[0]
    if (!('getData' in pdfEntry) || typeof pdfEntry.getData !== 'function') {
      throw new Error('zip_without_pdf')
    }

    const pdfData = await pdfEntry.getData(new Uint8ArrayWriter())
    if (!pdfData?.length) {
      throw new Error('pdf_empty_from_zip')
    }

    return {
      buffer: pdfData.buffer.slice(pdfData.byteOffset, pdfData.byteOffset + pdfData.byteLength),
      nombrePdf: pdfEntries[0].filename,
      totalPdfs: pdfEntries.length,
    }
  } finally {
    if (zipReader) {
      await zipReader.close()
    }
  }
}

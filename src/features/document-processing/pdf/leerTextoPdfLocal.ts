import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist'

GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

export async function leerTextoPdfLocal(arrayBuffer: ArrayBuffer): Promise<string> {
  const loadingTask = getDocument({ data: arrayBuffer })
  const pdf = await loadingTask.promise
  let text = ''

  for (let i = 1; i <= pdf.numPages; i += 1) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()
    text += `${textContent.items.map((item) => ('str' in item ? item.str : '')).join(' ')} `
  }

  return text
}

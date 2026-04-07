import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

const { mockProcesarPdfLocal, mockLeerPdfDesdeZipProtegido } = vi.hoisted(() => ({
  mockProcesarPdfLocal: vi.fn(),
  mockLeerPdfDesdeZipProtegido: vi.fn(),
}))

vi.mock('@/features/document-processing/pdf/procesarPdfLocal', () => ({
  procesarPdfLocal: mockProcesarPdfLocal,
}))

vi.mock('@/features/document-processing/zip/leerPdfDesdeZipProtegido', () => ({
  leerPdfDesdeZipProtegido: mockLeerPdfDesdeZipProtegido,
}))

import App from '@/app/App'
import type { DatosExtraidosNomina } from '@/features/document-processing/tipos'

function buildExtraccionParcial(): DatosExtraidosNomina {
  return {
    salarioBrutoMensual: 2200,
    fechaAntiguedad: '2020-01-15',
    pagasExtraProrrateadas: true,
    comisionesDetectadas: 300,
    irpfDetectado: 15,
    baseCotizacionEstimada: 2500,
    deteccion: {
      salario: true,
      fechaAntiguedad: false,
      prorrateo: false,
      irpf: false,
      comisiones: true,
    },
    fuenteSalario: 'base_ss',
    salarioBajaConfianza: false,
    camposNoDetectados: [
      'Fecha de inicio (antigüedad)',
      'Pagas extra prorrateadas (12/14 pagas)',
      'Porcentaje de IRPF',
    ],
    textoNormalizado: 'NOMINA DEMO',
    analisisNomina: {
      esNomina: true,
      score: 4,
      hits: 4,
    },
  }
}

afterEach(() => {
  mockProcesarPdfLocal.mockReset()
  mockLeerPdfDesdeZipProtegido.mockReset()
})

describe('App', () => {
  it('renderiza la landing principal', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: /Calcula tu indemnización, finiquito y paro/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/procesamos todo localmente en tu navegador/i)).toBeInTheDocument()
  })

  it('permite pasar a modo manual y actualiza resultados al editar', async () => {
    render(<App />)
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: /Continuar en Modo Manual/i }))

    expect(screen.getByText(/Estás en modo manual/i)).toBeInTheDocument()

    const salarioAnualAntes = screen.getByTestId('result-salario-anual').textContent
    const netoAntes = screen.getByTestId('result-total-neto').textContent
    const salarioInput = screen.getByLabelText(/Salario Fijo Mensual/i)
    const slider = document.querySelector('#slider-dias') as HTMLInputElement

    fireEvent.change(salarioInput, { target: { value: '3000' } })
    fireEvent.change(slider, { target: { value: '33' } })

    expect(screen.getByText('33 días')).toBeInTheDocument()
    expect(screen.getByTestId('result-salario-anual').textContent).not.toBe(salarioAnualAntes)
    expect(screen.getByTestId('result-total-neto').textContent).not.toBe(netoAntes)
  })

  it('resetea la app y vuelve a la subida', async () => {
    render(<App />)
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: /Continuar en Modo Manual/i }))
    await user.click(screen.getByRole('button', { name: /Calcular otro documento/i }))

    expect(
      screen.getByRole('heading', { name: /Sube tu nómina \(PDF o ZIP\)/i }),
    ).toBeInTheDocument()
    expect(screen.queryByText(/Estás en modo manual/i)).not.toBeInTheDocument()
  })

  it('abre y cierra el modal de contraseña al subir un ZIP', async () => {
    render(<App />)
    const user = userEvent.setup()
    const fileInput = screen.getByTestId('file-input') as HTMLInputElement
    const zipFile = new File(['contenido'], 'nomina.zip', { type: 'application/zip' })

    await user.upload(fileInput, zipFile)

    expect(screen.getByTestId('password-modal')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Cancelar/i }))

    expect(screen.queryByTestId('password-modal')).not.toBeInTheDocument()
  })

  it('muestra errores de archivo y permite continuar manualmente', async () => {
    render(<App />)
    const user = userEvent.setup()
    const fileInput = screen.getByTestId('file-input') as HTMLInputElement
    const emptyPdf = new File([], 'nomina.pdf', { type: 'application/pdf' })

    await user.upload(fileInput, emptyPdf)

    expect(await screen.findByTestId('error-modal')).toBeInTheDocument()
    expect(screen.getByText(/Archivo vacío/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Continuar sin escaneo/i }))

    expect(screen.getByText(/Estás en modo manual/i)).toBeInTheDocument()
  })

  it('muestra el banner de advertencias si la extracción no detecta todos los campos', async () => {
    mockProcesarPdfLocal.mockResolvedValue(buildExtraccionParcial())

    render(<App />)
    const user = userEvent.setup()
    const fileInput = screen.getByTestId('file-input') as HTMLInputElement
    const pdfFile = new File(['contenido valido'], 'nomina.pdf', { type: 'application/pdf' })

    await user.upload(fileInput, pdfFile)

    expect(
      await screen.findByText(/No hemos podido leer automáticamente todos los campos/i),
    ).toBeInTheDocument()
    expect(screen.getByText('Fecha de inicio (antigüedad)')).toBeInTheDocument()
    expect(screen.getByText('Pagas extra prorrateadas (12/14 pagas)')).toBeInTheDocument()
    expect(screen.getByText('Porcentaje de IRPF')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByTestId('result-salario-anual')).toHaveTextContent('30.000')
    })
  })
})

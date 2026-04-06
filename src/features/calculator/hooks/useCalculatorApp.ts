import { useCallback, useMemo, useReducer } from 'react'

import { calcularLiquidacion } from '@/domain/calculos/calcularLiquidacion'
import type { FormularioCalculadora } from '@/domain/tipos'
import {
  obtenerDetalleErrorPDF,
  obtenerDetalleErrorZIP,
} from '@/features/document-processing/errores'
import { PASSWORD_ERROR_DEFAULT } from '@/features/document-processing/constantes'
import { procesarPdfLocal } from '@/features/document-processing/pdf/procesarPdfLocal'
import { leerPdfDesdeZipProtegido } from '@/features/document-processing/zip/leerPdfDesdeZipProtegido'
import {
  isPdfFile,
  isZipFile,
  validarArchivoSeleccionado,
} from '@/features/document-processing/validarArchivo'
import type { DatosExtraidosNomina } from '@/features/document-processing/tipos'
import { mapearExtraccionAFormulario } from '@/features/calculator/mappers/mapearExtraccionAFormulario'
import {
  createInitialFormState,
  createInitialState,
} from '@/features/calculator/state/initialState'
import { calculatorReducer } from '@/features/calculator/state/reducer'

export function useCalculatorApp() {
  const [state, dispatch] = useReducer(calculatorReducer, undefined, () => createInitialState())

  const resumen = useMemo(() => calcularLiquidacion(state.form), [state.form])

  const updateField = useCallback(
    <K extends keyof FormularioCalculadora>(field: K, value: FormularioCalculadora[K]) => {
      dispatch({ type: 'SET_FIELD', payload: { field, value } })
    },
    [],
  )

  const setPreavisoSelection = useCallback((value: FormularioCalculadora['seleccionPreaviso']) => {
    dispatch({ type: 'SET_FIELD', payload: { field: 'seleccionPreaviso', value } })

    if (value !== 'custom') {
      dispatch({
        type: 'SET_FIELD',
        payload: { field: 'diasPreavisoPendientes', value },
      })
    }
  }, [])

  const clearScrollIntent = useCallback(() => {
    dispatch({ type: 'SET_SCROLL_INTENT', payload: null })
  }, [])

  const aplicarExtraccion = useCallback(
    (datos: DatosExtraidosNomina) => {
      dispatch({
        type: 'SET_FORM',
        payload: mapearExtraccionAFormulario(state.form, datos),
      })
      dispatch({ type: 'SET_EXTRACTION_WARNINGS', payload: datos.camposNoDetectados })
      dispatch({ type: 'SET_ENTRY_MODE', payload: 'file' })
      dispatch({ type: 'CLOSE_PASSWORD_MODAL' })
      dispatch({ type: 'SET_VIEW', payload: 'calculator' })
      dispatch({ type: 'SET_SCROLL_INTENT', payload: 'results' })
    },
    [state.form],
  )

  const openManualMode = useCallback(() => {
    dispatch({ type: 'HIDE_ERROR_MODAL' })
    dispatch({ type: 'CLOSE_PASSWORD_MODAL' })
    dispatch({ type: 'SET_EXTRACTION_WARNINGS', payload: [] })
    dispatch({ type: 'SET_ENTRY_MODE', payload: 'manual' })
    dispatch({ type: 'SET_VIEW', payload: 'calculator' })
    dispatch({ type: 'SET_SCROLL_INTENT', payload: 'manual' })
  }, [])

  const prepareFileMode = useCallback(() => {
    dispatch({ type: 'SET_ENTRY_MODE', payload: 'file' })
    dispatch({ type: 'SET_EXTRACTION_WARNINGS', payload: [] })
  }, [])

  const handleFiles = useCallback(
    async (files: FileList | File[] | null | undefined) => {
      const file = files?.[0]
      if (!file) {
        return
      }

      prepareFileMode()
      const validationError = validarArchivoSeleccionado(file)
      if (validationError) {
        dispatch({
          type: 'SHOW_ERROR_MODAL',
          payload: {
            title: validationError.titulo,
            message: validationError.mensaje,
            allowManual: true,
          },
        })
        return
      }

      if (isZipFile(file)) {
        dispatch({ type: 'OPEN_PASSWORD_MODAL', payload: file })
        return
      }

      if (isPdfFile(file)) {
        dispatch({
          type: 'START_LOADING',
          payload: {
            text: 'Leyendo documento PDF...',
            subtext: 'Extrayendo datos de forma segura en tu navegador.',
          },
        })

        try {
          const datos = await procesarPdfLocal(await file.arrayBuffer())
          aplicarExtraccion(datos)
        } catch (error) {
          const detalleError = obtenerDetalleErrorPDF(error)
          dispatch({
            type: 'SHOW_ERROR_MODAL',
            payload: {
              title: detalleError.titulo,
              message: detalleError.mensaje,
              allowManual: true,
            },
          })
        }
      }
    },
    [aplicarExtraccion, prepareFileMode],
  )

  const setZipPassword = useCallback(
    (value: string) => {
      dispatch({ type: 'SET_PASSWORD_VALUE', payload: value })

      if (state.ui.passwordModal.error) {
        dispatch({ type: 'SET_PASSWORD_ERROR', payload: '' })
      }
    },
    [state.ui.passwordModal.error],
  )

  const cancelZipPassword = useCallback(() => {
    dispatch({ type: 'CLOSE_PASSWORD_MODAL' })
  }, [])

  const submitZipPassword = useCallback(async () => {
    const pendingZipFile = state.ui.passwordModal.pendingZipFile
    const password = state.ui.passwordModal.value.trim()

    if (!pendingZipFile) {
      dispatch({ type: 'CLOSE_PASSWORD_MODAL' })
      dispatch({
        type: 'SHOW_ERROR_MODAL',
        payload: {
          title: 'No hay ZIP para procesar',
          message: 'Selecciona un archivo ZIP y vuelve a intentarlo.',
          allowManual: true,
        },
      })
      return
    }

    if (!password) {
      dispatch({ type: 'SET_PASSWORD_ERROR', payload: 'Introduce la contraseña para continuar.' })
      return
    }

    dispatch({ type: 'SET_PASSWORD_ERROR', payload: '' })
    dispatch({ type: 'SET_PASSWORD_SUBMITTING', payload: true })

    try {
      const pdfExtraido = await leerPdfDesdeZipProtegido(pendingZipFile, password)

      dispatch({ type: 'CLOSE_PASSWORD_MODAL' })
      dispatch({
        type: 'START_LOADING',
        payload: {
          text:
            pdfExtraido.totalPdfs > 1
              ? `ZIP válido (${pdfExtraido.totalPdfs} PDFs). Leyendo el primer PDF...`
              : 'Descomprimido con éxito. Leyendo PDF interno...',
          subtext: 'Procesando el documento localmente en tu navegador.',
        },
      })

      try {
        const datos = await procesarPdfLocal(pdfExtraido.buffer)
        aplicarExtraccion(datos)
      } catch (error) {
        const detalleErrorPdf = obtenerDetalleErrorPDF(error)
        dispatch({
          type: 'SHOW_ERROR_MODAL',
          payload: {
            title: detalleErrorPdf.titulo,
            message: detalleErrorPdf.mensaje,
            allowManual: true,
          },
        })
      }
    } catch (error) {
      const detalleErrorZip = obtenerDetalleErrorZIP(error)

      if (detalleErrorZip.tipo === 'password') {
        dispatch({
          type: 'SET_PASSWORD_ERROR',
          payload: detalleErrorZip.mensaje || PASSWORD_ERROR_DEFAULT,
        })
        dispatch({ type: 'SET_PASSWORD_VALUE', payload: '' })
        dispatch({ type: 'SET_PASSWORD_SUBMITTING', payload: false })
        return
      }

      dispatch({ type: 'CLOSE_PASSWORD_MODAL' })
      dispatch({
        type: 'SHOW_ERROR_MODAL',
        payload: {
          title: detalleErrorZip.titulo,
          message: detalleErrorZip.mensaje,
          allowManual: true,
        },
      })
    }
  }, [aplicarExtraccion, state.ui.passwordModal.pendingZipFile, state.ui.passwordModal.value])

  const closeErrorAndRetry = useCallback(() => {
    dispatch({ type: 'HIDE_ERROR_MODAL' })
    dispatch({ type: 'CLOSE_PASSWORD_MODAL' })
    dispatch({ type: 'SET_VIEW', payload: 'upload' })
    dispatch({ type: 'SET_ENTRY_MODE', payload: 'file' })
    dispatch({ type: 'SET_EXTRACTION_WARNINGS', payload: [] })
  }, [])

  const closeErrorAndProceed = useCallback(() => {
    dispatch({ type: 'HIDE_ERROR_MODAL' })
    dispatch({ type: 'SET_EXTRACTION_WARNINGS', payload: [] })
    dispatch({ type: 'SET_ENTRY_MODE', payload: 'manual' })
    dispatch({ type: 'SET_VIEW', payload: 'calculator' })
    dispatch({ type: 'SET_SCROLL_INTENT', payload: 'manual' })
  }, [])

  const resetApp = useCallback(() => {
    dispatch({ type: 'RESET_APP', payload: createInitialFormState(new Date()) })
  }, [])

  return {
    state,
    resumen,
    actions: {
      updateField,
      setPreavisoSelection,
      openManualMode,
      prepareFileMode,
      handleFiles,
      setZipPassword,
      cancelZipPassword,
      submitZipPassword,
      closeErrorAndRetry,
      closeErrorAndProceed,
      resetApp,
      clearScrollIntent,
    },
  }
}

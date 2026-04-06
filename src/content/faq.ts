export interface FaqItem {
  question: string
  answer: string
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: '¿Cómo se calcula la indemnización en un ERE?',
    answer:
      'La calculadora combina salario diario, antigüedad computable y el número de días por año trabajado que quieras simular. Después aplica el tope de mensualidades configurado para mostrar una indemnización orientativa.',
  },
  {
    question: '¿Qué incluye el finiquito además de la indemnización?',
    answer:
      'El finiquito puede incluir vacaciones no disfrutadas, pagas extra pendientes si no están prorrateadas y compensación por falta de preaviso. La indemnización por ERE se muestra separada para que distingas cada concepto con claridad.',
  },
  {
    question: '¿Puedo usar una nómina en ZIP con contraseña?',
    answer:
      'Sí. La página admite ZIP con PDF dentro y solicita la contraseña para descomprimir el archivo localmente. Esto facilita trabajar con nóminas protegidas por la gestoría sin abandonar el navegador.',
  },
  {
    question: '¿La estimación del paro es definitiva?',
    answer:
      'No. La prestación por desempleo es orientativa y depende de la base de cotización de los últimos 180 días, de los hijos a cargo y de los topes vigentes del SEPE. Tómala como una referencia previa para revisar tu caso con mayor contexto.',
  },
]

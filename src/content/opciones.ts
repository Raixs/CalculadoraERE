export interface OpcionSelect {
  value: string
  label: string
}

export const OPCIONES_TIEMPO_COTIZADO: OpcionSelect[] = [
  { value: '0', label: 'Menos de 1 año (No tienes derecho a paro)' },
  { value: '4', label: 'De 1 año a 1 año y medio (4 meses de paro)' },
  { value: '6', label: 'De 1 año y medio a 2 años (6 meses de paro)' },
  { value: '8', label: 'De 2 años a 2 años y medio (8 meses de paro)' },
  { value: '10', label: 'De 2 años y medio a 3 años (10 meses de paro)' },
  { value: '12', label: 'De 3 años a 3 años y medio (12 meses de paro)' },
  { value: '14', label: 'De 3 años y medio a 4 años (14 meses de paro)' },
  { value: '16', label: 'De 4 años a 4 años y medio (16 meses de paro)' },
  { value: '18', label: 'De 4 años y medio a 5 años (18 meses de paro)' },
  { value: '20', label: 'De 5 años a 5 años y medio (20 meses de paro)' },
  { value: '22', label: 'De 5 años y medio a 6 años (22 meses de paro)' },
  { value: '24', label: 'Más de 6 años (24 meses, el máximo)' },
]

export const OPCIONES_HIJOS: OpcionSelect[] = [
  { value: '0', label: 'Sin hijos' },
  { value: '1', label: '1 hijo' },
  { value: '2', label: '2 o más hijos' },
]

export function obtenerEtiquetaTiempoCotizado(value: string): string {
  return (
    OPCIONES_TIEMPO_COTIZADO.find((option) => option.value === value)?.label ||
    'Más de 6 años (24 meses, el máximo)'
  )
}

export function obtenerEtiquetaHijos(value: string): string {
  return OPCIONES_HIJOS.find((option) => option.value === value)?.label || 'Sin hijos'
}

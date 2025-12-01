function sanitizeField(field: string) {
  if (!/^[a-zA-Z0-9_]+$/.test(field)) {
    throw new Error('Identificador inválido');
  }
  return field;
}

export { sanitizeField }
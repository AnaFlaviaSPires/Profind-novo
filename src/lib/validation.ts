export function validateCredentials(
  email: string,
  password: string,
  name?: string,
  confirmation?: string,
) {
  if (name !== undefined && (name.trim().length < 2 || name.trim().length > 100))
    return 'Informe seu nome, entre 2 e 100 caracteres.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Informe um e-mail válido.'
  if (password.length < (name !== undefined ? 8 : 1))
    return 'Use uma senha com pelo menos 8 caracteres.'
  if (confirmation !== undefined && password !== confirmation)
    return 'As senhas precisam ser iguais.'
  return null
}

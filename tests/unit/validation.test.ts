import { describe, expect, it } from 'vitest'
import { validateCredentials } from '../../src/lib/validation'
describe('Cadastro e credenciais', () => {
  it('aceita dados mínimos válidos', () =>
    expect(validateCredentials('ana@example.com', 'senha123', 'Ana', 'senha123')).toBeNull())
  it('rejeita nome vazio e espaços', () =>
    expect(validateCredentials('ana@example.com', 'senha123', '  ', 'senha123')).toContain('nome'))
  it('rejeita e-mail inválido', () =>
    expect(validateCredentials('ana@', 'senha123')).toContain('e-mail'))
  it('rejeita senha fraca no cadastro', () =>
    expect(validateCredentials('ana@example.com', '123', 'Ana', '123')).toContain('8'))
  it('preserva login de conta existente com política anterior', () =>
    expect(validateCredentials('ana@example.com', '123')).toBeNull())
  it('rejeita confirmação diferente', () =>
    expect(validateCredentials('ana@example.com', 'senha123', 'Ana', 'outrasenha')).toContain(
      'iguais',
    ))
})

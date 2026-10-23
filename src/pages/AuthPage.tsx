import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { ArrowUpRight, Eye, EyeOff, LockKeyhole } from 'lucide-react'
import { auth, firebaseConfigured } from '../lib/firebase'
import { friendlyError } from '../lib/errors'
import { validateCredentials } from '../lib/validation'
import { ensureProfile } from '../services/profiles'
import { useAuth } from '../contexts/AuthContext'
import type { Role } from '../types/user'

export function AuthPage({ mode }: { mode: 'login' | 'register' | 'reset' }) {
  const [params] = useSearchParams()
  const { user, loading } = useAuth()
  const [role, setRole] = useState<Role>(
    params.get('perfil') === 'professional' ? 'professional' : 'client',
  )
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [target, setTarget] = useState('')
  const signup = mode === 'register'
  const reset = mode === 'reset'
  if (target) return <Navigate to={target} replace />
  if (!loading && user && !busy) return <Navigate to="/conta" replace />
  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')
    if (!auth) return
    const validation = reset
      ? !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
        ? 'Informe um e-mail válido.'
        : null
      : validateCredentials(
          email,
          password,
          signup ? name : undefined,
          signup ? confirmation : undefined,
        )
    if (validation) {
      setError(validation)
      return
    }
    setBusy(true)
    try {
      if (reset) {
        await sendPasswordResetEmail(auth, email.trim())
        setSuccess(true)
      } else if (signup) {
        const credential = await createUserWithEmailAndPassword(auth, email.trim(), password)
        try {
          await ensureProfile(credential.user, name, role)
        } catch {
          setTarget('/conta')
          return
        }
        setTarget(role === 'professional' ? '/profissional' : '/cliente')
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password)
        setTarget(params.get('destino') === 'cliente' ? '/cliente' : '/conta')
      }
    } catch (caught) {
      setError(friendlyError(caught))
    } finally {
      setBusy(false)
    }
  }
  return (
    <section className="auth-section container">
      <div className="auth-aside">
        <p className="eyebrow">BEM-VINDO AO PROFIND</p>
        <h1>
          {signup ? (
            <>
              Toda boa conexão
              <br />
              tem um começo.
            </>
          ) : reset ? (
            <>
              Vamos recuperar
              <br />o seu acesso.
            </>
          ) : (
            <>
              Que bom ter
              <br />
              você por aqui.
            </>
          )}
        </h1>
        <p>
          {signup
            ? 'Crie sua conta e dê o primeiro passo. Simples, seguro e do seu jeito.'
            : 'Seu próximo passo começa com uma conexão.'}
        </p>
        <div className="auth-symbol">
          <LockKeyhole size={66} strokeWidth={1} />
        </div>
        <Link className="text-link" to="/">
          Voltar para o início <ArrowUpRight size={17} />
        </Link>
      </div>
      <div className="form-card">
        <h2>
          {signup ? 'Criar minha conta' : reset ? 'Esqueci minha senha' : 'Entrar na sua conta'}
        </h2>
        <p>
          {signup
            ? 'Preencha seus dados para começar.'
            : reset
              ? 'Enviaremos as instruções para o seu e-mail.'
              : 'Informe seu e-mail e sua senha.'}
        </p>
        {!firebaseConfigured && (
          <div className="notice" role="status">
            O cadastro e o acesso aguardam a configuração do Firebase. Volte em breve.
          </div>
        )}
        {success ? (
          <div role="status" className="success-message">
            <h3>Confira seu e-mail</h3>
            <p>
              Se houver uma conta elegível para este endereço, você receberá as instruções de
              recuperação. Confira também o spam.
            </p>
            <Link className="text-link" to="/entrar">
              Voltar para entrar <ArrowUpRight size={17} />
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <fieldset disabled={busy || !firebaseConfigured || loading}>
              {signup && (
                <>
                  <legend className="sr-only">Cadastro</legend>
                  <div className="role-picker" role="group" aria-label="Tipo de conta">
                    <button
                      type="button"
                      aria-pressed={role === 'client'}
                      onClick={() => setRole('client')}
                    >
                      Sou cliente
                    </button>
                    <button
                      type="button"
                      aria-pressed={role === 'professional'}
                      onClick={() => setRole('professional')}
                    >
                      Sou profissional
                    </button>
                  </div>
                  <label htmlFor="name">
                    Nome
                    <input
                      id="name"
                      name="name"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={100}
                      required
                    />
                  </label>
                </>
              )}
              <label htmlFor="email">
                E-mail
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              {!reset && (
                <>
                  <label htmlFor="password">
                    Senha
                    <div className="password-field">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete={signup ? 'new-password' : 'current-password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        aria-describedby={signup ? 'password-hint' : undefined}
                        required
                      />
                      <button
                        type="button"
                        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                      </button>
                    </div>
                  </label>
                  {signup ? (
                    <>
                      <small id="password-hint">Use pelo menos 8 caracteres.</small>
                      <label htmlFor="confirmation">
                        Confirme sua senha
                        <input
                          id="confirmation"
                          name="confirmation"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          value={confirmation}
                          onChange={(e) => setConfirmation(e.target.value)}
                          required
                        />
                      </label>
                    </>
                  ) : (
                    <Link className="forgot" to="/recuperar-senha">
                      Esqueci minha senha
                    </Link>
                  )}
                </>
              )}
              {error && (
                <p className="error" role="alert">
                  {error}
                </p>
              )}
              <button
                className="button form-submit"
                disabled={busy || !firebaseConfigured || loading}
              >
                {busy
                  ? 'Aguarde…'
                  : signup
                    ? 'Criar conta'
                    : reset
                      ? 'Enviar instruções'
                      : 'Entrar'}
                <ArrowUpRight size={18} />
              </button>
            </fieldset>
          </form>
        )}
        {!success && (
          <p className="form-bottom">
            {signup ? (
              <>
                Já tem conta? <Link to="/entrar">Entrar</Link>
              </>
            ) : reset ? (
              <Link to="/entrar">Voltar para entrar</Link>
            ) : (
              <>
                Primeira vez por aqui? <Link to="/cadastrar">Criar conta</Link>
              </>
            )}
          </p>
        )}
        {signup && (
          <p className="privacy-note">
            Coletamos apenas nome, e-mail e tipo de perfil para criar sua conta. Não informe
            documentos ou dados bancários.
          </p>
        )}
      </div>
    </section>
  )
}

import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ArrowUpRight, CheckCircle2, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { friendlyError } from '../lib/errors'
import { ensureProfile } from '../services/profiles'
import { Support } from '../components/Layout'
import type { Role } from '../types/user'

export function Loading() {
  return (
    <div className="container status-screen" role="status">
      Carregando sua conta…
    </div>
  )
}
export function SessionProblem() {
  const { error, logout } = useAuth()
  const [failure, setFailure] = useState('')
  return (
    <div className="container status-screen">
      <h1>Não conseguimos carregar seu perfil</h1>
      <p role="alert">{failure || error}</p>
      <div className="actions">
        <button className="button" onClick={() => window.location.reload()}>
          Tentar novamente
        </button>
        <button
          className="button secondary"
          onClick={() => {
            void logout().catch((e) => setFailure(friendlyError(e)))
          }}
        >
          Sair
        </button>
      </div>
    </div>
  )
}
export function Account() {
  const { profile, user, admin, logout } = useAuth()
  const [name, setName] = useState('')
  const [role, setRole] = useState<Role>('client')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function complete(event: FormEvent) {
    event.preventDefault()
    if (!user) return
    if (name.trim().length < 2 || name.trim().length > 100) {
      setError('Informe seu nome, entre 2 e 100 caracteres.')
      return
    }
    setBusy(true)
    setError('')
    try {
      await ensureProfile(user, name, role)
    } catch (caught) {
      setError(friendlyError(caught))
    } finally {
      setBusy(false)
    }
  }
  if (!profile && !admin)
    return (
      <section className="container account-section">
        <div className="form-card">
          <h1>Conclua seu cadastro</h1>
          <p>
            Sua conta já foi criada, mas o perfil ainda precisa ser salvo. Confirme os dados abaixo
            para continuar com segurança.
          </p>
          <form onSubmit={complete}>
            <fieldset disabled={busy}>
              <label htmlFor="complete-name">
                Nome
                <input
                  id="complete-name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  required
                  minLength={2}
                />
              </label>
              <label htmlFor="complete-role">
                Como deseja começar?
                <select
                  id="complete-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                >
                  <option value="client">Cliente</option>
                  <option value="professional">Profissional</option>
                </select>
              </label>
              {error && (
                <p role="alert" className="error">
                  {error}
                </p>
              )}
              <button className="button">{busy ? 'Salvando…' : 'Concluir cadastro'}</button>
            </fieldset>
          </form>
          <button
            className="text-link"
            onClick={() => {
              void logout().catch((e) => setError(friendlyError(e)))
            }}
          >
            Sair da conta
          </button>
        </div>
      </section>
    )
  if (profile?.roles.length === 1 && !admin)
    return <Navigate to={profile.roles[0] === 'client' ? '/cliente' : '/profissional'} replace />
  return (
    <section className="container account-section">
      <p className="eyebrow">SUA CONTA</p>
      <h1>Escolha seu ambiente</h1>
      <div className="actions">
        {profile?.roles.includes('client') && (
          <Link className="button" to="/cliente">
            Cliente <ArrowUpRight size={18} />
          </Link>
        )}
        {profile?.roles.includes('professional') && (
          <Link className="button" to="/profissional">
            Profissional <ArrowUpRight size={18} />
          </Link>
        )}
        {admin && (
          <Link className="button" to="/admin">
            Administração <ArrowUpRight size={18} />
          </Link>
        )}
      </div>
    </section>
  )
}
export function Workspace({ area }: { area: Role | 'admin' }) {
  const { user, profile, logout } = useAuth()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const title =
    area === 'client'
      ? 'Seu espaço de cliente'
      : area === 'professional'
        ? 'Seu espaço profissional'
        : 'Administração'
  async function addRole(role: Role) {
    if (!user || !profile) return
    setBusy(true)
    setError('')
    try {
      await ensureProfile(user, profile.name, role)
    } catch (caught) {
      setError(friendlyError(caught))
    } finally {
      setBusy(false)
    }
  }
  return (
    <section className="container account-section">
      <div className="workspace-header">
        <div>
          <p className="eyebrow">{title}</p>
          <h1>Olá{profile ? `, ${profile.name.split(' ')[0]}` : ''}.</h1>
        </div>
        <button
          className="button secondary"
          disabled={busy}
          onClick={async () => {
            setBusy(true)
            try {
              await logout()
            } catch (caught) {
              setError(friendlyError(caught))
            } finally {
              setBusy(false)
            }
          }}
        >
          Sair <LogOut size={17} />
        </button>
      </div>
      <div className="welcome-card">
        <CheckCircle2 size={32} strokeWidth={1.5} />
        <h2>
          {area === 'professional'
            ? 'Seu cadastro inicial está salvo.'
            : area === 'admin'
              ? 'Acesso administrativo autorizado.'
              : 'Sua conta está pronta para o próximo passo.'}
        </h2>
        <p>
          {area === 'professional'
            ? 'O preenchimento do perfil completo e a aprovação serão disponibilizados na Sprint 2. Você ainda não está habilitado a receber solicitações.'
            : area === 'admin'
              ? 'As ferramentas de administração serão disponibilizadas nas próximas sprints.'
              : 'A solicitação e o acompanhamento de serviços serão disponibilizados nas próximas sprints. Você já pode entrar e sair com segurança.'}
        </p>
      </div>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {profile && (
        <div className="context-switch">
          <h3>Uma conta, suas conexões.</h3>
          <p>Você pode usar a mesma identidade como cliente e profissional.</p>
          <div className="actions">
            {(['client', 'professional'] as Role[])
              .filter((role) => role !== area)
              .map((role) =>
                profile.roles.includes(role) ? (
                  <Link
                    key={role}
                    className="text-link"
                    to={role === 'client' ? '/cliente' : '/profissional'}
                  >
                    Ir para o ambiente {role === 'client' ? 'cliente' : 'profissional'}{' '}
                    <ArrowUpRight size={16} />
                  </Link>
                ) : (
                  <button
                    key={role}
                    disabled={busy}
                    className="button secondary"
                    onClick={() => {
                      void addRole(role)
                    }}
                  >
                    {busy
                      ? 'Aguarde…'
                      : `Também quero ser ${role === 'client' ? 'cliente' : 'profissional'}`}
                  </button>
                ),
              )}
          </div>
        </div>
      )}
      <div className="workspace-support">
        <Support />
      </div>
    </section>
  )
}

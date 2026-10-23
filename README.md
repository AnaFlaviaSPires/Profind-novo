# ProFind · Sprint 1 · v0.1.0

Fundação independente, criada do zero a partir do PRD 3.1 e da solicitação de inicialização de 23/10/2026. Somente a Sprint 1 foi implementada. Publicada e verificada em https://profind-27554.firebaseapp.com. Consulte os [resultados da publicação](docs/PUBLICACAO_VALIDADA.md). A aprovação e a tag de congelamento continuam pendentes.

Página comercial com exatamente sete categorias, cadastro de cliente e profissional, login, logout, recuperação de senha, persistência de sessão e autorização por ambiente. Não há operações de serviços, pagamentos, avaliações ou painéis completos.

Repositório oficial: https://github.com/AnaFlaviaSPires/Profind-novo. Para continuar em outro computador, siga [RETOMADA_EM_OUTRO_COMPUTADOR.md](docs/RETOMADA_EM_OUTRO_COMPUTADOR.md).

## Executar

Pré-requisitos: Node 24 LTS (ambiente validado), npm e Java 21 ou superior para os emuladores. Edge para os testes Playwright (`npx playwright install msedge` se necessário).

```powershell
npm ci
npm run dev
```

Sem configuração Firebase, a página é acessível e os formulários informam a indisponibilidade. Não há autenticação fictícia. Para Firebase real, copie `.env.example` para `.env.local` e preencha os quatro valores públicos do aplicativo Web. Instruções completas em [docs/PUBLICACAO.md](docs/PUBLICACAO.md).

## Testar com Firebase local

Um terminal:

```powershell
npm run emulators
```

Outro terminal:

```powershell
npm run dev:emulator
```

O projeto `demo-profind` é exclusivamente sintético. Dados e contas desaparecem ao encerrar os emuladores; não se conecta à produção. Não mantenha `.env.local` com valores reais ao executar esse modo manualmente; os testes automatizados forçam explicitamente a configuração demo.

```powershell
npm test
npm run test:rules
npm run test:e2e
npm run test:integration
npm run build
```

`test:rules` e `test:integration` iniciam e encerram os emuladores necessários automaticamente. Não execute essas duas suítes ao mesmo tempo, pois usam as mesmas portas. `test:e2e` testa o estado público sem configuração externa.

O Java 21 usado nesta execução foi baixado em `.tools/java21`, ignorado pelo Git, sem alterar o Java 8 do sistema. Para reutilizá-lo neste computador:

```powershell
$taskJava = Get-ChildItem '.tools/java21' -Directory | Select-Object -First 1
$env:PATH = "$($taskJava.FullName)/bin;$env:PATH"
$env:FIREBASE_EMULATORS_PATH = Join-Path (Get-Location) '.tools/firebase-emulators'
```

## Estrutura

```text
src/
  components/    Cabeçalho, navegação, marca provisória e suporte
  contexts/      Sessão Auth e assinatura privada do perfil
  lib/           Firebase, mensagens e validação
  pages/         Página comercial, autenticação e destinos mínimos
  routes/        Rotas públicas e proteções por papel
  services/      Transação de criação e complementação de perfis
  types/         Tipos de identidade e papéis
  index.css      Tailwind e estilos responsivos
tests/
  unit/          Validação de cadastro
  rules/         Permissões adversariais no Firestore Emulator
  browser/       Navegação pública e quatro formatos de tela
  integration/   Fluxos reais do SDK nos emuladores Auth/Firestore
scripts/         Deploy, verificação de URL e autorização admin
.github/workflows/ CI e deploy manual autenticado via OIDC
firestore.rules  Negação por padrão e dados privados
firebase.json    Hosting SPA, regras, índices e emuladores
docs/            Arquitetura, publicação, relatório e evidências
```

Veja [arquitetura](docs/ARQUITETURA.md), [relatório e critérios de aceite](docs/RELATORIO_SPRINT_1.md) e [roteiro de demonstração](docs/DEMONSTRACAO.md). A tag `sprint-1-v0.1.0` não foi criada e depende da aprovação explícita da responsável após o aceite.

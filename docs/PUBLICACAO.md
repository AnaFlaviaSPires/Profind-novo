# Configurar e publicar no Firebase

Situação atual: nenhum projeto Firebase foi informado ou criado. Não há autenticação do Firebase CLI neste ambiente nem URL publicada verificada. Nenhum plano pago foi ativado. Não execute `firebase init` sobre os arquivos existentes: a configuração já está preparada.

## 1. Ações da responsável no console

1. Acesse [Firebase Console](https://console.firebase.google.com/) na conta que será proprietária do projeto.
2. Crie um projeto **novo e exclusivo** para esta versão. Escolha um ID disponível e registre-o. Use o plano gratuito Spark; não vincule faturamento nem ative Blaze. Desative Google Analytics para evitar uma integração não necessária.
3. Em Configurações do projeto → Seus aplicativos, registre um aplicativo **Web**. Copie `apiKey`, `authDomain`, `projectId` e `appId` do `firebaseConfig`. São configurações públicas, não uma conta de serviço.
4. Em Criação/Build → Authentication → Começar → Método de login, ative **E-mail/senha**. Não ative login sem senha ou outros provedores.
5. Em Authentication → Configurações → Política de senha, configure no mínimo 8 caracteres. Ative proteção contra enumeração de e-mails quando disponível. Em Modelos, revise o e-mail de recuperação e mantenha a página de ação hospedada pelo Firebase até existir uma personalizada.
6. Em Firestore Database, crie o banco **Standard**, ID `(default)`, em **modo de produção**, numa região adequada. Para o público inicial, considere `southamerica-east1` se oferecida no plano. A localização é uma escolha persistente: confirme-a no console. Não escolha Enterprise ou modo de teste aberto.
7. Em Hosting, ative o site padrão do projeto, se solicitado. Não habilite App Hosting, Functions, extensões ou serviços pagos.
8. Em Authentication → Configurações → Domínios autorizados, confira `SEU_PROJECT_ID.web.app` e `SEU_PROJECT_ID.firebaseapp.com`. Adicione apenas os domínios efetivamente usados; para desenvolvimento com projeto real, `localhost` pode precisar ser adicionado explicitamente.
9. Informe o WhatsApp oficial em formato internacional, somente dígitos, quando definido. A apresentação tipográfica aguarda a logomarca oficial.

O console pode alterar nomes e posição de menus. Não aceite uma migração de plano para concluir esta sprint; informe qualquer exigência diferente antes de habilitá-la.

## 2. Configuração local e deploy reproduzível

```powershell
Copy-Item .env.example .env.local
```

Preencha em `.env.local` os quatro valores públicos do aplicativo Web. Mantenha `VITE_USE_EMULATORS=false`. Não envie senhas, tokens ou JSON de conta de serviço pelo chat e não os grave no repositório.

```powershell
npm ci
npx firebase login
npx firebase projects:list
npm test
npm run test:rules
npm run test:e2e
npm run test:integration
npm run deploy
node scripts/verify-hosting.mjs
```

O login abre o consentimento Google e exige a participação da proprietária; não é substituído por credenciais inventadas. Testes de regras/integração requerem Java 21 e portas 8080/9099 livres. O script de deploy lê o projeto do ambiente, recusa configuração incompleta, projeto `demo-*` e emuladores, compila e publica **regras, índices e Hosting** explicitamente no projeto indicado. Não habilita Auth nem cria o banco: essas etapas são feitas no console.

A URL padrão esperada será `https://SEU_PROJECT_ID.web.app`; isso é um formato, não uma URL já publicada. O verificador exige resposta HTTP e identidade ProFind em `/`, `/entrar` e `/cliente`. Somente depois de executá-lo e cumprir o roteiro real em produção a publicação pode ser declarada verificada.

## 3. Novo repositório GitHub

O Git local está inicializado em `main`. O repositório remoto permanece pendente; as ferramentas GitHub disponíveis nesta sessão não oferecem criação de repositórios.

Na conta/organização correta, crie um repositório **novo**, preferencialmente privado, sem README, licença ou `.gitignore` automáticos. Escolha um nome que identifique esta versão, sem reutilizar versões anteriores. Depois use a URL exata exibida pelo GitHub:

```powershell
git remote add origin URL_EXATA_DO_NOVO_REPOSITORIO
git push -u origin main
```

O push usa a autenticação GitHub da responsável. Não configure tokens em URLs ou arquivos rastreados. O commit local está indicado no relatório e pode ser conferido por `git log -1 --oneline`.

## 4. Deploy automatizado pelo GitHub

O workflow `ci.yml` valida pushes e pull requests. O workflow `deploy.yml` é disparado manualmente em Actions e usa o environment `production`; não publica qualquer push automaticamente. O envio remoto e a execução no GitHub ainda não foram verificados.

Para habilitar deploy sem chave persistente:

1. Crie o environment `production` no novo repositório, com revisão da responsável e restrição ao branch `main` onde o plano GitHub permitir.
2. Configure uma conta de serviço de deploy no **mesmo projeto**. Conceda somente `roles/firebasehosting.admin`, `roles/firebaserules.admin` e `roles/datastore.indexAdmin`, revisando as permissões necessárias para as operações desta sprint.
3. Configure Workload Identity Federation do GitHub com emissor `https://token.actions.githubusercontent.com`, audiência do provider e condição que restrinja o acesso ao **repositório e proprietário exatos**, preferencialmente também ao environment `production`. Permita que esse principal use a conta de serviço via `roles/iam.workloadIdentityUser`. Não permita todos os repositórios de uma organização indiscriminadamente.
4. Nas variáveis do environment, defina `FIREBASE_WIF_PROVIDER` (nome completo do provider), `FIREBASE_DEPLOY_SERVICE_ACCOUNT` (e-mail da conta), `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID` e, opcionalmente, `VITE_SUPPORT_WHATSAPP`.
5. Em Actions, execute “Publicar no Firebase Hosting” no commit revisado de `main`. O workflow testa, compila, publica e verifica o endereço. Se o console exigir faturamento para alguma habilitação, interrompa essa habilitação e use o deploy local gratuito acima.

Esse fluxo precisa da proprietária/IAM para estabelecer a confiança inicial. Não foi configurado externamente nem executado nesta entrega. Referências: [Google Auth Action e WIF](https://github.com/google-github-actions/auth), [Firebase CLI](https://firebase.google.com/docs/cli), [Firebase Hosting](https://firebase.google.com/docs/hosting).

## 5. Administração segura

Somente um operador confiável com Application Default Credentials e permissão para atualizar usuários Auth pode executar:

```powershell
node scripts/set-admin.mjs SEU_PROJECT_ID UID_EXATO grant
```

Confira o UID no Authentication, nunca por e-mail presumido. Não crie um campo `admin` no Firestore. Para remover, use `revoke`. O script preserva outras claims e revoga refresh tokens; tokens já emitidos podem durar até uma hora. A conta deve entrar novamente para receber claims atualizadas. Credenciais administrativas não pertencem ao frontend nem ao workflow público.

# Continuar o ProFind em outro computador

Repositório oficial: https://github.com/AnaFlaviaSPires/Profind-novo. Branch de desenvolvimento: `main`. O histórico completo da Sprint 1 é preservado; ainda não existe tag de congelamento.

## Instalação e prévia sem dados reais

Instale Git, Node.js 24 LTS e, para os emuladores, Java 21 ou superior. Instale Edge para os testes de navegador ou execute `npx playwright install msedge` após instalar as dependências.

```powershell
git clone https://github.com/AnaFlaviaSPires/Profind-novo.git
cd Profind-novo
npm ci
npm test
npm run build
```

A página pública sem autenticação externa pode ser aberta com `npm run dev`. Para testar também cadastro, login e perfis fictícios, execute em dois terminais:

```powershell
npm run emulators
```

```powershell
npm run dev:emulator
```

O modo `emulator` usa apenas `demo-profind`. Os emuladores permanecem restritos ao computador. Dados temporários não são exportados pelo Git.

## Configuração do projeto Firebase real

```powershell
Copy-Item .env.production.example .env.production.local
```

O exemplo contém somente identificadores e configuração **pública** do aplicativo Web Firebase, já entregue pelo site ao navegador. Não contém conta de serviço, chave privada, token de acesso ou senha de usuário. As permissões são impostas por Firebase Authentication e `firestore.rules`.

`.env.production.local` é ignorado pelo Git e usado no build de produção. Não copie esses valores para `.env.local` ao trabalhar com emuladores, pois esse arquivo genérico também se aplica a outros modos do Vite. O padrão `.env.production.example` permite reconstruir a configuração sem depender do arquivo local antigo.

O projeto de produção é exclusivamente `profind-27554`, conforme `.firebaserc`. A autenticação do Firebase CLI e do GitHub precisa ser refeita pelo operador no novo computador; nenhuma sessão é transportada pelo repositório. Não execute comandos de deploy para simplesmente visualizar ou compilar o código.

O site atual permanece em https://profind-27554.firebaseapp.com. Remover uma cópia local não altera o Firebase Hosting nem os dados armazenados no Firebase. Os usuários e documentos do Firestore ficam no projeto Firebase, não dentro da pasta Git.

## O que foi preservado

- Todos os commits locais anteriores, sem reescrever o histórico.
- Código React/TypeScript, lockfile, testes e regras/índices/configuração Firebase.
- Documentação e capturas da prévia e da versão publicada em `docs/evidencias`.
- Configurações de CI e deploy manual, sem habilitar o deploy pelo push.

`node_modules`, builds, caches, Java baixado localmente, logs, sessões do Firebase CLI e relatórios brutos são ignorados. Dependências e ferramentas são reinstaláveis. As evidências públicas da publicação foram copiadas para a documentação; nenhum token ou senha de teste foi incluído. Os arquivos originais continuam no computador.

## Antes de remover uma cópia local

Confira se `git status --short` está vazio e se o último commit local coincide com `origin/main`. Faça um clone de conferência no computador de destino e execute os comandos de instalação, testes e build acima. Guarde separadamente qualquer material pessoal que tenha acrescentado fora do Git, como documentos, logomarca ou outros arquivos ignorados.

A possibilidade de remoção vale para a cópia de desenvolvimento sincronizada. Nenhuma exclusão é executada por este procedimento, e a remoção não é necessária para continuar o projeto.

# Publicação da Sprint 1 · 23/10/2026

Aplicação publicada e verificada em **https://profind-27554.firebaseapp.com**. Projeto exclusivo de produção: `profind-27554`, registrado em `.firebaserc`. A configuração Web está em `.env.production.local`, ignorada pelo Git; emuladores desabilitados em produção. A prévia local continua usando `demo-profind`, sem alteração de arquitetura.

O domínio padrão `https://profind-27554.web.app` foi informado pelo deploy, mas retornou a página de bloqueio da rede da organização neste computador. O domínio oficial `firebaseapp.com` do mesmo Hosting foi acessado e testado. Não foi alterada nenhuma política de rede. A responsável solicitou não prosseguir com assuntos de TI; nenhuma ação com TI será realizada.

## Execução e resultados

1. Confirmados acesso ao projeto, ID do aplicativo, domínio Auth e configuração de produção.
2. Revisadas as regras de esquema fechado, propriedade por UID, papéis permitidos, timestamps e perfil profissional bloqueado. Os oito testes de regras passaram antes da publicação.
3. Publicadas regras e configuração de índices no banco `(default)`. Compilação das regras validada pelo Firebase. Não foram necessários índices compostos.
4. Aprovados novamente seis testes unitários, seis testes de navegação/responsividade e sete testes integrados com Auth/Firestore Emulator: **27 testes aprovados**, incluindo os oito testes de regras.
5. Build TypeScript/Vite aprovado. Mantido o aviso conhecido de bundle acima de 500 kB; sem erros de compilação.
6. Publicado o build no Hosting de `profind-27554` com sucesso.
7. Verificadas respostas HTTPS 200 e fallback SPA de `/`, `/entrar`, `/cadastrar`, `/recuperar-senha`, `/cliente`, `/profissional` e `/admin`, com cabeçalhos de segurança.
8. No Edge, verificados sete serviços, larguras 320/390/768/1440 sem overflow, bloqueio de visitantes em rotas privadas e ausência de chamadas aos emuladores na página publicada.
9. Criadas duas contas estritamente fictícias no Authentication real. Ambos os perfis foram persistidos e lidos no Firestore real com o token do próprio usuário. Cadastro, login, logout e sessão após recarregar a página funcionaram para cliente e profissional.
10. Perfil profissional confirmado com `status: DRAFT` e `available: false`. Contas comuns tiveram acesso administrativo bloqueado.
11. Nas APIs reais, leitura cruzada entre as contas, leitura anônima, listagem de usuários e tentativa de autoatribuir papel admin retornaram **HTTP 403**, conforme esperado.
12. A solicitação de recuperação pelo formulário publicado foi aceita pelo Firebase Authentication real com **HTTP 200**, seguida da confirmação na interface.

## Limite da verificação de recuperação

A responsável informou não possuir caixa de e-mail exclusiva de teste. Portanto, **não foram verificados recebimento do e-mail real nem consumo do link**. O fluxo completo de alteração de senha foi validado anteriormente nos emuladores. Esse limite não é apresentado como teste completo de entrega de e-mail em produção.

## Contas fictícias mantidas para evidência

| Perfil | E-mail de teste | UID |
| --- | --- | --- |
| Cliente | `profind-sprint1-client-1792758967072@example.invalid` | `6XGFKV05NJNPz6Q3JzfEBc4UQlg2` |
| Profissional | `profind-sprint1-professional-1792758967072@example.invalid` | `RF358vFkFBRnBLJdMe686Q7928r2` |

Esses endereços usam domínio reservado sem caixa real. As senhas aleatórias existiram somente em memória durante os testes; não foram registradas. Nenhuma conta administrativa foi criada. Os registros fictícios foram mantidos no console para conferência; nenhum dado real foi usado. Evidências locais da execução ficam em `.tools/production-verification.json` e `.tools/production-evidence/`, ignoradas pelo Git.

## Situação de aceite e versionamento

Publicação e fluxos principais verificados no Firebase real. Continuam pendentes a análise da responsável, a confirmação de recebimento/consumo de e-mail real, o número oficial de suporte e a logomarca. GitHub remoto e automação de deploy não foram configurados nesta publicação. O relatório da primeira execução permanece como registro histórico; este documento atualiza a situação online.

**Nenhuma tag de congelamento foi criada. Nenhuma funcionalidade da Sprint 2 foi implementada.** A aplicação publicada corresponde ao código da implementação `5aaa408` com as variáveis reais de produção; o commit documental `144cb26` precedeu esta publicação. A vinculação do projeto e este registro são versionados em commit posterior.

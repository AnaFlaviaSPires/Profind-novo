export function friendlyError(error: unknown): string {
  const code = (error as { code?: string })?.code
  const messages: Record<string, string> = {
    'auth/invalid-credential': 'E-mail ou senha incorretos. Confira seus dados.',
    'auth/user-not-found': 'E-mail ou senha incorretos. Confira seus dados.',
    'auth/wrong-password': 'E-mail ou senha incorretos. Confira seus dados.',
    'auth/email-already-in-use': 'Este e-mail já possui uma conta. Entre para continuar.',
    'auth/weak-password': 'Use uma senha mais forte, com pelo menos 8 caracteres.',
    'auth/password-does-not-meet-requirements':
      'A senha não atende à política de segurança deste projeto.',
    'auth/invalid-email': 'Informe um e-mail válido.',
    'auth/too-many-requests': 'Muitas tentativas. Aguarde um pouco e tente novamente.',
    'auth/network-request-failed':
      'Não foi possível conectar. Verifique sua internet e tente novamente.',
    'auth/user-disabled': 'Esta conta está desativada. Procure o suporte.',
    'permission-denied':
      'Não foi possível acessar seu perfil. Verifique a configuração e as permissões do Firebase.',
    unavailable: 'O serviço está indisponível. Verifique sua conexão e tente novamente.',
  }
  return (code && messages[code]) || 'Não foi possível concluir. Tente novamente em instantes.'
}

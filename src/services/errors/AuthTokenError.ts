// Classe que estende o erro padrao
export class AuthTokenError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    // Chamada da classe pai
    // Seria como se chamasse ex: Error('Error with authentication token')
    super(message ?? "Error with authentication token", options);
  }
}

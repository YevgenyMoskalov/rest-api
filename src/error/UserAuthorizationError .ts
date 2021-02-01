class UserAuthorizationError extends Error {
  constructor(message: string) {
    super();
    this.message = message;
    this.name = 'USER_AUTHORIZATION_ERROR';
  }
}

export default UserAuthorizationError;

class UserNotFoundError extends Error {
  constructor(message: string) {
    super();
    this.message = message;
    this.name = 'USER_NOT_FOUND_ERROR';
  }
}

export default UserNotFoundError;

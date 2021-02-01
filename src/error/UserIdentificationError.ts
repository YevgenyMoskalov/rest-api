class UserIdentificationError extends Error {
  constructor(message: string) {
    super();
    this.message = message;
    this.name = 'USER_IDENTIFICATION_ERROR';
  }
}

export default UserIdentificationError;

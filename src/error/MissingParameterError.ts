class MissingParameterError extends Error {
  constructor(message: string) {
    super();
    this.message = message;
    this.name = 'MISSING_PARAMETER_ERROR';
  }
}

export default MissingParameterError;

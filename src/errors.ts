export class MintIdError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MintIdError';
  }
}

export class UnknownTokenizerError extends MintIdError {
  readonly tokenizer: string;

  constructor(tokenizer: string, valid: string[]) {
    super(`Unknown tokenizer: "${tokenizer}". Valid tokenizers: ${valid.join(', ')}`);
    this.name = 'UnknownTokenizerError';
    this.tokenizer = tokenizer;
  }
}

export class UnknownModelError extends MintIdError {
  readonly model: string;

  constructor(model: string) {
    super(`Unknown model: "${model}". See metadata.json for supported models.`);
    this.name = 'UnknownModelError';
    this.model = model;
  }
}

export class EmptyWordlistError extends MintIdError {
  constructor() {
    super('Cannot generate ID from empty wordlist');
    this.name = 'EmptyWordlistError';
  }
}

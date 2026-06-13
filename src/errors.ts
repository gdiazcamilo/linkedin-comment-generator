export class RuntimeLastError {
  readonly message: string;

  constructor(error: chrome.runtime.LastError | undefined) {
    this.message = error?.message || 'An unknown runtime error occurred';
  }

  static fromRuntime(): RuntimeLastError | null {
    const error = chrome.runtime.lastError;
    return error ? new RuntimeLastError(error) : null;
  }

  toString(): string {
    return this.message;
  }
}

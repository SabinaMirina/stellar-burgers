class LocalStorageMock {
  private store: Record<string, string> = {};

  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string) {
    this.store[key] = value.toString();
  }

  removeItem(key: string) {
    delete this.store[key];
  }
}

// Attach the mock to the global object
global.localStorage = new LocalStorageMock() as unknown as Storage;

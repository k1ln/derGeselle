export class OllamaService {
  private baseUrl: string = 'http://localhost:11434';
  private model: string = 'phi4-mini';
  private isAvailable: boolean = false;

  async initialize(): Promise<boolean> {
    try {
      // Check if Ollama is running
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) {
        console.warn('Ollama is not running');
        return false;
      }

      const data = await response.json();
      const hasPhi4 = data.models?.some((m: any) => m.name.includes('phi4-mini'));
      
      if (!hasPhi4) {
        console.warn('Phi-4 Mini model not found. Please run: ollama pull phi4-mini');
        return false;
      }

      this.isAvailable = true;
      console.log('✓ Phi-4 Mini AI connected');
      return true;
    } catch (error) {
      console.warn('Ollama not available:', error);
      return false;
    }
  }

  isReady(): boolean {
    return this.isAvailable;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  getModel(): string {
    return this.model;
  }
}

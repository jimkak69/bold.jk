export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface WebsiteProject {
  id: string;
  name: string;
  chatHistory: Message[];
  generatedCode: string | null;
}

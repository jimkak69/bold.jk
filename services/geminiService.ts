
import type { Message } from '../types';

export const getApiKey = (): string => {
  // Hardcoded API key as requested.
  return 'REPLACE_WITH_API_KEY';
};


const SYSTEM_INSTRUCTION = `You are an expert frontend developer specializing in Tailwind CSS.
Your task is to generate and iteratively refine a single, self-contained HTML file based on a conversation with a user.

**Conversation History:**
- User messages contain instructions for creating or modifying the website.
- Your previous responses (as the 'assistant') contain the full HTML code of the website at that point in the conversation.

**Requirements:**
1.  **Single File:** The output must be a single HTML file.
2.  **Tailwind CSS:** Use Tailwind CSS for all styling. Include the official Tailwind CDN script in the <head> section: \`<script src="https://cdn.tailwindcss.com"></script>\`.
3.  **Iterative Refinement:** When the user provides a new prompt, you MUST modify the HTML from your IMMEDIATELY PRECEDING response in the history to incorporate the new request. Your output should always be the complete, updated HTML file.
4.  **Content:** Use placeholder images from \`https://picsum.photos/width/height\` if images are needed. For example: \`<img src="https://picsum.photos/800/600" alt="placeholder">\`.
5.  **Responsiveness:** The layout must be responsive and look good on all screen sizes.
6.  **Code Only:** Your response must ONLY be the raw HTML code for the website. Do not include any explanations, comments, or markdown formatting like \`\`\`html ... \`\`\`. Your response must start with \`<!DOCTYPE html>\` and end with \`</html>\`.`;

const PROMPT_ENHANCEMENT_SYSTEM_INSTRUCTION = `You are an expert prompt engineer.
Your task is to take a user's request for a website and expand it into a more detailed and descriptive prompt.
This enhanced prompt will be used by another AI to generate HTML code.
Focus on adding specific details about layout, color schemes, content sections, and functionality.
For example, if the user says "a portfolio for a photographer", you could expand it to:
"Create a modern and elegant portfolio website for a photographer named 'Alex Doe'. The site should have a dark theme with a charcoal background (#1A1A1A) and white/light-gray text. It needs a sticky navigation bar with links to 'Home', 'Gallery', 'About', and 'Contact'. The 'Home' page should feature a full-screen hero image with the photographer's name in a bold, stylish font. The 'Gallery' section must be a responsive grid of images that opens a lightbox when an image is clicked. The 'About' page should have a photo of the photographer and a short biography. The 'Contact' page needs a simple form with fields for Name, Email, and Message, plus social media links."

IMPORTANT: ONLY return the enhanced prompt text. Do not include any other explanations, markdown, or introductory phrases like "Here is the enhanced prompt:".
`;

export const generateWebsiteCode = async (chatHistory: Message[]): Promise<string> => {
  const apiKey = getApiKey();
  
  const messages = [
    { role: 'system', content: SYSTEM_INSTRUCTION },
    ...chatHistory.map(msg => ({ role: msg.role, content: msg.content }))
  ];

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://bolt.jk',
            'X-Title': 'bolt.jk',
        },
        body: JSON.stringify({
            model: 'qwen/qwen3-coder:free',
            messages: messages,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
             throw new Error("The hardcoded OpenRouter API key ('apple') is invalid or has expired.");
        }
        const errorMessage = errorData?.error?.message || `API request failed with status ${response.status}`;
        throw new Error(errorMessage);
    }
    
    const data = await response.json();
    const code = data.choices[0]?.message?.content;

    if (!code) {
        throw new Error("Received an empty response from the AI.");
    }

    const cleanedCode = code.replace(/^```html\s*/, '').replace(/\s*```$/, '').trim();

    if (!cleanedCode.startsWith('<!DOCTYPE html>')) {
        console.warn("Generated code doesn't start with <!DOCTYPE html>. This might indicate an issue with the AI's response format.");
    }
    
    return cleanedCode;

  } catch (error) {
    console.error("Error generating website code with OpenRouter:", error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error("Failed to communicate with the AI. Please check your network or API key and try again.");
  }
};

export const enhancePrompt = async (userPrompt: string): Promise<string> => {
  const apiKey = getApiKey();
  
  const messages = [
    { role: 'system', content: PROMPT_ENHANCEMENT_SYSTEM_INSTRUCTION },
    { role: 'user', content: userPrompt }
  ];

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://bolt.jk',
          'X-Title': 'bolt.jk',
        },
        body: JSON.stringify({
          model: 'qwen/qwen3-coder:free',
          messages: messages,
        }),
      });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
             throw new Error("The hardcoded OpenRouter API key ('apple') is invalid or has expired.");
        }
        const errorMessage = errorData?.error?.message || `API request failed with status ${response.status}`;
        throw new Error(errorMessage);
    }

    const data = await response.json();
    const enhancedPrompt = data.choices[0]?.message?.content;

    if (!enhancedPrompt) {
        throw new Error("Received an empty response from the AI for prompt enhancement.");
    }

    return enhancedPrompt.trim();

  } catch (error) {
    console.error("Error enhancing prompt with OpenRouter:", error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error("Failed to communicate with the AI for prompt enhancement.");
  }
};

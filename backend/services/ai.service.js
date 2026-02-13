/**
 * AI Service - Placeholder for LLM API integration
 *
 * This service should be configured with your preferred LLM provider:
 * - OpenAI (GPT-4, GPT-4 Vision)
 * - Anthropic (Claude with vision)
 * - Google (Gemini)
 * - etc.
 *
 * For now, this is a mock implementation that demonstrates the streaming interface.
 */

// Mock streaming response for demonstration
export async function* streamChatCompletion(messages, images = []) {
  // In a real implementation, you would:
  // 1. Format messages for your LLM API
  // 2. Include images if the model supports vision
  // 3. Stream the response token by token

  const mockResponse = images.length > 0
    ? "I can see the image(s) you've shared. This is a mock response. Please integrate with a real vision-capable LLM API like GPT-4 Vision or Claude."
    : "This is a mock streaming response. Please integrate with a real LLM API (OpenAI, Anthropic, etc.) to get actual AI responses.";

  const words = mockResponse.split(" ");

  for (const word of words) {
    yield word + " ";
    // Simulate streaming delay
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}

/**
 * Example OpenAI integration (commented out):
 *
 * import OpenAI from 'openai';
 *
 * const openai = new OpenAI({
 *   apiKey: process.env.OPENAI_API_KEY,
 * });
 *
 * export async function* streamChatCompletion(messages, images = []) {
 *   const formattedMessages = messages.map(msg => ({
 *     role: msg.role,
 *     content: msg.content,
 *   }));
 *
 *   // Add images to the last user message if vision is needed
 *   if (images.length > 0) {
 *     const lastUserMsgIndex = formattedMessages.findLastIndex(m => m.role === 'user');
 *     if (lastUserMsgIndex !== -1) {
 *       formattedMessages[lastUserMsgIndex].content = [
 *         { type: 'text', text: formattedMessages[lastUserMsgIndex].content },
 *         ...images.map(img => ({
 *           type: 'image_url',
 *           image_url: { url: img.url }
 *         }))
 *       ];
 *     }
 *   }
 *
 *   const stream = await openai.chat.completions.create({
 *     model: images.length > 0 ? 'gpt-4-vision-preview' : 'gpt-4-turbo-preview',
 *     messages: formattedMessages,
 *     stream: true,
 *   });
 *
 *   for await (const chunk of stream) {
 *     const content = chunk.choices[0]?.delta?.content;
 *     if (content) {
 *       yield content;
 *     }
 *   }
 * }
 */

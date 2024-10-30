export function extractKeywords(
  title: string,
  content: string,
  tags: string[],
  input: string
): string[] {
  // Convert tags array to a single string for easy processing
  const tagsText = tags.join(" ");

  // Helper to extract single words and convert to lowercase
  const extractWords = (text: string) => {
    return new Set(text.toLowerCase().match(/\b\w+\b/g) || []);
  };

  // Get word sets from each input
  const titleWords = extractWords(title);
  const contentWords = extractWords(content);
  const tagsWords = extractWords(tagsText);
  const inputWords = extractWords(input);

  // Find common words
  const commonWords = new Set<string>();
  for (let word of titleWords) {
    if (contentWords.has(word) || tagsWords.has(word) || inputWords.has(word)) {
      commonWords.add(word);
    }
  }
  for (let word of contentWords) {
    if (tagsWords.has(word) || inputWords.has(word)) {
      commonWords.add(word);
    }
  }

  // Convert Set to array for output
  return Array.from(commonWords);
}

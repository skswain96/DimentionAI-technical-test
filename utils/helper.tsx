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

export function removeIcons(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(removeIcons);
  } else if (typeof obj === "object" && obj !== null) {
    const { icon, ...rest } = obj; // Destructure to exclude 'icon'
    return Object.fromEntries(
      Object.entries(rest).map(([key, value]): any => [key, removeIcons(value)])
    );
  }
  return obj;
}

export function getPayload(obj: any) {
  // Create a shallow copy of the object to avoid mutating the original
  const newObj: any = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    // If the current key is "icon", skip it
    if (key === "icon") continue;

    // If the value is an object or array, call the function recursively
    if (typeof obj[key] === "object" && obj[key] !== null) {
      // If the value is an array, filter out objects with key = 'none'
      if (Array.isArray(obj[key])) {
        const filteredArray = obj[key].filter(
          (item: any) => item.key !== "none"
        );

        // Set to null if the filtered array is empty
        newObj[key] = filteredArray.length > 0 ? filteredArray : null;
      } else {
        // Recursively get the payload for non-array objects
        const nestedPayload = getPayload(obj[key]);

        // Only add to newObj if the nested payload is not empty
        if (Object.keys(nestedPayload).length > 0) {
          newObj[key] = nestedPayload;
        }
      }
    } else {
      // Directly copy the value
      newObj[key] = obj[key];
    }
  }

  return newObj;
}

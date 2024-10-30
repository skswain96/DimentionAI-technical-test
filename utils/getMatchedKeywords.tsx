import OpenAIApi from "openai";

// Define your OpenAI API Key
const apiKey: any = process.env.OPENAI_API_KEY;

export async function getMatchedKeywords(
  issueTitle: any,
  issueContent: any,
  tags: any,
  otherInputString: any
) {
  const openai = new OpenAIApi(apiKey);

  // Prepare prompt
  const prompt = `
    Check for common single keywords between the following:
    - Title: ${issueTitle}
    - Content: ${issueContent}
    - Tags: ${tags.join(", ")}
    - Input: ${otherInputString}
    Return only single matched words as an array which is relevant to be used as tags for a new task.
  `;

  console.log("here prompt", prompt);

  try {
    const response: any = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4",
      max_tokens: 50,
    });

    const responseText = response.choices[0].message.content;

    const matchedWords = responseText.match(/\[(.*?)\]/);

    if (matchedWords && matchedWords[1]) {
      // Convert the string to an array
      return JSON.parse(`[${matchedWords[1]}]`); // This will parse it as an array
    }
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    return [];
  }
}

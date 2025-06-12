// This function uses Gemini API to generate content
export async function generateWithGemini(prompt: string) {
  const API_KEY = "AIzaSyBtgRmkYVpxsCuSpYdYbHJATwAy82Yt1Ds"

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      },
    )

    const data = await response.json()

    if (data.error) {
      console.error("Gemini API Error:", data.error)
      throw new Error(data.error.message)
    }

    let text = data.candidates[0].content.parts[0].text

    // Clean up the response if it contains markdown code blocks
    if (text.includes("```")) {
      // Extract content between code blocks
      const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (codeBlockMatch && codeBlockMatch[1]) {
        text = codeBlockMatch[1].trim()
      } else {
        // If we can't extract from code blocks, just remove the markdown markers
        text = text
          .replace(/```json\s*/g, "")
          .replace(/```\s*$/g, "")
          .trim()
      }
    }

    return text
  } catch (error) {
    console.error("Error using Gemini API:", error)
    throw error
  }
}

// Helper function to safely parse JSON with fallback
export function safeJsonParse(jsonString: string, fallback: any) {
  try {
    return JSON.parse(jsonString)
  } catch (error) {
    console.error("JSON parsing error:", error)
    console.error("Problematic JSON string:", jsonString)
    return fallback
  }
}

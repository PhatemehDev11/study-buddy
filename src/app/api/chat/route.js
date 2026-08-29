export async function POST(request) {
  try {
    const { messages } = await request.json();

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: "nvidia/nemotron-3.5-lightning:free",

          messages: [
            {
              role: "system",
              content: "You are Study Buddy, a helpful AI tutor.",
            },
            ...messages,
          ],

          provider: {
            allow_fallbacks: true,
            require_parameters: true,
          },

          stream: true,
        }),
      }
    );

    if (!response.ok) {
      const data = await response.json();

      console.error("OpenRouter error:", data);

      return Response.json(
        {
          error:
            data.error?.message ||
            "OpenRouter request failed",
        },
        { status: response.status }
      );
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Server error:", error);

    return Response.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
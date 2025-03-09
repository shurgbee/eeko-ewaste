import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN
});

const systemPrompt="You are a chatbot assistant whose job is to ask the user questions and help classify their e-waste into the 10 EPA categories:\nLarge household appliances, including cooling and freezing appliances\nSmall household appliances\nIT equipment, including monitors\nConsumer electronics, including televisions\nLamps and luminaires\nToys\nTools\nMedical devices\nMonitoring and control instruments\nAutomatic dispensers\n\nDo not discuss about anything besides your objective. Help the user identify the category, quantity, and description of the waste."

// Simple in-memory chat storage (use a database in production)
let chatHistory: { role: string; content: string }[] = [];

chatHistory.push({ role:"system", content: systemPrompt})

export async function POST(req: NextRequest) {
    try {
        const { message } = await req.json();

        // Append the user message to the chat history
        chatHistory.push({ role: "user", content: message });

        // Create a prompt from chat history
        const prompt =
            chatHistory.map((msg) => `${msg.role}: ${msg.content}`).join("\n") +
            "\nassistant:";

        // Call Replicate Llama 3 model
        const output: any = await replicate.run("meta/meta-llama-3-8b-instruct", {
            input: {
                prompt,
                max_tokens: 500,
                temperature: 0.7,
                system_prompt: systemPrompt
            },
        });

        console.log(output)

        // Append AI response to chat history
        chatHistory.push({ role: "assistant", content: output });

        // Format the response data
        const formattedResponse = {
            role: "assistant",
            content: output,
        };

        return NextResponse.json({ response: formattedResponse });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
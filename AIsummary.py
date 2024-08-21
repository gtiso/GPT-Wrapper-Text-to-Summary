# Low temperature ==> factual and consistent output

import openai
import os

openai.api_key = os.getenv("OPENAI_API_KEY")

def summarize_text(text):
    response = openai.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that summarizes text."},
            {"role": "user", "content": f"Please summarize the following text:\n{text}"}
        ],
        max_tokens=150,  
        temperature=0.5  
    )

    summary = response.choices[0].message.content.strip()
    return summary

def chat_about_summary(summary):
    conversation = [
        {"role": "system", "content": "You are a helpful assistant that discusses text summaries with the user."},
        {"role": "user", "content": f"Here's a summary of the text: {summary}"}
    ]

    print(f"\nSummary: {summary}")
    print("\nLet's discuss the summary. Ask me anything or provide your thoughts!\n")

    while True:
        user_input = input("You: ")
        if user_input.lower() in ["exit", "quit", "stop"]:
            print("Chatbot: It was nice discussing with you! Goodbye!")
            break

        conversation.append({"role": "user", "content": user_input})
        
        response = openai.chat.completions.create(
            model="gpt-4",
            messages=conversation,
            max_tokens=150,
            temperature=0.7
        )

        bot_reply = response.choices[0].message.content.strip()
        print(f"Chatbot: {bot_reply}")
        
        conversation.append({"role": "assistant", "content": bot_reply})

if __name__ == "__main__":
    input_text = input("Text to Summarize: ")
    summary = summarize_text(input_text)
    chat_about_summary(summary)

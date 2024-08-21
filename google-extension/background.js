const apiKey = '#API KEY#';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'summarize') {
        fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [
                    { "role": "system", "content": "You are a helpful assistant that summarizes text." },
                    { "role": "user", "content": `Please summarize the following text:\n${message.text}` }
                ],
                max_tokens: 150,
                temperature: 0.5
            })
        })
        .then(response => response.json())
        .then(data => {
            sendResponse({ summary: data.choices[0].message.content });
        })
        .catch(error => {
            console.error('Error:', error);
            sendResponse({ summary: 'An error occurred while summarizing the text.' });
        });
        return true;  
    }
});

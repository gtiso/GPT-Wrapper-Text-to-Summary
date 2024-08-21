document.getElementById('summarizeButton').addEventListener('click', () => {
    const inputText = document.getElementById('inputText').value;
    if (!inputText) return alert('Please enter text to summarize.');
  
    chrome.runtime.sendMessage({ action: 'getApiKey' }, async (apiKey) => {
      if (!apiKey) return alert('Please set your OpenAI API key.');
  
      const summary = await summarizeText(inputText, apiKey);
      document.getElementById('summaryText').textContent = summary;
      startChat(summary, apiKey);
    });
  });
  
  document.getElementById('saveApiKeyButton').addEventListener('click', () => {
    const apiKey = document.getElementById('apiKeyInput').value;
    chrome.runtime.sendMessage({ action: 'setApiKey', apiKey }, (response) => {
      if (response.status === 'success') alert('API Key saved successfully.');
    });
  });
  
  async function summarizeText(text, apiKey) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a helpful assistant that summarizes text." },
          { role: "user", content: `Please summarize the following text:\n${text}` }
        ],
        max_tokens: 150,
        temperature: 0.5
      })
    });
  
    const data = await response.json();
    return data.choices[0].message.content.trim();
  }
  
  function startChat(summary, apiKey) {
    const chatBox = document.getElementById('chatBox');
    chatBox.style.display = 'block';
  
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = `<p>Summary: ${summary}</p>`;
  
    document.getElementById('sendMessageButton').addEventListener('click', async () => {
      const userMessage = document.getElementById('userMessage').value;
      if (!userMessage) return alert('Please enter a message.');
  
      chatMessages.innerHTML += `<p>You: ${userMessage}</p>`;
  
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            { role: "system", content: "You are a helpful assistant that discusses text summaries with the user." },
            { role: "user", content: `Here's a summary of the text: ${summary}` },
            { role: "user", content: userMessage }
          ],
          max_tokens: 150,
          temperature: 0.7
        })
      });
  
      const data = await response.json();
      const botReply = data.choices[0].message.content.trim();
      chatMessages.innerHTML += `<p>Chatbot: ${botReply}</p>`;
    });
  }
  
document.getElementById('summarizeButton').addEventListener('click', () => {
    const inputText = document.getElementById('inputText').value;
    browser.runtime.sendMessage({ action: 'summarize', text: inputText }, (response) => {
        document.getElementById('summary').innerText = response.summary;
    });
});

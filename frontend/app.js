document.getElementById('sendButton').addEventListener('click', async function() {
    const input = document.getElementById('commentInput');
    const message = input.value.trim();

    if (message === "") return;

    const chatBox = document.getElementById('chatBox');

    // user's message
    const newMsg = document.createElement('div');
    newMsg.classList.add('message');
    newMsg.innerHTML = `<span class="username">You:</span> ${message}`;
    chatBox.appendChild(newMsg);
    chatBox.scrollTop = chatBox.scrollHeight;

    const loadingMsg = document.createElement('div');
    loadingMsg.classList.add('message');
    loadingMsg.innerHTML = `<span class="username">Prediction:</span>  Analyzing...`;
    chatBox.appendChild(loadingMsg);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch('http://localhost:3000/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ comment: message })
        });

        const data = await response.json();

        chatBox.removeChild(loadingMsg);


        let toxicLabels = Object.entries(data)
            .filter(([label, isToxic]) => isToxic)
            .map(([label]) => ` Warning : ${label}`)
            .join(', ');

        const predictionMessage = toxicLabels || '✅ Not Toxic';

        const predictionMsg = document.createElement('div');
        predictionMsg.classList.add('message');
        predictionMsg.innerHTML = `<span class="username">Prediction:</span> ${predictionMessage}`;
        chatBox.appendChild(predictionMsg);
        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {
        console.error(error);

        loadingMsg.innerHTML = `<span class="username">Prediction:</span>  Server Error. Please try again.`;
    }

    input.value = ''; 
});

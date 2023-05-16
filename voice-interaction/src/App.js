import React, { useState } from 'react';
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);


function App() {
  const [responseText, setResponseText] = useState('');

  const handleSpeechRecognition = async () => {
    const recognition = new window.webkitSpeechRecognition();
  
    recognition.lang = 'pt-BR';
    recognition.start();
  
    recognition.onresult = async function (event) {
      const result = event.results[0][0].transcript;
  
      try {
        const response = await openai.complete({
          engine: 'text-davinci-003',
          prompt: result,
          maxTokens: 50,
          temperature: 0.6
        });
  
        const answer = response.data.choices[0].text.trim();
        setResponseText(answer);
        speakText(answer);
      } catch (error) {
        console.error('Erro na solicitação OpenAI:', error);
      }
    };
  
    recognition.onerror = function (event) {
      console.error('Erro no reconhecimento de fala:', event.error);
    };
  };

  const speakText = (text) => {
    const synthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synthesis.speak(utterance);
  };

  return (
    <div className="App">
      <h1>Voice Interaction</h1>
      <button onClick={handleSpeechRecognition}>Fale uma pergunta</button>
      <p>{responseText}</p>
    </div>
  );
}

export default App;

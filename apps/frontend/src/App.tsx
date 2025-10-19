import React, { useState } from 'react'
import './App.css'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'

function App() {
  const { messages, sendMessage } = useChat({
    transport : new DefaultChatTransport({
      api: "http://localhost:3333/ai/chat"
    })
  })
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(input.trim()){
      sendMessage({ text: input});
      setInput("");
    }
  }


  return (
    <>
      <div>
        <h1>AjudAI</h1>
      </div>
      <div className="conversation" style={{
        display: 'flex',
        flexDirection: 'column',
        height: '60vh',
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: '#f5f5f5'}}
      >
        <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {messages.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: '#666',
            marginTop: '40px'
          }}>
            <p>Nenhuma mensagem ainda. Comece a conversar!</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              <div style={{
                maxWidth: '70%',
                padding: '12px 16px',
                borderRadius: '12px',
                backgroundColor: message.role === 'user' ? '#2563eb' : 'white',
                color: message.role === 'user' ? 'white' : '#333',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                wordWrap: 'break-word'
              }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 'bold',
                  marginBottom: '4px',
                  opacity: 0.8
                }}>
                  {message.role === 'user' ? 'Você' : 'IA'}
                </div>
                <div style={{ fontSize: '15px', lineHeight: '1.5' }}>
                  {message.parts.map((part, partIndex) => {
                    if (part.type === 'text') {
                      return <span key={partIndex}>{part.text}</span>;
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>
          ))
        )}

      </div>

      </div>
      <div style={{
        padding: '20px',
        backgroundColor: 'white',
        borderTop: '1px solid #ddd',
        boxShadow: '0 -2px 4px rgba(0,0,0,0.05)'
      }}>
        <div className='inputArea' style={{ display: 'flex', gap: '10px' }}>
          <input className='inputArea-text' type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Digite sua mensagem..." style={{
                flex: 1,
                padding: '12px 16px',
                fontSize: '15px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}/>
          <button onClick={handleSubmit} disabled={!input.trim()}>enviar</button>
        </div>
      </div>
      
    </>
  )
}

export default App

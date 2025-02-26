import React, { useState } from 'react';
import axios from 'axios';
import './index.css';

const EmailCollector = () => {
  const [email, setEmail] = useState('');
  const [selectedInterest, setSelectedInterest] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedInterest) {
      setMessage('⚠️ Seleziona un interesse prima di iscriverti.');
      return;
    }
    setIsLoading(true);
    setMessage('');
    try {
      const response = await axios.post('http://localhost:5000/api/subscribe', {
        email,
        selectedInterest
      });
      console.log("Response:", response.data);
      setMessage('Controlla la tua email per scaricare la risorsa gratuita!');
      setIsSubmitted(true);
    } catch (error) {
      console.error('Errore nell\'invio dei dati:', error);
      setMessage('❌ Errore nell\'invio dei dati. Riprova più tardi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    window.open('http://localhost:5000/api/download/success', '_blank');
  };

  return (
    <div className="landing-container">
      <div className="animated-gradient"></div>
      <div className="background-image"></div>
      <div className="form-card">
        <h2 className="title">Ottieni la tua risorsa gratuita!</h2>
        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <input 
              type="email" 
              placeholder="Inserisci la tua email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
            <select 
              value={selectedInterest}
              onChange={(e) => setSelectedInterest(e.target.value)}
              required
              className="dropdown-styled"
            >
              <option value="" disabled>Seleziona un interesse</option>
              <option value="tecnologia">Tecnologia</option>
              <option value="finanza">Finanza</option>
              <option value="sport">Sport</option>
            </select>
            <button 
              type="submit"
              disabled={isLoading}
              className="submit-button"
            >
              {isLoading ? 'Invio...' : 'Invia'}
            </button>
          </form>
        ) : (
          <div>
            <p className="success-message">{message}</p>
            <button 
              onClick={handleDownload} 
              className="submit-button downloadButton"
            >
              Scarica la risorsa
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailCollector;

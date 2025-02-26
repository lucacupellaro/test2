// Import dei Moduli
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Inizializzazione dell'App Express
const app = express();
app.use(cors({
    origin: 'http://localhost:3000', // Consenti solo richieste dal frontend React
    methods: ['GET', 'POST']
}));
app.use(express.json());

// Connessione a MongoDB
(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connesso a MongoDB');
    } catch (err) {
        console.error('Errore di connessione a MongoDB:', err);
        process.exit(1); // Termina il server in caso di errore di connessione
    }
})();

// Modello Email e Interesse
const EmailSchema = new mongoose.Schema({
    email: { type: String, required: true },
    interest: { type: String, required: true }
});
const Email = mongoose.model('Email', EmailSchema);

// API per salvare email e interesse
app.post('/api/subscribe', async (req, res) => {
    const { email, selectedInterest } = req.body;
    try {
        const newEmail = new Email({ email, interest: selectedInterest });
        await newEmail.save();
        res.status(200).json({ message: 'Email salvata con successo' });
    } catch (error) {
        console.error('Errore nel salvataggio:', error);
        res.status(500).json({ message: 'Errore del server' });
    }
});

// API per il download del file "fonte.pdf"
app.get('/api/download/success', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'downloads', 'fonte.pdf');
    console.log('Percorso del file:', filePath);

    if (!fs.existsSync(filePath)) {
        console.error('File non trovato al percorso:', filePath);
        return res.status(404).json({ message: 'File non trovato' });
    }

    // Imposta l'intestazione per il download
    res.setHeader('Content-Disposition', 'attachment; filename="fonte.pdf"');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Errore nell\'invio del file:', err.message);
            res.status(500).json({ message: 'Errore nell\'invio del file', error: err.message });
        }
    });
});

// Middleware per file statici
app.use('/public', express.static(path.join(__dirname, 'public')));

// Gestore di Errori Globale
app.use((err, req, res, next) => {
    console.error('Errore non gestito:', err);
    res.status(500).json({ message: 'Si è verificato un errore imprevisto' });
});

// Avvio del Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server avviato su porta ${PORT}`));

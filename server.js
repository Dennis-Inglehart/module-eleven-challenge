const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
const dbFilePath = path.join(__dirname, 'db', 'db.json');
const readDataFromFile = () => {const data = fs.readFileSync(dbFilePath, 'utf8');return JSON.parse(data);};
const writeDataToFile = (data) => {fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));};

// assigns an integer value to the "id" key of a new note; called by app.post('/api/notes')
const generateId = () => {
    const notes = readDataFromFile();
    let biggestIdYet = 0;
    for (const note of notes) {if (note.id > biggestIdYet) { biggestIdYet = note.id; }}  
    return biggestIdYet + 1;
  };

// UI(?) route to the front page. Pretty sure this never gets used....
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

// UI route to the notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
  });

// API route to all notes
app.get('/api/notes', (req, res) => {
    const notes = readDataFromFile();
    res.json(notes);
});

// API route to an individual note
app.get('/api/notes/:id', (req, res) => {
  const notes = readDataFromFile();
  const noteId = Number(req.params.id);
  const note = notes.find((note) => note.id === noteId);

  if (note) {
    res.json(note);
  } else {res.status(404).json({ error: 'Note not found' });}
});

// route to save a new note
app.post('/api/notes', (req, res) => {
    const notes = readDataFromFile();
    const newNote = req.body;
    newNote.id = generateId();
    notes.push(newNote);
    writeDataToFile(notes);
    res.json(newNote);
  });

// route to delete a note
app.delete('/api/notes/:id', (req, res) => {
    const notes = readDataFromFile();
    const noteId = Number(req.params.id);
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    writeDataToFile(updatedNotes);
    res.sendStatus(204);
});

app.use(express.static('public'));
app.listen(PORT, () => {console.log(`Now listening at port ${PORT}`);});
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Begin shit ChatGPT recommended:

app.use(express.json());
const dbFilePath = path.join(__dirname, 'db', 'db.json');
const readDataFromFile = () => {const data = fs.readFileSync(dbFilePath, 'utf8');return JSON.parse(data);};
const writeDataToFile = (data) => {fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));};

const generateId = () => {
    const notes = readDataFromFile();
    let maxId = 0;
    for (const note of notes) {if (note.id > maxId) { maxId = note.id; }}  
    return maxId + 1;
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

// API route to an individual note (coming soon!)

// route to save a new note; works currently returns naked JSON data of the note, which is janky, and it ought to be a pretty, UI-looking display
app.post('/api/notes', (req, res) => {
    const notes = readDataFromFile();
    const newNote = req.body;
    newNote.id = generateId();
    notes.push(newNote);
    writeDataToFile(notes);
    res.json(newNote);
  });

// WIP route to delete a note; currently doesn't work because db.json does not have an `id` kvp!
app.delete('/api/notes/:id', (req, res) => {
    const notes = readDataFromFile();
    const noteId = req.params.id;
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    writeDataToFile(updatedNotes);
    res.sendStatus(204); // No Content
});

// Serve static files from the public directory
app.use(express.static('public'));

// End shit ChatGPT recommended

app.listen(PORT, () => {console.log(`Now listening at port ${PORT}`);});
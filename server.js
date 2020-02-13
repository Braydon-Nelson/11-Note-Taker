const express = require('express');
const fs = require('fs');
const querystring = require('querystring');

const app = express();

app.use(express.static('public'))

var PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.status(200).sendFile(__dirname + '/public/index.html');
});

app.get('/notes', (req, res) => {
    res.status(200).sendFile(__dirname + '/public/notes.html');
});

app.get('/api/notes', (req, res) => {
    try {
        fs.readFile(__dirname + '/db/db.json', 'utf-8', (err, data) => {
            if (err) {
                throw Error(err);
            }            
            const jsonData = JSON.parse(data);
            res.status(200).send(jsonData);
        })
    } catch (err) {
        console.error(err);
        res.status(404).send(`Could not find a note to load.`);
    }
});

app.post('/api/notes', (req, res) => {
    // Parse incoming request message
    let message = '';
    req.on('data', data => {
        message += data.toString();
    }).on('end', () => {
        const newNote = querystring.parse(message);

        if (Object.keys(newNote).length !== 0) {
            fs.readFile(__dirname + '/db/db.json', 'utf-8', (err, data) => {
                if (err) {
                    throw err;
                }

                data = JSON.parse(data);
                // Set new notes id
                newNote.id = data.length;
                data.push(newNote);

                fs.writeFile(__dirname + '/db/db.json', JSON.stringify(data), err => {
                    if (err) throw err;
                    console.log('Message Saved.')
                });
            });
            res.send(newNote);
        } else {
            throw new Error('Something went wrong.');
        }
    });
})

app.delete('/api/notes/:id', (req, res) => {
    // Get the id of the note being deleted
    const id = req.params.id;
    fs.readFile(__dirname + '/db/db.json', 'utf-8', (err, notes) => {
        if (err) {
            throw err;
        }

        notes = JSON.parse(notes);
        // Loop through the notes array to match the note that is being deleted
        for (let i = 0; i < notes.length; i++) {
            if (notes[i].id === parseInt(id)) {
                notes.splice(i, 1);
            }
        }        
        // Rewrite the updated notes array
        fs.writeFile(__dirname + '/db/db.json', JSON.stringify(notes), err => {
            if (err) throw err;

            console.log('Message Deleted.')
        });
    });

    res.send('Message Deleted.');
})


app.listen(PORT, () => console.log(`App listening on http://localhost:${PORT}`))

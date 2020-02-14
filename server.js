const express = require('express');
const fs = require('fs');
const querystring = require('querystring');

const app = express();

app.use(express.static('public'))

var PORT = process.env.PORT || 8080;

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/public/index.html');
});

app.get('/notes', (request, response) => {
    response.sendFile(__dirname + '/public/notes.html');
});

app.get('/api/notes', (request, response) => {
    try {
        fs.readFile(__dirname + '/db/db.json', 'utf-8', (err, data) => {
            if (err) {
                throw Error(err);
            }
            const jsonData = JSON.parse(data);
            response.send(jsonData);
        })
    } catch (err) {
        console.error(err);
        response.send(`Could not find a note to load.`);
    }
});

app.post('/api/notes', (request, response) => {
    // Parse incoming request message
    let message = '';
    request.on('data', data => {
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
                newNote.id = data.length + 1;
                data.push(newNote);

                fs.writeFile(__dirname + '/db/db.json', JSON.stringify(data), err => {
                    if (err) throw err;
                    console.log('Message Saved.')
                });
            });
            response.send(newNote);
        } else {
            throw new Error('Something went wrong.');
        }
    });
})

app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id;
    fs.readFile(__dirname + '/db/db.json', 'utf-8', (err, notes) => {
        if (err) {
            throw err;
        }
        console.log(`found a file now going to delete it`);
        notes = JSON.parse(notes);

        for (let i = 0; i < notes.length; i++) {
            if (notes[i].id === parseInt(id)) {
                notes.splice(i, 1);
            }
        }
        fs.writeFile(__dirname + '/db/db.json', JSON.stringify(notes), err => {
            if (err) {
                throw err;
            }
            console.log(`Message Deleted.`);
        })
    })
    response.send(`Message Deleted`)
})


app.listen(PORT, () => console.log(`App listening on http://localhost:${PORT}`))

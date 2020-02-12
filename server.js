const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.static('public'))

var PORT = process.env.PORT || 8080;

app.get('/', (req, res, next) => {
    res.status(200).sendFile(__dirname + '/public/index.html');
});

app.get('/notes', (req, res, next) => {
    res.status(200).sendFile(__dirname + '/public/notes.html');
});


app.listen(PORT, () => console.log(`App listening on http://localhost:${PORT}`))

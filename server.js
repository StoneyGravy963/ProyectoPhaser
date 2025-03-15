const express = require('express');
const path = require('path'); 
const app = express();
const port = 3000;

app.use(express.static(__dirname));

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/recursos', express.static(path.join(__dirname, 'recursos')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use('/styles.css', express.static(path.join(__dirname, 'styles.css')));
app.use('/alertifyjs', express.static(path.join(__dirname, 'alertifyjs')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Servidor ejecutándose en: http://localhost:${port}`);
});
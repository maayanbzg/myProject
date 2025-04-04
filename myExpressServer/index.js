const express = require('express');
const mysqlRoutes = require('./routes/mysqlRoutes');
const mongoRoutes = require('./routes/mongoRoutes');

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

app.use(mysqlRoutes);
app.use(mongoRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
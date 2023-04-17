import express from 'express';
import DATA from './data.js';


const app = express();

app.get('/api/products', (req, res) => {
    res.send(DATA.products)
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})
const express = require('express');
const app = express();
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});


app.use(express.static(__dirname));
app.use('/images', express.static(__dirname + '/images'));

const imageList = [
    '/images/fatBabyEating.jpg',
    '/images/fatBaby.jpg',
    '/images/AleTayo.jpg',
    '/images/AleYellowDress.jpg',
    '/images/AleUtahTrip.jpg',
    '/images/utahTrip.jpg'
];

app.get('/random-image', (req, res) => {
    const randomIndex = Math.floor(Math.random() * imageList.length);
    res.json({ url: imageList[randomIndex] });
});
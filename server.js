const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: { origin: "*" }
});
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

let busLocation = { lat: 28.6139, lng: 77.2090 }; // Default Delhi
let availableSeats = 40;

// Driver updates location
app.post('/update-location', (req, res) => {
    busLocation = req.body;
    io.emit('busLocation', busLocation);
    res.json({ success: true });
});

// Book seat
app.post('/book-seat', (req, res) => {
    if (availableSeats > 0) {
        availableSeats--;
        io.emit('seatUpdate', availableSeats);
    }
    res.json({ availableSeats });
});

// Get current data
app.get('/bus-data', (req, res) => {
    res.json({ location: busLocation, seats: availableSeats });
});

http.listen(3000, () => console.log('Server running on http://localhost:3000'));

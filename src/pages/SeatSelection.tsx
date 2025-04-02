import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Button, Box, Tooltip, Modal, Paper, TextField, Divider } from "@mui/material";
import { useParams } from "react-router-dom";
import image1 from "../assets/images/image1.png";
import image2 from "../assets/images/image2.png";
import image3 from "../assets/images/image3.png";

const SEAT_PRICES = {
  regular: 50000,
  vip: 100000,
};

const STATUS = {
  available: "green",
  held: "orange",
  booked: "gray",
};

const concerts = [
  { id: 1, name: "Coldplay", description: "Dummy description", image: image1, date: "2025-06-15", ticketsAvailable: 0 },
  { id: 2, name: "Summer Fest", description: "Dummy description", image: image2, date: "2025-07-21", ticketsAvailable: 10 },
  { id: 3, name: "Winter Fest", description: "Dummy description", image: image3, date: "2025-08-10", ticketsAvailable: 55 },
  { id: 4, name: "Winter Fest 2025", description: "Dummy description", image: image3, date: "2025-08-10", ticketsAvailable: 0 },
  { id: 5, name: "Rock Night", description: "Dummy description", image: image1, date: "2025-09-12", ticketsAvailable: 0 },
];

const SeatSelection: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const concertId = id  
  const concert = concerts.find(c => c.id === parseInt(concertId || ""));

  const loadSeatsFromLocalStorage = () => {
    const savedSeats = localStorage.getItem(`selectedSeats_${concertId}`);
    return savedSeats ? JSON.parse(savedSeats) : [];
  };

  const loadCountdown = () => {
    const savedTime = localStorage.getItem(`seatSelectionStartTime_${concertId}`);
    return savedTime ? parseInt(savedTime, 10) : null;
  };

  const initialVipSeats = Array(2)
    .fill(null)
    .map((_,) =>
      Array(10)
        .fill(0)
        .map((_) => ({
          status: 0,
          type: "vip",
        }))
    );

  const initialRegularSeats = Array(4)
    .fill(null)
    .map((_,) =>
      Array(10)
        .fill(0)
        .map((_) => ({
          status: 0,
          type: "regular",
        }))
    );

  const [vipSeats, setVipSeats] = useState(initialVipSeats);
  const [regularSeats, setRegularSeats] = useState(initialRegularSeats);
  const [selectedSeats, setSelectedSeats] = useState<{ row: number; col: number; type: keyof typeof SEAT_PRICES; section: string }[]>(
    loadSeatsFromLocalStorage()
  );
  const [openModal, setOpenModal] = useState(false);
  const [countdown, setCountdown] = useState(600); 
  const [startTime, setStartTime] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    let savedTime = loadCountdown();

    if (!savedTime) {
      savedTime = Date.now(); 
      localStorage.setItem(`seatSelectionStartTime_${concertId}`, savedTime.toString());
    }

    setStartTime(savedTime);
  }, [concertId]);

  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      const remainingTime = Math.max(600 - elapsedTime, 0);
      setCountdown(remainingTime);

      if (remainingTime === 0) {
        setSelectedSeats([]); 
        localStorage.removeItem(`selectedSeats_${concertId}`);
        localStorage.removeItem(`seatSelectionStartTime_${concertId}`);
        alert("Time's up! Your selected seats have been cancelled.");
        window.location.reload(); 
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, concertId]);

  useEffect(() => {
    localStorage.setItem(`selectedSeats_${concertId}`, JSON.stringify(selectedSeats));
  }, [selectedSeats, concertId]);

  const toggleSeatSelection = (row: number, col: number, type: keyof typeof SEAT_PRICES, section: string) => {
    const seats = section === "vip" ? vipSeats : regularSeats;
    
    if (seats[row][col].status === 1) return;

    const isSelected = selectedSeats.some(
      (seat) => seat.row === row && seat.col === col && seat.section === section
    );

    if (isSelected) {
      setSelectedSeats((prev) => prev.filter((seat) => 
        !(seat.row === row && seat.col === col && seat.section === section)
      ));
    } else {
      setSelectedSeats((prev) => [...prev, { row, col, type, section }]);
    }
  };

  const confirmSelection = () => {
    if (name.trim() === "" || phone.trim() === "") {
      alert("Please fill in all fields.");
      return;
    }
    
    const updatedVipSeats = [...vipSeats];
    selectedSeats.forEach(({ row, col, section }) => {
      if (section === "vip") {
        updatedVipSeats[row][col].status = 1;
      }
    });
    setVipSeats(updatedVipSeats);
    
    const updatedRegularSeats = [...regularSeats];
    selectedSeats.forEach(({ row, col, section }) => {
      if (section === "regular") {
        updatedRegularSeats[row][col].status = 1;
      }
    });
    setRegularSeats(updatedRegularSeats);
    
    setSelectedSeats([]);
    localStorage.removeItem(`selectedSeats_${concertId}`);
    localStorage.removeItem(`seatSelectionStartTime_${concertId}`);
    setOpenModal(false);
    alert("Seats booked successfully!");
  };

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + SEAT_PRICES[seat.type], 0);

  const formatCountdown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const renderSeatGrid = (seats: any[][], section: string) => {
    return (
      <Grid container spacing={1} justifyContent="center">
        {seats.map((row, rowIndex) =>
          row.map((seat, colIndex) => {
            const isSelected = selectedSeats.some(
              (selectedSeat) => 
                selectedSeat.row === rowIndex && 
                selectedSeat.col === colIndex && 
                selectedSeat.section === section
            );

            const seatColor =
              seat.status === 1
                ? STATUS.booked
                : isSelected
                ? STATUS.held
                : seat.type === "vip"
                ? "blue"
                : STATUS.available;

            const seatLabel = seat.status === 1 ? "Booked" : isSelected ? "Held" : "Available";
            const seatTypeLabel = seat.type === "vip" ? "VIP" : "Regular";
            
            let seatNumber;
            if (section === "vip") {
              seatNumber = colIndex + 1 + (rowIndex * 10);
            } else {
              seatNumber = colIndex + 1 + (rowIndex * 10) + 20; 
            }

            return (
              <Grid  key={`${section}-${rowIndex}-${colIndex}`}>
                <Tooltip title={`${seatTypeLabel} - ${seatLabel}`} arrow>
                  <Button
                    variant="contained"
                    onClick={() => toggleSeatSelection(rowIndex, colIndex, seat.type, section)}
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: seatColor,
                      cursor: seat.status === 1 ? "not-allowed" : "pointer",
                      border: seat.type === "vip" ? "2px solid gold" : "2px solid transparent",
                    }}
                    disabled={seat.status === 1}
                  >
                    {seatNumber}
                  </Button>
                </Tooltip>
              </Grid>
            );
          })
        )}
      </Grid>
    );
  };

  return (
    <Container maxWidth="md">
      <Box textAlign="center" my={4}>
        <Typography variant="h4" fontWeight="bold">
          Select Your Seats: {concert ? concert.name : "Concert not found"}
        </Typography>
      </Box>

      {concert && (
        <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" my={4}>
          <Typography variant="h6">{concert.date}</Typography>
          <Typography>{concert.description}</Typography>
          <img src={concert.image} alt={concert.name} style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }} />
        </Box>
      )}

      <Box textAlign="center" mb={2}>
        <Typography variant="h6" color={countdown < 60 ? "red" : "black"}>
          Time remaining: {formatCountdown(countdown)}
        </Typography>
      </Box>

      <Box textAlign="center" mb={2} p={2} bgcolor="black" color="white">
        <Typography variant="h6">Main Stage</Typography>
      </Box>

      {/* VIP Section */}
      <Box mb={4}>
        <Box sx={{ bgcolor: "gold", p: 1, mb: 2 }}>
          <Typography variant="h6" fontWeight="bold" textAlign="center">
            VIP Section - Rp {SEAT_PRICES.vip.toLocaleString()} per seat
          </Typography>
        </Box>
        {renderSeatGrid(vipSeats, "vip")}
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Regular Section */}
      <Box mb={4}>
        <Box sx={{ bgcolor: "lightgreen", p: 1, mb: 2 }}>
          <Typography variant="h6" fontWeight="bold" textAlign="center">
            Regular Section - Rp {SEAT_PRICES.regular.toLocaleString()} per seat
          </Typography>
        </Box>
        {renderSeatGrid(regularSeats, "regular")}
      </Box>

      <Box textAlign="center" mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenModal(true)}
          disabled={selectedSeats.length === 0}
        >
          Confirm Selection
        </Button>
      </Box>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Paper
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "20px",
            minWidth: "300px",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Customer Details:
          </Typography>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Phone Number"
            fullWidth
            margin="normal"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Typography variant="h6" fontWeight="bold">
            Selected Seats:
          </Typography>
          <ul>
            {selectedSeats.map((seat, index) => {
              const seatNumber = seat.section === "vip" 
                ? seat.col + 1 + (seat.row * 10)
                : seat.col + 1 + (seat.row * 10) + 20;
                
              return (
                <li key={index}>
                  {seat.section === "vip" ? "VIP" : "Regular"} Row {seat.row + 1}, 
                  Seat {seat.col + 1} (#{seatNumber}) - {SEAT_PRICES[seat.type].toLocaleString()} IDR
                </li>
              );
            })}
          </ul>
    
          <Typography variant="h6" mt={2}>
            Total Price: <strong>{totalPrice.toLocaleString()} IDR</strong>
          </Typography>
          <Box textAlign="center" mt={2}>
            <Button variant="contained" color="primary" onClick={confirmSelection}>
              Confirm & Book
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Container>
  );
};

export default SeatSelection;
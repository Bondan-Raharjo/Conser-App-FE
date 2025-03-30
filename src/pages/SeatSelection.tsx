import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Button, Box, Tooltip, Modal, Paper } from "@mui/material";

const SEAT_PRICES = {
  regular: 50000,
  vip: 100000,
};

const STATUS = {
  available: "green",
  held: "orange",
  booked: "gray",
};

const concertId = "concert_123"; 

const loadSeatsFromLocalStorage = () => {
  const savedSeats = localStorage.getItem(`selectedSeats_${concertId}`);
  return savedSeats ? JSON.parse(savedSeats) : [];
};

const loadCountdown = () => {
  const savedTime = localStorage.getItem(`seatSelectionStartTime_${concertId}`);
  return savedTime ? parseInt(savedTime, 10) : null;
};

const initialSeats = Array(6)
  .fill(null)
  .map((_, rowIndex) =>
    Array(10)
      .fill(0)
      .map((_) => ({
        status: 0,
        type: rowIndex < 2 ? "vip" : "regular",
      }))
  );

const SeatSelection: React.FC = () => {
  const [seats, setSeats] = useState(initialSeats);
  const [selectedSeats, setSelectedSeats] = useState<{ row: number; col: number; type: string }[]>(
    loadSeatsFromLocalStorage()
  );
  const [openModal, setOpenModal] = useState(false);
  const [countdown, setCountdown] = useState(600); 
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    let savedTime = loadCountdown();

    if (!savedTime) {
      savedTime = Date.now(); 
      localStorage.setItem(`seatSelectionStartTime_${concertId}`, savedTime.toString());
    }

    setStartTime(savedTime);
  }, []);

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
        alert("Waktu habis! Kursi yang Anda pilih telah dibatalkan.");
        window.location.reload(); 
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  useEffect(() => {
    localStorage.setItem(`selectedSeats_${concertId}`, JSON.stringify(selectedSeats));
  }, [selectedSeats]);

  const toggleSeatSelection = (row: number, col: number) => {
    if (seats[row][col].status === 1) return;

    const isSelected = selectedSeats.some(
      (seat) => seat.row === row && seat.col === col
    );

    if (isSelected) {
      setSelectedSeats((prev) => prev.filter((seat) => seat.row !== row || seat.col !== col));
    } else {
      setSelectedSeats((prev) => [...prev, { row, col, type: seats[row][col].type }]);
    }
  };

  const confirmSelection = () => {
    const updatedSeats = [...seats];
    selectedSeats.forEach(({ row, col }) => (updatedSeats[row][col].status = 1));
    setSeats(updatedSeats);
    setSelectedSeats([]);
    localStorage.removeItem(`selectedSeats_${concertId}`);
    localStorage.removeItem(`seatSelectionStartTime_${concertId}`);
    setOpenModal(false);
    alert("Kursi berhasil dipesan!");
  };

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + SEAT_PRICES[seat.type], 0);

  const formatCountdown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <Container maxWidth="md">
      <Box textAlign="center" my={4}>
        <Typography variant="h4" fontWeight="bold">
          Pilih Kursi Anda
        </Typography>
      </Box>

      <Box textAlign="center" mb={2}>
        <Typography variant="h6" color={countdown < 60 ? "red" : "black"}>
          Waktu tersisa: {formatCountdown(countdown)}
        </Typography>
      </Box>


      <Box textAlign="center" mb={2} p={2} bgcolor="black" color="white">
        <Typography variant="h6">Main Stage</Typography>
      </Box>


      <Grid container spacing={1} justifyContent="center">
        {seats.map((row, rowIndex) =>
          row.map((seat, colIndex) => {
            const isSelected = selectedSeats.some(
              (selectedSeat) => selectedSeat.row === rowIndex && selectedSeat.col === colIndex
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
            const seatTypeLabel = seat.type === "vip" ? "VIP" : "Reguler";

            return (
              <Grid item key={`${rowIndex}-${colIndex}`} xs={1}>
                <Tooltip title={`${seatTypeLabel} - ${seatLabel}`} arrow>
                  <Button
                    variant="contained"
                    onClick={() => toggleSeatSelection(rowIndex, colIndex)}
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: seatColor,
                      cursor: seat.status === 1 ? "not-allowed" : "pointer",
                      border: seat.type === "vip" ? "2px solid gold" : "2px solid transparent",
                    }}
                    disabled={seat.status === 1}
                  >
                    {colIndex + 1}
                  </Button>
                </Tooltip>
              </Grid>
            );
          })
        )}
      </Grid>

      <Box textAlign="center" mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenModal(true)}
          disabled={selectedSeats.length === 0}
        >
          Konfirmasi Pilihan
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
            Kursi yang Dipilih:
          </Typography>
          <ul>
            {selectedSeats.map((seat, index) => (
              <li key={index}>
                Baris {seat.row + 1}, Kursi {seat.col + 1} -{" "}
                {seat.type === "vip" ? "VIP" : "Reguler"} ({SEAT_PRICES[seat.type].toLocaleString()}{" "}
                IDR)
              </li>
            ))}
          </ul>
          <Typography variant="h6" mt={2}>
            Total Harga: <strong>{totalPrice.toLocaleString()} IDR</strong>
          </Typography>
          <Box textAlign="center" mt={2}>
            <Button variant="contained" color="primary" onClick={confirmSelection}>
              Konfirmasi & Pesan
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Container>
  );
};

export default SeatSelection;

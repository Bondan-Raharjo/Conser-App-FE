import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Box, Typography, IconButton, Button } from "@mui/material";
import { Ticket, Calendar, AlertCircle, Clock } from "lucide-react";
import CloseIcon from "@mui/icons-material/Close";

interface ConcertProps {
  id: number;
  name: string;
  description: string;
  image: string;
  date: string;
  ticketsAvailable: number;
}

const ConcertCard: React.FC<ConcertProps> = ({ id, name, description, image, date, ticketsAvailable }) => {
  const [countdown, setCountdown] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const updateCountdown = () => {
      const concertDate = new Date(date).getTime();
      const now = new Date().getTime();
      const timeLeft = concertDate - now;

      if (timeLeft < 0) {
        setCountdown("Concert Already Started");
        return;
      }

      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      setCountdown(`${days} days, ${hours} hours left`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 3600000);
    return () => clearInterval(interval);
  }, [date]);

  const handleSelectConcert = () => {
    if (ticketsAvailable <= 0) {
      setOpenModal(true);
      return;
    }
    navigate(`/concerts/${id}/seats`);
  };

  return (
    <>
      <div
        className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300  transform hover:scale-105"
      >
        <img src={image} alt={name} className="w-full h-48 object-cover" />
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Ticket className="w-5 h-5 text-blue-500" /> {name}
            </h2>
            <span className="flex items-center gap-1 text-gray-500 text-sm">
              <Calendar className="w-4 h-4" /> {new Date(date).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-600 mt-2 text-sm">{description}</p>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Clock className="w-4 h-4 text-gray-400" /> {countdown}
            </p>
            <p className={`text-lg font-semibold ${ticketsAvailable > 0 ? "text-green-500" : "text-red-500"}`}>
              {ticketsAvailable > 0 ? `Available: ${ticketsAvailable}` : ""}
            </p>
          </div>
          <Button
            onClick={handleSelectConcert}
            variant="contained"
            fullWidth
            sx={{ mt: 2, bgcolor: ticketsAvailable > 0 ? "#1976D2" : "gray" }}
            disabled={ticketsAvailable <= 0}
          >
            {ticketsAvailable > 0 ? "Buy Ticket" : "Sold Out"}
          </Button>
        </div>
      </div>

      {/* Modal for Sold Out Tickets */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="bold" className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" /> Sold Out
            </Typography>
            <IconButton onClick={() => setOpenModal(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography>
            Tickets for <strong>{name}</strong> are sold out. Please check back later for availability.
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default ConcertCard;

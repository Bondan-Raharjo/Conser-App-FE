import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Modal, 
  Box, 
  Typography, 
  Button,
  IconButton
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

interface ConcertProps {
  id: number;
  name: string;
  description: string;
  image: string;
  date: string;
  ticketsAvailable: number;
}

const ConcertCard: React.FC<ConcertProps> = ({ 
  id, 
  name, 
  description, 
  image, 
  date, 
  ticketsAvailable 
}) => {
  const [countdown, setCountdown] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      const concertDate = new Date(date).getTime();
      const now = new Date().getTime();
      const timeLeft = concertDate - now;

      if (timeLeft < 0) {
        setCountdown("Konser telah dimulai!");
        clearInterval(interval);
        return;
      }

      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      setCountdown(`${days} hari lagi`);
    }, 1000);

    return () => clearInterval(interval);
  }, [date]);

  const handleSelectConcert = () => {
    if (ticketsAvailable <= 0) {
      setOpenModal(true);
      return;
    }
    // Navigate to the seat selection page
    navigate(`/concerts/${id}/seats`);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <div
        onClick={handleSelectConcert}
        className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer transform hover:scale-105"
      >
        <img src={image} alt={name} className="w-full h-40 object-cover" />
        <div className="p-4">
          <h2 className="text-xl font-bold">{name}</h2>
          <p className="text-gray-600">{description}</p>
          <div className="mt-4">
            <p className="text-sm text-gray-500">{countdown}</p>
            <p className={`text-lg font-semibold ${ticketsAvailable > 0 ? "text-green-500" : "text-red-500"}`}>
              {ticketsAvailable > 0 ? `Tiket tersedia: ${ticketsAvailable}` : "Tiket Habis!"}
            </p>
          </div>
        </div>
      </div>

      {/* Alert Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="sold-out-modal"
        aria-describedby="sold-out-ticket-information"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography id="sold-out-modal" variant="h6" component="h2" fontWeight="bold">
              Tiket Habis
            </Typography>
            <IconButton onClick={handleCloseModal} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Typography id="sold-out-ticket-information" sx={{ mt: 2, mb: 3 }}>
            Mohon maaf, semua tiket untuk konser <strong>{name}</strong> telah habis terjual. 
          </Typography>

        </Box>
      </Modal>
    </>
  );
};

export default ConcertCard;
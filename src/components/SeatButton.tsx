type SeatStatus = "available" | "held" | "booked";

interface SeatButtonProps {
  id: string;
  status: SeatStatus;
  onClick: () => void;
}

const SeatButton: React.FC<SeatButtonProps> = ({ id, status, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`seat-button ${status}`}
      disabled={status === "booked"}
    >
      {id}
    </button>
  );
};

export default SeatButton;

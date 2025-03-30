import React, { useEffect, useState, useCallback, useMemo } from "react";
import { 
  Container, Typography, Grid, Button, Box, Tooltip, Modal, Paper
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useParams } from "react-router-dom";

// Constants
const SEAT_PRICES = { regular: 50000, vip: 100000 };
const SEAT_STATUS = { AVAILABLE: 0, BOOKED: 1 };
const STATUS_COLORS = { available: "green", held: "orange", booked: "gray", vip: "blue" };

// Component for individual seat
const Seat = ({ seat, index }) => {
  return (
    <Draggable draggableId={`${seat.row}-${seat.col}`} index={index} isDragDisabled={seat.status === SEAT_STATUS.BOOKED}>
      {(provided) => (
        <Tooltip title={`${seat.type.toUpperCase()} - ${seat.status === SEAT_STATUS.BOOKED ? "Booked" : "Available"}`} arrow>
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            style={{
              width: 40,
              height: 40,
              backgroundColor: seat.status === SEAT_STATUS.BOOKED ? STATUS_COLORS.booked : STATUS_COLORS.available,
              border: seat.type === "vip" ? "2px solid gold" : "2px solid transparent",
              textAlign: "center",
              lineHeight: "40px",
              cursor: seat.status === SEAT_STATUS.BOOKED ? "not-allowed" : "pointer",
              margin: "4px",
              ...provided.draggableProps.style
            }}
          >
            {seat.col + 1}
          </div>
        </Tooltip>
      )}
    </Draggable>
  );
};

// Main component
const SeatSelection = () => {
  const { id } = useParams();
  const concertId = id || "";
  
  // Initialize seats
  const initialSeats = useMemo(() => 
    Array(6).fill(null).map((_, rowIndex) =>
      Array(10).fill(0).map((_, colIndex) => ({
        row: rowIndex,
        col: colIndex,
        status: SEAT_STATUS.AVAILABLE,
        type: rowIndex < 2 ? "vip" : "regular",
      }))
    ), []
  );

  const [seats, setSeats] = useState(initialSeats);

  const onDragEnd = useCallback((result) => {
    if (!result.destination) return;

    const sourceRow = parseInt(result.source.droppableId);
    const destRow = parseInt(result.destination.droppableId);
    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    const updatedSeats = [...seats];
    const movedSeat = updatedSeats[sourceRow][sourceIndex];
    
    if (updatedSeats[destRow][destIndex].status === SEAT_STATUS.BOOKED) return;
    
    updatedSeats[sourceRow][sourceIndex] = { ...updatedSeats[sourceRow][sourceIndex], status: SEAT_STATUS.AVAILABLE };
    updatedSeats[destRow][destIndex] = { ...movedSeat, row: destRow, col: destIndex };
    
    setSeats(updatedSeats);
  }, [seats]);

  return (
    <Container maxWidth="md">
      <Box textAlign="center" my={4}>
        <Typography variant="h4" fontWeight="bold">
          Pilih Kursi Anda (Drag & Drop)
        </Typography>
      </Box>

      <DragDropContext onDragEnd={onDragEnd}>
        {seats.map((row, rowIndex) => (
          <Droppable key={rowIndex} droppableId={`${rowIndex}`} direction="horizontal">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} style={{ display: "flex", justifyContent: "center" }}>
                {row.map((seat, colIndex) => (
                  <Seat key={`${rowIndex}-${colIndex}`} seat={seat} index={colIndex} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </Container>
  );
};

export default SeatSelection;

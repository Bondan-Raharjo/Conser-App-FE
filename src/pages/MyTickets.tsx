import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";

interface Ticket {
  id: string;
  concertName: string;
  date: string;
  quantity: number;
  status: "Active" | "Inactive";
}

const myTickets: Ticket[] = [];

const TicketCard: React.FC<{ ticket: Ticket }> = ({ ticket }) => (
  <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
    <CardContent>
      <Typography variant="h6" className="font-semibold mb-2">
        {ticket.concertName}
      </Typography>
      <Typography variant="body2" color="textSecondary" className="mb-1">
        Date: {ticket.date}
      </Typography>
      <Typography variant="body2" className="mb-1">
        Ticket Quantity: {ticket.quantity}
      </Typography>
      <Typography
        variant="body2"
        className={`font-semibold ${
          ticket.status === "Active" ? "text-green-600" : "text-red-600"
        }`}
      >
        Status: {ticket.status}
      </Typography>
    </CardContent>
  </Card>
);

const MyTickets: React.FC = () => {
  const hasTickets = myTickets.length > 0;

  return (
    <Box className="p-4 sm:p-8 min-h-screen">
      <Typography variant="h4" className="text-center mb-6 font-bold">
        My Tickets
      </Typography>
      
      {!hasTickets ? (
        <Typography className="text-center text-gray-500">
          You don't have any tickets yet. Please book a ticket first.
        </Typography>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {myTickets.map((ticket) => (
            <Grid key={ticket.id}>
              <TicketCard ticket={ticket} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default MyTickets;

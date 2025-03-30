# Seat Selection App

A React application that allows users to select and book concert seats. The app provides a real-time countdown timer, seat selection, and booking confirmation.

## Features

- **Seat Selection**: Choose available seats from a grid layout.
- **Seat Status**: Indicate booked, available, and selected seats with different colors.
- **Countdown Timer**: Users have 10 minutes to complete their selection before seats are released.
- **Local Storage**: Stores seat selection and countdown state to persist across page reloads.
- **Booking Confirmation**: Confirms seat booking and updates seat status.

## Installation

```sh
npm install
```

## Running the App

```sh
npm run dev
```

## Technologies Used

- React
- Material-UI
- Vite

## Usage
1. Run the app using `npm run dev`.
2. Select available seats by clicking on them.
3. Click the "Konfirmasi Pilihan" button to proceed.
4. Confirm your selection to book seats.
5. If the countdown reaches zero, the selection is reset.

## License
MIT
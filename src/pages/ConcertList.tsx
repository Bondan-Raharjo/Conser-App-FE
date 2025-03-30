import React from "react";
import ConcertCard from "../components/ConcertCard";
import image1 from "../assets/images/image1.png";
import image2 from "../assets/images/image2.png";
import image3 from "../assets/images/image3.png";

const concerts = [
    {
        id: 1,
        name: "Coldplay",
        description: "Dummy description",
        image: image1,
        date: "2025-06-15",
        ticketsAvailable: 0,
    },
    {
        id: 2,
        name: "Summer Fest",
        description: "Dummy description",
        image: image2,
        date: "2025-07-21",
        ticketsAvailable: 10,
    },
    {
        id: 3,
        name: "Winter Fest",
        description: "Dummy description",
        image: image3,
        date: "2025-08-10",
        ticketsAvailable: 55,
    },
    {
        id: 4,
        name: "Winter Fest 2025",
        description: "Dummy description",
        image: image3,
        date: "2025-08-10",
        ticketsAvailable: 0,
    },
];

const ConcertList: React.FC = () => {
    return (
        <div className="min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-6">Daftar Konser</h1>

            <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {concerts.map((concert) => (
                    <ConcertCard key={concert.id} {...concert} />
                ))}
            </div>
        </div>
    );
};

export default ConcertList;

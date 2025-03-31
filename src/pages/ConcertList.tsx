import React, { useState } from "react";
import ConcertCard from "../components/ConcertCard";
import image1 from "../assets/images/image1.png";
import image2 from "../assets/images/image2.png";
import image3 from "../assets/images/image3.png";

const concerts = [
  { id: 1, name: "Coldplay", description: "Dummy description", image: image1, date: "2025-06-15", ticketsAvailable: 0 },
  { id: 2, name: "Summer Fest", description: "Dummy description", image: image2, date: "2025-07-21", ticketsAvailable: 10 },
  { id: 3, name: "Winter Fest", description: "Dummy description", image: image3, date: "2025-08-10", ticketsAvailable: 55 },
  { id: 4, name: "Winter Fest 2025", description: "Dummy description", image: image3, date: "2025-08-10", ticketsAvailable: 0 },
  { id: 5, name: "Rock Night", description: "Dummy description", image: image1, date: "2025-09-12", ticketsAvailable: 0 },
];

const ConcertList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const concertsPerPage = 3;

  const filteredConcerts = concerts.filter(concert =>
    concert.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredConcerts.length / concertsPerPage);
  const indexOfLastConcert = currentPage * concertsPerPage;
  const indexOfFirstConcert = indexOfLastConcert - concertsPerPage;
  const currentConcerts = filteredConcerts.slice(indexOfFirstConcert, indexOfLastConcert);

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Concert List</h1>
      <div className="max-w-3xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Search concerts..."
          className="w-full px-4 py-2 border border-gray-300 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {currentConcerts.map(concert => (
          <ConcertCard key={concert.id} {...concert} />
        ))}
      </div>
      {filteredConcerts.length > 0 && totalPages > 1 ? (
        <div className="flex justify-center mt-6">
          <button
            className="px-3 py-1 mx-1 border rounded"
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`px-3 py-1 mx-1 border rounded ${currentPage === index + 1 ? 'bg-gray-300' : ''}`}
              onClick={() => goToPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 mx-1 border rounded"
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      ) : null}
      {filteredConcerts.length === 0 && (
        <div className="text-center mt-6">
          <p className="text-gray-500">No concerts found.</p>
        </div>
      )}
    </div>
  );
};

export default ConcertList;
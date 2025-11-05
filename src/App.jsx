import { useState } from "react";
import Footer from "./components/Footer";
import Book from "./components/Book";
import AppHeader from "./components/AppHeader";
import AddButton from "./components/AddButton";
import data from "../data/books.json";

function App() {
  // Initialize books with selected property
  const [books, setBooks] = useState(data.map(book => ({ ...book, selected: false })));
  const [selectedBookId, setSelectedBookId] = useState(null);

  // Add a new book
  const handleAddBook = (newBook) => {
    const bookWithId = {
      ...newBook,
      isbn13: Date.now().toString(), // Generate a simple ID
      price: "$0.00", // Default price
      image: "https://via.placeholder.com/120x170?text=No+Image", // Default image
      selected: false
    };
    setBooks(prevBooks => [...prevBooks, bookWithId]);
  };

  // Delete selected book
  const handleDeleteSelected = () => {
    if (selectedBookId) {
      setBooks(prevBooks => prevBooks.filter(book => book.isbn13 !== selectedBookId));
      setSelectedBookId(null);
    }
  };

  // Update button (no-op for now)
  const handleUpdate = () => {
    console.log("Update functionality not implemented yet");
  };

  // Toggle selection - only one book can be selected at a time
  const handleSelect = (isbn13) => {
    setBooks(prevBooks => 
      prevBooks.map(book => ({
        ...book,
        selected: book.isbn13 === isbn13 ? !book.selected : false
      }))
    );
    setSelectedBookId(prev => prev === isbn13 ? null : isbn13);
  };

  return (
    <div className="app">
      <div className="content">
        <AppHeader />
      </div>
      <div className="contentBody">
        <div className="buttonGroup">
          <AddButton onAddBook={handleAddBook} />
          <button 
            className="actionButton updateButton" 
            onClick={handleUpdate}
            disabled={!selectedBookId}
          >
            Update
          </button>
          <button 
            className="actionButton deleteButton" 
            onClick={handleDeleteSelected}
            disabled={!selectedBookId}
          >
            Delete
          </button>
        </div>
        <div className="mainContent grid grid-cols-3 gap-4">
          {books.map((book) => (
            <Book
              key={book.isbn13}
              image={book.image}
              title={book.title}
              subtitle={book.subtitle}
              isbn13={book.isbn13}
              price={book.price}
              url={book.url}
              onSelect={handleSelect}
              isSelected={book.selected}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;

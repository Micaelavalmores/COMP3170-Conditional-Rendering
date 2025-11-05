import { useState, useEffect } from "react";
import Footer from "./components/Footer";
import Book from "./components/Book";
import AppHeader from "./components/AppHeader";
import AddButton from "./components/AddButton";
import Modal from "./components/Modal";
import BookForm from "./components/BookForm";
import data from "../data/books.json";

const STORAGE_KEY = "books";

function App() {
  // Load books from localStorage or use default data
  const loadBooksFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedBooks = JSON.parse(stored);
        // Ensure all books have required fields
        return parsedBooks.map(book => ({
          ...book,
          selected: book.selected || false,
          publisher: book.publisher || "Unknown Publisher",
          language: book.language || "English",
          author: book.author || "Unknown Author"
        }));
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    }
    // Default: add publisher and language to existing books
    return data.map(book => ({ 
      ...book, 
      selected: false,
      publisher: book.publisher || "Unknown Publisher",
      language: book.language || "English",
      author: book.author || "Unknown Author"
    }));
  };

  const [books, setBooks] = useState(loadBooksFromStorage);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [filterPublisher, setFilterPublisher] = useState("");
  const [filterLanguage, setFilterLanguage] = useState("");
  const [searchTitle, setSearchTitle] = useState("");

  // Save books to localStorage whenever books change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [books]);

  // Add a new book
  const handleAddBook = (newBook) => {
    const bookWithId = {
      ...newBook,
      isbn13: Date.now().toString(), // Generate a simple ID
      price: "$0.00", // Default price
      image: "https://via.placeholder.com/120x170?text=No+Image", // Default image
      selected: false,
      subtitle: newBook.subtitle || "",
      publisher: newBook.publisher || "Unknown Publisher",
      language: newBook.language || "English",
      author: newBook.author || "Unknown Author"
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

  // Update button - open edit modal
  const handleUpdate = () => {
    if (selectedBookId) {
      setEditModalOpen(true);
    }
  };

  // Handle edit book submission
  const handleEditBook = (updatedBook) => {
    if (selectedBookId) {
      setBooks(prevBooks =>
        prevBooks.map(book =>
          book.isbn13 === selectedBookId
            ? {
                ...book,
                title: updatedBook.title,
                author: updatedBook.author,
                url: updatedBook.url,
                publisher: updatedBook.publisher,
                language: updatedBook.language,
              }
            : book
        )
      );
      setEditModalOpen(false);
      setSelectedBookId(null);
    }
  };

  // Get selected book for editing
  const selectedBook = books.find(book => book.isbn13 === selectedBookId);

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

  // Filter books based on criteria
  const filteredBooks = books.filter(book => {
    const matchesPublisher = !filterPublisher || book.publisher === filterPublisher;
    const matchesLanguage = !filterLanguage || book.language === filterLanguage;
    const matchesTitle = !searchTitle || book.title?.toLowerCase().includes(searchTitle.toLowerCase());
    return matchesPublisher && matchesLanguage && matchesTitle;
  });

  // Get unique publishers and languages for filter dropdowns
  const uniquePublishers = [...new Set(books.map(book => book.publisher).filter(Boolean))].sort();
  const uniqueLanguages = [...new Set(books.map(book => book.language).filter(Boolean))].sort();

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
          
          {/* Filter Section */}
          <div className="filterSection">
            <h3 style={{ marginTop: '20px', marginBottom: '10px', fontSize: '18px', fontWeight: '600' }}>Filters</h3>
            
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
              Search by Title:
              <input
                type="text"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                placeholder="Enter title..."
                className="filterInput"
                style={{
                  width: '100%',
                  padding: '8px',
                  marginTop: '4px',
                  border: '1px solid #ffb6c1',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  backgroundColor: '#ffb6c1',
                }}
              />
            </label>

            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
              Filter by Publisher:
              <select
                value={filterPublisher}
                onChange={(e) => setFilterPublisher(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  marginTop: '4px',
                  border: '1px solid #ffb6c1',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  backgroundColor: '#ffb6c1',
                  color: '#8b008b',
                }}
              >
                <option value="" style={{ backgroundColor: '#ffb6c1', color: '#8b008b' }}>All Publishers</option>
                {uniquePublishers.map(publisher => (
                  <option key={publisher} value={publisher}>{publisher}</option>
                ))}
              </select>
            </label>

            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
              Filter by Language:
              <select
                value={filterLanguage}
                onChange={(e) => setFilterLanguage(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  marginTop: '4px',
                  border: '1px solid #ffb6c1',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  backgroundColor: '#ffb6c1',
                  color: '#8b008b',
                }}
              >
                <option value="" style={{ backgroundColor: '#ffb6c1', color: '#8b008b' }}>All Languages</option>
                {uniqueLanguages.map(language => (
                  <option key={language} value={language}>{language}</option>
                ))}
              </select>
            </label>

            <button
              onClick={() => {
                setFilterPublisher("");
                setFilterLanguage("");
                setSearchTitle("");
              }}
              style={{
                width: '100%',
                padding: '8px',
                marginTop: '10px',
                background: '#ffb6c1',
                color: '#8b008b',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
        <div className="mainContent grid grid-cols-3 gap-4">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
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
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#666' }}>
              No books match the current filters.
            </div>
          )}
        </div>
      </div>
      <Footer />
      
      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => {
        setEditModalOpen(false);
        setSelectedBookId(null);
      }}>
        {selectedBook && (
          <BookForm
            onSubmit={handleEditBook}
            initialValues={selectedBook}
            mode="edit"
          />
        )}
      </Modal>
    </div>
  );
}

export default App;

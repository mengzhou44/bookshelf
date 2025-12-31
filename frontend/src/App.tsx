import { useState, useEffect } from "react"
import { Book, BookStatus } from "./types"
import { fetchBooks, createBook, updateBook, deleteBook } from "./api"
import Header from "./components/header"
import BookList from "./components/book-list"
import AddBookModal from "./components/add-book-modal"
import NotesModal from "./components/notes-modal"
import FilterBar from "./components/filter-bar"

function App() {
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [filter, setFilter] = useState<BookStatus | "All">("All")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBooks()
  }, [])

  useEffect(() => {
    if (filter === "All") {
      setFilteredBooks(books)
    } else {
      setFilteredBooks(books.filter((book: Book) => book.status === filter))
    }
  }, [books, filter])

  const loadBooks = async () => {
    try {
      setLoading(true)
      const data = await fetchBooks()
      setBooks(data)
    } catch (error) {
      console.error("Error loading books:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBook = async (
    bookData: Omit<Book, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const newBook = await createBook(bookData)
      setBooks([...books, newBook])
      setIsAddModalOpen(false)
    } catch (error) {
      console.error("Error adding book:", error)
      alert("Failed to add book. Please try again.")
    }
  }

  const handleUpdateBook = async (id: string, updates: Partial<Book>) => {
    try {
      const updatedBook = await updateBook(id, updates)
      setBooks(books.map((book: Book) => (book.id === id ? updatedBook : book)))
    } catch (error) {
      console.error("Error updating book:", error)
      alert("Failed to update book. Please try again.")
    }
  }

  const handleDeleteBook = async (id: string) => {
    if (!confirm("Are you sure you want to delete this book?")) {
      return
    }
    try {
      await deleteBook(id)
      setBooks(books.filter((book: Book) => book.id !== id))
    } catch (error) {
      console.error("Error deleting book:", error)
      alert("Failed to delete book. Please try again.")
    }
  }

  const handleViewNotes = (book: Book) => {
    setSelectedBook(book)
    setIsNotesModalOpen(true)
  }

  const handleSaveNotes = async (notes: string) => {
    if (!selectedBook) return
    await handleUpdateBook(selectedBook.id, { notes })
    setIsNotesModalOpen(false)
    setSelectedBook(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAddBook={() => setIsAddModalOpen(true)} />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <FilterBar filter={filter} onFilterChange={setFilter} />
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading books...</p>
          </div>
        ) : (
          <BookList
            books={filteredBooks}
            onUpdateStatus={(id, status) => handleUpdateBook(id, { status })}
            onDelete={handleDeleteBook}
            onViewNotes={handleViewNotes}
          />
        )}
      </div>

      <AddBookModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddBook}
      />

      <NotesModal
        isOpen={isNotesModalOpen}
        onClose={() => {
          setIsNotesModalOpen(false)
          setSelectedBook(null)
        }}
        book={selectedBook}
        onSave={handleSaveNotes}
      />
    </div>
  )
}

export default App

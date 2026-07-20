"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import backButton from "@/components/backButton"
import { Link, useNavigate } from "react-router-dom"
import { uiKWSInput } from "@/ros/ros"
import SearchBar from "@/components/searchBar"

// ==========================
// TYPES
// ==========================

type Book = {
  id: number
  title: string
  author?: string
  short_description?: string
  categories?: string[]
  total_copies?: number
  image?: string
}

type Category = {
  name: string
  books: Book[]
}

// ==========================
// MAIN COMPONENT
// ==========================

export default function BookTable() {
  const [categories, setCategories] = useState<Category[]>([])
  const scrollRef = useRef<HTMLDivElement | null>(null)

  // Vertical drag state
  const [isDown, setIsDown] = useState(false)
  const [startY, setStartY] = useState(0)
  const [scrollTop, setScrollTop] = useState(0)

  // ==========================
  // FETCH BOOKS FROM FASTAPI
  // ==========================
  useEffect(() => {
    fetch("http://localhost:8000/manage/book/get_type")
      .then((res) => res.json())
      .then((data) => {
        const grouped: Record<string, Book[]> = {}

        data.forEach((book: any) => {
          const category = book.categories?.[0] || "Uncategorized"

          if (!grouped[category]) {
            grouped[category] = []
          }

          grouped[category].push({
            id: book.id,
            title: book.title,
            author: book.author,
            short_description: book.short_description,
            categories: book.categories,
            total_copies: book.total_copies,
            image: `http://localhost:8000/server_data${book.image}`
          })
        })

        const formatted: Category[] = Object.keys(grouped).map((key) => ({
          name: key,
          books: grouped[key]
        }))

        setCategories(formatted)
      })
      .catch((err) => console.error("Failed to fetch books:", err))
  }, [])

  // ==========================
  // VERTICAL DRAG SCROLL
  // ==========================

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return
    setIsDown(true)
    setStartY(e.pageY - scrollRef.current.offsetTop)
    setScrollTop(scrollRef.current.scrollTop)
  }

  const handleMouseLeave = () => setIsDown(false)
  const handleMouseUp = () => setIsDown(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !scrollRef.current) return
    e.preventDefault()
    const y = e.pageY - scrollRef.current.offsetTop
    const walk = (y - startY) * 1.5
    scrollRef.current.scrollTop = scrollTop - walk
  }

  const navigate = useNavigate();
  useEffect(() => {
    if (!uiKWSInput) return;

    let timeout: ReturnType<typeof setTimeout> | null = null;

    const callback = (msg: any) => {
      console.log("Received message on /ui/kws:", msg);

      if (msg.data == "kembali") {
        navigate(-1);
      }
      else if(msg.data == "carikan buku"){
        navigate("/book");
      }

    };

    uiKWSInput.subscribe(callback);

    return () => {
      uiKWSInput.unsubscribe(callback);
      if (timeout) clearTimeout(timeout);
    };
  }, [uiKWSInput, navigate]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-brand text-white px-12 pt-20 select-none">
      {backButton()}
      <SearchBar />
      <div
        ref={scrollRef}
        className="h-full overflow-y-auto no-scrollbar space-y-12 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        
        {categories.map((category, index) => (
          <CategoryRow key={index} category={category} />
        ))}
      </div>
    </div>
  )
}

// ==========================
// CATEGORY ROW (HORIZONTAL DRAG)
// ==========================

function CategoryRow({ category }: { category: Category }) {
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const [isDown, setIsDown] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return
    setIsDown(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const handleMouseLeave = () => setIsDown(false)
  const handleMouseUp = () => setIsDown(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 1.5
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  return (
    <div className="mb-0">
      <h2 className="text-2xl font-bold">{category.name}</h2>

      <div
        ref={scrollRef}
        className="flex h-00 gap-x-6 overflow-x-auto overflow-y-hidden cursor-grab active:cursor-grabbing no-scrollbar"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {category.books.map((book) => (
          <Link key={book.id} to={`/book/${book.id}`}>
            <div className="min-w-[200px] transition-transform duration-300 hover:scale-110 hover:z-10">
              <Card className="bg-transparent border-none shadow-none my-0">
                <div className="relative">
                  <img
                    src={book.image}
                    alt={book.title}
                    draggable={false}
                    className="rounded-xl object-cover h-[300px] w-full pointer-events-none"
                  />

                  <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition rounded-xl flex items-end p-4">
                    <div>
                      <p className="text-sm font-semibold">{book.title}</p>
                      <p className="text-xs opacity-80">{book.author}</p>
                      <p className="text-xs opacity-70 mt-1">
                        Copies: {book.total_copies}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </Link>
        ))}


      </div>
    </div>
  )
}
"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import backButton from "@/components/backButton"


export default function BookManagerPage() {
    const [activeTab, setActiveTab] = useState("types")

    type Book = {
        id: number
        title: string
        author: string
        categories: string[]
        short_description: string
        total_copies?: number
    }

    type Tags = {
        id: number
        minor_tag: string
    }

    type BookCopies = {
        id: string
        bookTitle: string
        status: string
    }

    const [books, setBooks] = useState<Book[]>([])
    const [tags, setTags] = useState<Tags[]>([])
    const [copies, setCopies] = useState<BookCopies[]>([])
    const [loading, setLoading] = useState(true)

    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("")

    useEffect(() => {
        const init = async () => {
            setLoading(true)

            try {
                const [booksRes, tagsRes,copiesRes] = await Promise.all([
                    fetch("http://localhost:8000/manage/book/get_type"),
                    fetch("http://localhost:8000/manage/book/get_minor_tag"),
                    fetch("http://localhost:8000/manage/book/get_status")
                ])

                const booksData = await booksRes.json()
                const tagsData = await tagsRes.json()
                const copiesData = await copiesRes.json()

                setBooks(booksData)
                setTags(tagsData)
                setCopies(copiesData)

            } catch (error) {
                console.error("Initialization failed:", error)
            } finally {
                setLoading(false)
            }
        }

        init()
    }, [])



    const fetchBooks = async () => {
        setLoading(true)

        const params = new URLSearchParams()

        if (search) params.append("search", search)
        if (category) params.append("category", category)

        const response = await fetch(
            `http://localhost:8000/manage/book/get_type?${params.toString()}`
        )

        const data = await response.json()
        setBooks(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchBooks()
    }, [])

    return (
        <div className="p-18 space-y-6">
            {backButton()}

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">📚 Book Manager</CardTitle>
                </CardHeader>

                <CardContent>

                    <Tabs value={activeTab} onValueChange={setActiveTab}>

                        <TabsList>
                            <TabsTrigger value="types">Book Types</TabsTrigger>
                            <TabsTrigger value="copies">Book Copies</TabsTrigger>
                        </TabsList>

                        {/* ================= BOOK TYPES TAB ================= */}
                        <TabsContent value="types">
                            <div className="flex gap-4">

                                <input
                                    placeholder="Search title or author..."
                                    value={search}
                                    onChange={(e: any) => setSearch(e.target.value)}
                                />

                                <Select
                                    value={category}
                                    onValueChange={(value) => setCategory(value)}
                                >
                                    <SelectTrigger className="w-[200px]">
                                        <SelectValue placeholder="Filter by category" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>

                                        {tags.map((tag) => (
                                            <SelectItem key={tag.id} value={tag.minor_tag}>
                                                {tag.minor_tag}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Button onClick={fetchBooks}>
                                    Apply
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearch("")
                                        setCategory("")
                                        fetchBooks()
                                    }}
                                >
                                    Reset
                                </Button>
                            </div>
                            <table className="w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Author</TableHead>
                                        <TableHead>Categories</TableHead>
                                        <TableHead>Total Copies</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>

                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={4}>Loading...</TableCell>
                                        </TableRow>
                                    ) : (

                                        books.map((book) => (
                                            <TableRow key={book.id}>
                                                <TableCell>{book.title}</TableCell>
                                                <TableCell>{book.author}</TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2 flex-wrap">
                                                        {book.categories?.map((cat) => (
                                                            <Badge key={cat} variant="secondary">
                                                                {cat}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{book.total_copies ?? "-"}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </table>
                        </TabsContent>

                        {/* ================= BOOK COPIES TAB ================= */}
                        <TabsContent value="copies">
                            <div className="mt-6">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Copy ID</TableHead>
                                            <TableHead>Book Title</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {copies.map((copy) => (
                                            <TableRow key={copy.id}>
                                                <TableCell>{copy.id}</TableCell>
                                                <TableCell>{copy.bookTitle}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            copy.status === "available"
                                                                ? "secondary"
                                                                : copy.status === "borrowed"
                                                                    ? "default"
                                                                    : "destructive"
                                                        }
                                                    >
                                                        {copy.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>

                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
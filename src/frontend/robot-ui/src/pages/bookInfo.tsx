import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Card } from "@/components/ui/card"
import BackButton from "@/components/backButton"
import { Link } from "react-router-dom"

type Book = {
    id: number
    title: string
    author?: string
    short_description?: string
    categories?: string[]
    total_copies?: number
    image?: string
}

export default function BookInfo() {
    const { id } = useParams()

    const [book, setBook] = useState<Book | null>(null)

    useEffect(() => {
        fetch(`http://localhost:8000/manage/book/get_type/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setBook({
                    ...data,
                    image: `http://localhost:8000/server_data${data.image}`
                })
            })
    }, [id])

    if (!book) return <div className="p-10">Loading...</div>

    type NavBoxProps = {
        subtitle: string;
        go_to: string;
    };

    const NavBox = ({ subtitle, go_to }: NavBoxProps) => {
        return (
            <Link to={go_to}>
                <div className="p-10 text-center text-xl px-3 py-1 bg-brand/15 text-brand-dark rounded-full">
                    <h2>{subtitle}</h2>
                </div>
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-brand p-10 flex justify-center">
            <BackButton />
            <Card className="max-w-4xl w-full p-8">

                <div className="grid grid-cols-2 gap-8">

                    <img
                        src={book.image}
                        className="rounded-xl"
                    />

                    <div className="space-y-4">

                        <h1 className="text-3xl font-bold">{book.title}</h1>

                        <p className="text-lg">{book.author}</p>

                        <p>{book.short_description}</p>

                        <p className="text-sm text-gray-500">
                            Copies Available: {book.total_copies}
                        </p>

                        <div className="flex gap-2">
                            {book.categories?.map((cat) => (
                                <span
                                    key={cat}
                                    className="px-3 py-1 text-xs bg-brand-dark/10 text-brand-dark rounded-full"
                                >
                                    {cat}
                                </span>
                            ))}
                        </div>

                        <div className="flex gap-2 my-10">
                        <NavBox subtitle="Pinjam buku" />
                        <NavBox subtitle="Baca online" />
                        <NavBox subtitle="Dibacakan Robobook" />
                        </div>
                    </div>

                </div>

            </Card>

        </div>
    )
}
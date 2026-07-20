"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


import { Badge } from "@/components/ui/badge"
import backButton from "@/components/backButton"
import {
    Combobox,
    ComboboxInput,
    ComboboxChip,
    ComboboxChips,
    ComboboxChipsInput,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxItem,
    ComboboxList,
    ComboboxValue,
    useComboboxAnchor,
} from "@/components/ui/combobox"
import React, { type Dispatch, type SetStateAction } from "react"

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"





export default function NewBookPage() {
    const [activeTab, setActiveTab] = useState("types")
    const [minorTags, setMinorTags] = useState<minor_Tags[]>([])
    const [majorTags, setMajorTags] = useState<major_Tags[]>([])
    const [message, setMessage] = useState<string | null>(null);
    const anchor = useComboboxAnchor()


    type minor_Tags = {
        id: number
        minor_tag: string
        major_tag_id: number
    }

    type major_Tags = {
        id: number
        major_tag: string
    }


    const [formBookData, setFormBookData] = useState({
        title: "",
        author: "",
        categories: [] as string[],
        status: "",
        description: "",
        coverFile: File ,
        coverPreview: ""
    })


    const [formMajorData, setFormMajorData] = useState({
        major_tag: "",
    })

    const [formMinorData, setFormMinorData] = useState({
        major_tag: "",
        minor_tag: ""
    })




    useEffect(() => {
        const init = async () => {

            try {
                const [minorTagsRes, majorTagsRes] = await Promise.all([
                    fetch("http://localhost:8000/manage/book/get_minor_tag"),
                    fetch("http://localhost:8000/manage/book/get_major_tag"),
                ])

                const minorTagsData = await minorTagsRes.json()
                const majorTagsData = await majorTagsRes.json()

                setMinorTags(minorTagsData)
                setMajorTags(majorTagsData)

            } catch (error) {
                console.error("Initialization failed:", error)
            } finally {
            }
        }

        init()
    }, [])


    const fileInputRef = useRef<HTMLInputElement | null>(null)


    const handleImageUpload = (file: File) => {
        const previewUrl = URL.createObjectURL(file)

        setFormBookData((prev: any) => ({
            ...prev,
            coverFile: file,
            coverPreview: previewUrl,
        }))
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        if (file && file.type.startsWith("image/")) {
            handleImageUpload(file)
        }
    }

    const handleChange = <T, K extends keyof T>(
        field: K,
        value: T[K],
        setState: Dispatch<SetStateAction<T>>
    ) => {
        setState((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleBookSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const form = new FormData()

        form.append("title", formBookData.title)
        form.append("author", formBookData.author)
        form.append("short_description", formBookData.description)
        form.append("categories", JSON.stringify(formBookData.categories))
        form.append("image", formBookData.coverFile)

        const res = await fetch("http://localhost:8000/manage/book/create_book_type", {
            method: "POST",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            body: form
        })

        const data = await res.json()
        console.log(data)
    }

    const handleMinorSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const form = new FormData()

        form.append("major_tag", formMinorData.major_tag) // <= number of id major tag
        form.append("name", formMinorData.minor_tag)
        console.log(formMinorData.major_tag)

        try {
            const res = await fetch("http://localhost:8000/manage/book/create_minor_tag", {
                method: "POST",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                body: form
            })

            const data = await res.json()
            console.log(data)
            setMessage(data.message || "Minor Tag created successfully");
            setTimeout(() => {
                setMessage(null);
            }, 3000);
        }


        catch (error) {
            setMessage("Error creating book");
        }
    }


    const handleMajorSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const form = new FormData()

        form.append("name", formMajorData.major_tag)

        try {
            const res = await fetch("http://localhost:8000/manage/book/create_major_tag", {
                method: "POST",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                body: form
            })

            const data = await res.json()
            console.log(data)
            setMessage(data.message || "Book created successfully");
            setTimeout(() => {
                setMessage(null);
            }, 3000);
        }


        catch (error) {
            setMessage("Error creating book");
        }
    }



    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-start p-8">
            {backButton()}
            <Card className="w-full max-w-2xl shadow-lg">
                <Tabs value={activeTab} onValueChange={setActiveTab}>

                    <TabsList className=" flex gap-3 mx-5">
                        <TabsTrigger value="book">New Book</TabsTrigger>
                        <TabsTrigger value="copy">New Copies</TabsTrigger>
                        <TabsTrigger value="major">New Major Tag</TabsTrigger>
                        <TabsTrigger value="minor">New Minor Tag</TabsTrigger>
                    </TabsList>


                    <TabsContent value="book">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">
                                📘 Add New Book
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleBookSubmit} className="space-y-6">

                                {/* Title */}
                                <div className="space-y-2">
                                    <Label>Book Title</Label>
                                    <Input
                                        placeholder="Enter book title"
                                        value={formBookData.title}
                                        onChange={(e) => handleChange("title", e.target.value, setFormBookData)}
                                        required
                                    />
                                </div>

                                {/* Author */}
                                <div className="space-y-2">
                                    <Label>Author</Label>
                                    <Input
                                        placeholder="Enter author name"
                                        value={formBookData.author}
                                        onChange={(e) => handleChange("author", e.target.value, setFormBookData)}
                                        required
                                    />
                                </div>



                                {/* Category Multi Select */}
                                <div className="space-y-2">
                                    <Label>Categories</Label>
                                    <Combobox
                                        multiple
                                        value={formBookData.categories}
                                        onValueChange={(values: string[]) =>
                                            setFormBookData((prev) => ({ ...prev, categories: values }))
                                        }
                                        items={minorTags.map((t) => t.minor_tag)}
                                    >
                                        <ComboboxChips ref={anchor} className="w-full">
                                            <ComboboxValue>
                                                {(selected) => (
                                                    <>
                                                        {selected.map((value: string) => (
                                                            <ComboboxChip key={value}>{value}</ComboboxChip>
                                                        ))}
                                                        <ComboboxChipsInput />
                                                    </>
                                                )}
                                            </ComboboxValue>
                                        </ComboboxChips>

                                        <ComboboxContent anchor={anchor}>
                                            <ComboboxEmpty>No categories found.</ComboboxEmpty>
                                            <ComboboxList>
                                                {(item: string) => (
                                                    <ComboboxItem key={item} value={item}>
                                                        {item}
                                                    </ComboboxItem>
                                                )}
                                            </ComboboxList>
                                        </ComboboxContent>
                                    </Combobox>
                                </div>



                                {/* Description */}
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        placeholder="Write short description..."
                                        value={formBookData.description}
                                        onChange={(e) => handleChange("description", e.target.value, setFormBookData)}
                                    />
                                </div>

                                {/* Cover Image URL */}
                                <div className="space-y-2">
                                    <Label>Book Cover</Label>

                                    <div
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-muted transition"
                                    >
                                        {formBookData.coverPreview ? (
                                            <div className="space-y-4">
                                                <img
                                                    src={formBookData.coverPreview}
                                                    alt="Preview"
                                                    className="mx-auto h-48 object-contain rounded-lg"
                                                />
                                                <Button type="button" variant="secondary">
                                                    Change Image
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="text-muted-foreground">
                                                <p className="font-medium">Drag & drop image here</p>
                                                <p className="text-sm">or click to upload</p>
                                            </div>
                                        )}
                                    </div>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        ref={fileInputRef}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file) handleImageUpload(file)
                                        }}
                                    />
                                </div>

                                {/* Submit */}
                                <div className="flex justify-end gap-4">
                                    <Button type="button" variant="ghost">
                                        Cancel
                                    </Button>
                                    <Button type="submit">
                                        Save Book
                                    </Button>
                                </div>

                                <div className="flex justify-end gap-4">

                                </div>

                            </form>
                        </CardContent>
                    </TabsContent>

                    <TabsContent value="major">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">
                                📘 Add Major Tag
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleMajorSubmit} className="space-y-6">

                                {/* Title */}
                                <div className="space-y-2">
                                    <Label>Major Tag</Label>
                                    <Input
                                        placeholder="Enter Major Tag (i.e. Pendidikan, Fiksi)"
                                        value={formMajorData.major_tag}
                                        onChange={(e) => handleChange("major_tag", e.target.value, setFormMajorData)}
                                        required
                                    />
                                </div>



                                {/* Submit */}
                                <div className="flex justify-end gap-4">
                                    <Button type="button" variant="ghost">
                                        Cancel
                                    </Button>
                                    <Button type="submit">
                                        Save Major Tag
                                    </Button>
                                </div>

                                <div className="flex justify-end gap-4">
                                    {message && (
                                        <Alert>
                                            <AlertDescription>
                                                {message}
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                            </form>
                        </CardContent>
                    </TabsContent>

                    <TabsContent value="minor">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">
                                📘 Add Minor Tag
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleMinorSubmit} className="space-y-6">

                                <div className="space-y-2">
                                    <Label>Major Tag</Label>

                                    <Combobox
                                        items={majorTags}
                                        value={formMinorData.major_tag}
                                        onValueChange={(value) =>
                                            setFormMinorData((prev) => ({ ...prev, major_tag: value }))
                                        }
                                    >
                                        <ComboboxInput
                                            placeholder="(i.e Pendidikan, Fiksi)"
                                            value={
                                                majorTags.find(
                                                    (tag) => String(tag.id) === String(formMinorData.major_tag)
                                                )?.major_tag || ""
                                            }
                                            readOnly
                                        />

                                        <ComboboxContent>
                                            <ComboboxEmpty>No items found.</ComboboxEmpty>

                                            <ComboboxList>
                                                {(item) => (
                                                    <ComboboxItem key={item.id} value={String(item.id)}>
                                                        {item.major_tag}
                                                    </ComboboxItem>
                                                )}
                                            </ComboboxList>
                                        </ComboboxContent>
                                    </Combobox>
                                </div>


                                {/* Title */}
                                <div className="space-y-2">
                                    <Label>Minor Tag</Label>
                                    <Input
                                        placeholder="Enter Minor Tag (i.e. Cerita Anak, Buku paket)"
                                        value={formMinorData.minor_tag}
                                        onChange={(e) => handleChange("minor_tag", e.target.value, setFormMinorData)}
                                        required
                                    />
                                </div>




                                {/* Submit */}
                                <div className="flex justify-end gap-4">
                                    <Button type="button" variant="ghost">
                                        Cancel
                                    </Button>
                                    <Button type="submit">
                                        Save Minor Tag
                                    </Button>
                                </div>

                            </form>
                        </CardContent>
                    </TabsContent>

                </Tabs>
            </Card>
        </div>
    )
}
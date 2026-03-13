"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LucideMic } from "lucide-react";

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const [language, setLanguage] = useState("en");

    const handleMicClick = () => {
        console.log("Mic clicked! Implement voice recognition here.");
    };

    const handleSearch = () => {
        console.log("Searching for:", query, "in language:", language);
    };

    return (
        <div className="flex items-center gap-2 p-2 bg-white shadow rounded-lg max-w-lg mx-auto">
            {/* Search Input */}
            <Input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 text-black"
            />

            {/* Microphone Button */}
            <Button
                variant="outline"
                onClick={handleMicClick}
                className="p-2 text-black hover:bg-blue-500 hover:text-white hover:scale-105 transition-all duration-200"
            >
                <LucideMic className="w-5 h-5" />
            </Button>

            {/* Language Selector */}
            <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-24">
                    <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="id">Bahasa Indonesia</SelectItem>
                    <SelectItem value="jp">日本語</SelectItem>
                    {/* Add more languages as needed */}
                </SelectContent>
            </Select>

            {/* Search Button */}
            <Button onClick={handleSearch}>Search</Button>
        </div>
    );
}
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { useNavigate } from "react-router"

const borrowData = [
  { month: "Jan", books: 40 },
  { month: "Feb", books: 55 },
  { month: "Mar", books: 75 },
  { month: "Apr", books: 60 },
  { month: "May", books: 90 },
]

const recentBorrowers = [
  { name: "Alice", book: "Harry Potter", status: "Borrowed" },
  { name: "Budi", book: "Atomic Habits", status: "Returned" },
  { name: "Siti", book: "Deep Learning 101", status: "Overdue" },
]

// const navigate = useNavigate();

export default function LibrarianDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 space-y-6">
        <h2 className="text-2xl font-bold">📚 Library Admin</h2>
        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/books/manage")}>
            Manage Books
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Members
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Reports
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-8">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={() => navigate("/books/new")}>
            Add New Book
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Books</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">1,240</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Borrowed Today</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">32</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Overdue Books</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-500">12</p>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Borrow Activity</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={borrowData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="books" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Borrowers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Book</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBorrowers.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.book}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === "Returned"
                            ? "default"
                            : item.status === "Overdue"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </main>
    </div>
  )
}
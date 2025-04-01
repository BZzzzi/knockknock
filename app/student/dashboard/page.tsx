"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, CalendarIcon, Clock, User, BookOpen, X, CheckCircle2, Clock3 } from "lucide-react"
import { StudentDashboardSidebar } from "@/components/student-dashboard-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import Link from "next/link"
import { ko } from "date-fns/locale/ko"

// Mock data for professors
const professors = [
  {
    id: 1,
    name: "김병정 교수님",
    department: "소프트웨어 융합 대학",
    email: "smith@university.edu",
    office: "CS-101",
    phone: "123-456-7890",
  },
  {
    id: 2,
    name: "김선정 교수님",
    department: "소프트웨어 융합 대학",
    email: "johnson@university.edu",
    office: "MATH-202",
    phone: "123-456-7891",
  },
  {
    id: 3,
    name: "신미영 교수님",
    department: "소프트웨어 융합 대학",
    email: "williams@university.edu",
    office: "PHY-303",
    phone: "123-456-7892",
  },
  {
    id: 4,
    name: "주한규 교수님",
    department: "소프트웨어 융합 대학",
    email: "brown@university.edu",
    office: "CHEM-404",
    phone: "123-456-7893",
  },
  {
    id: 5,
    name: "송성호 교수님",
    department: "소프트웨어 융합 대학",
    email: "jones@university.edu",
    office: "BIO-505",
    phone: "123-456-7894",
  },
  {
    id: 6,
    name: "안재목 교수님",
    department: "소프트웨어 융합 대학",
    email: "miller@university.edu",
    office: "CS-606",
    phone: "123-456-7895",
  },
  {
    id: 7,
    name: "장한진 교수님",
    department: "교양",
    email: "davis@university.edu",
    office: "MATH-707",
    phone: "123-456-7896",
  },
  {
    id: 8,
    name: "홍길동 교수님",
    department: "심리학과",
    email: "applepie421@naver.com",
    office: "11111",
    phone: "010-1234-9822",
  },
  {
    id: 9,
    name: "김철수 교수님",
    department: "간호학과",
    email: "lhs103725@gmail.com",
    office: "12344",
    phone: "010-4323-5544"
  },
  {
    id: 10,
    name: "이영희 교수님",
    department: "광고홍보학과",
    email: "qwe321@naver.com",
    office: "42312",
    phone: "010-3213-4934"
  },
]

// Mock data for departments
const departments = ["소프트웨어 융합 대학","교양","심리학과","간호학과","광고홍보학과"]

// Extended mock data for available consultation slots
const availableSlots = [
  // March 2025
  { date: new Date(2025, 2, 25), times: ["09:00", "10:00", "11:00", "14:00", "15:00"] },
  { date: new Date(2025, 2, 26), times: ["10:30", "11:30", "13:30", "16:00"] },
  { date: new Date(2025, 2, 27), times: ["09:30", "12:00", "14:30", "16:30"] },
  { date: new Date(2025, 2, 28), times: ["10:00", "11:00", "13:00", "14:00", "15:00", "16:00"] },
  { date: new Date(2025, 2, 29), times: ["09:00", "10:00", "11:00", "13:00", "14:00"] },
  { date: new Date(2025, 2, 31), times: ["10:00", "11:30", "14:00", "15:30"] },

  // April 2025
  { date: new Date(2025, 3, 1), times: ["09:00", "10:30", "13:00", "14:30", "15:00", "16:00"] },
  { date: new Date(2025, 3, 2), times: ["09:30", "11:00", "13:30", "15:00"] },
  { date: new Date(2025, 3, 3), times: ["10:00", "11:30", "14:00", "15:30"] },
  { date: new Date(2025, 3, 4), times: ["09:00", "10:30", "13:00", "14:30", "16:00"] },
  { date: new Date(2025, 3, 7), times: ["09:30", "11:00", "13:30", "15:00", "16:30"] },
  { date: new Date(2025, 3, 8), times: ["10:00", "11:30", "14:00", "15:30"] },
  { date: new Date(2025, 3, 9), times: ["09:00", "10:30", "13:00", "14:30", "16:00"] },
  { date: new Date(2025, 3, 10), times: ["09:30", "11:00", "13:30", "15:00"] },
  { date: new Date(2025, 3, 11), times: ["10:00", "11:30", "14:00", "15:30", "16:30"] },
  { date: new Date(2025, 3, 14), times: ["09:00", "10:30", "13:00", "14:30", "16:00"] },
  { date: new Date(2025, 3, 15), times: ["09:30", "11:00", "13:30", "15:00"] },
  { date: new Date(2025, 3, 16), times: ["10:00", "11:30", "14:00", "15:30"] },
  { date: new Date(2025, 3, 17), times: ["09:00", "10:30", "13:00", "14:30", "16:00"] },
  { date: new Date(2025, 3, 18), times: ["09:30", "11:00", "13:30", "15:00", "16:30"] },
  { date: new Date(2025, 3, 21), times: ["10:00", "11:30", "14:00", "15:30"] },
  { date: new Date(2025, 3, 22), times: ["09:00", "10:30", "13:00", "14:30", "16:00"] },
  { date: new Date(2025, 3, 23), times: ["09:30", "11:00", "13:30", "15:00"] },
  { date: new Date(2025, 3, 24), times: ["10:00", "11:30", "14:00", "15:30", "16:30"] },
  { date: new Date(2025, 3, 25), times: ["09:00", "10:30", "13:00", "14:30", "16:00"] },
  { date: new Date(2025, 3, 28), times: ["09:30", "11:00", "13:30", "15:00"] },
  { date: new Date(2025, 3, 29), times: ["10:00", "11:30", "14:00", "15:30"] },
  { date: new Date(2025, 3, 30), times: ["09:00", "10:30", "13:00", "14:30", "16:00"] },

  // May 2025
  { date: new Date(2025, 4, 1), times: ["09:30", "11:00", "13:30", "15:00", "16:30"] },
  { date: new Date(2025, 4, 2), times: ["10:00", "11:30", "14:00", "15:30"] },
  { date: new Date(2025, 4, 5), times: ["09:00", "10:30", "13:00", "14:30", "16:00"] },
  { date: new Date(2025, 4, 6), times: ["09:30", "11:00", "13:30", "15:00"] },
  { date: new Date(2025, 4, 7), times: ["10:00", "11:30", "14:00", "15:30", "16:30"] },
  { date: new Date(2025, 4, 8), times: ["09:00", "10:30", "13:00", "14:30", "16:00"] },
  { date: new Date(2025, 4, 9), times: ["09:30", "11:00", "13:30", "15:00"] },
  { date: new Date(2025, 4, 12), times: ["10:00", "11:30", "14:00", "15:30"] },
  { date: new Date(2025, 4, 13), times: ["09:00", "10:30", "13:00", "14:30", "16:00"] },
  { date: new Date(2025, 4, 14), times: ["09:30", "11:00", "13:30", "15:00", "16:30"] },
  { date: new Date(2025, 4, 15), times: ["10:00", "11:30", "14:00", "15:30"] },
]

// Mock data for applications
const initialApplications = [
  {
    id: 1,
    professorName: "김병정 교수님",
    date: "3월 28, 2025",
    time: "10:00",
    reason: "상담",
    status: "확인",
  },
  {
    id: 2,
    professorName: "김선정 교수님",
    date: "3월 29, 2025",
    time: "09:00",
    reason: "상담",
    status: "보류 중",
  },
]

export default function StudentDashboard() {
  const [selectedProfessor, setSelectedProfessor] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentSearchTerm, setDepartmentSearchTerm] = useState("")
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedTime, setSelectedTime] = useState("")
  const [consultationReason, setConsultationReason] = useState("")
  const [applications, setApplications] = useState(initialApplications)

  // Filter professors based on search term
  const filteredProfessors = professors.filter(
    (professor) =>
      professor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professor.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Filter professors by department
  const professorsByDepartment = departments
    .filter((dept) => dept.toLowerCase().includes(departmentSearchTerm.toLowerCase()))
    .map((dept) => ({
      department: dept,
      professors: professors.filter((prof) => prof.department === dept),
    }))

  // Check if a date has available slots
  const isDateAvailable = (date) => {
    return availableSlots.some(
      (slot) =>
        slot.date.getDate() === date.getDate() &&
        slot.date.getMonth() === date.getMonth() &&
        slot.date.getFullYear() === date.getFullYear(),
    )
  }

  // Get available times for a selected date
  const getAvailableTimes = (date) => {
    if (!date) return []

    const slot = availableSlots.find(
      (slot) =>
        slot.date.getDate() === date.getDate() &&
        slot.date.getMonth() === date.getMonth() &&
        slot.date.getFullYear() === date.getFullYear(),
    )

    return slot ? slot.times : []
  }

  // Handle booking submission
  const handleBookConsultation = () => {
    if (!selectedProfessor || !selectedDate || !selectedTime || !consultationReason) {
      return
    }

    const formattedDate = selectedDate.toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })

    const newApplication = {
      id: applications.length + 1,
      professorName: selectedProfessor.name,
      date: formattedDate,
      time: selectedTime,
      reason: consultationReason,
      status: "Pending",
    }

    setApplications([...applications, newApplication])
    setIsBookingModalOpen(false)
    setSelectedTime("")
    setConsultationReason("")
  }

  // Handle application cancellation
  const handleCancelApplication = (id) => {
    setApplications(applications.filter((app) => app.id !== id))
  }

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString("ko-KR", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <StudentDashboardSidebar activePage="dashboard" />

        <main className="flex-1 p-6">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight">학생 화면</h1>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" asChild className="rounded-full">
                  <Link href="/student/profile">
                    <User className="mr-2 h-4 w-4" />
                    내 정보
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Professor Search Section */}
              <div className="md:col-span-1 space-y-6">
                <Card className="overflow-hidden border-none shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-4">
                    <CardTitle>검색</CardTitle>
                    <CardDescription>이름을 입력하세요</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="flex space-x-2">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="교수님을 검색하세요"
                            className="pl-8 rounded-full border-muted bg-background/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                      <Button variant="outline" onClick={() => setIsDepartmentModalOpen(true)} className="rounded-full">
                        <BookOpen className="h-4 w-4" />
                      </Button>
                    </div>

                    <ScrollArea className="h-[300px] pr-4">
                      <div className="space-y-2">
                        {filteredProfessors.map((professor) => (
                          <div
                            key={professor.id}
                            className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                              selectedProfessor?.id === professor.id
                                ? "bg-primary text-primary-foreground shadow-md"
                                : "hover:bg-muted/50 hover:shadow-sm"
                            }`}
                            onClick={() => setSelectedProfessor(professor)}
                          >
                            <div className="font-medium">{professor.name}</div>
                            <div className="text-sm opacity-90">{professor.department}</div>
                          </div>
                        ))}
                        {filteredProfessors.length === 0 && (
                          <div className="p-3 text-center text-muted-foreground">찾으시는 교수님이 없습니다</div>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Professor Details */}
                {selectedProfessor && (
                  <Card className="overflow-hidden border-none shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-secondary/20 to-secondary/10 pb-4">
                      <CardTitle>세부 정보</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-6">
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">이름</div>
                          <div className="font-medium">{selectedProfessor.name}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-muted/30">
                          <div className="text-sm font-medium text-muted-foreground">소속</div>
                          <div>{selectedProfessor.department}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/30">
                          <div className="text-sm font-medium text-muted-foreground">계시는 곳</div>
                          <div>{selectedProfessor.office}</div>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-muted/30">
                        <div className="text-sm font-medium text-muted-foreground">이메일</div>
                        <div className="text-primary">{selectedProfessor.email}</div>
                      </div>

                      <div className="p-3 rounded-lg bg-muted/30">
                        <div className="text-sm font-medium text-muted-foreground">연락처</div>
                        <div>{selectedProfessor.phone}</div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Calendar and Applications Section */}
              <div className="md:col-span-2 space-y-6">
                <Tabs defaultValue="calendar" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 rounded-full p-1 bg-muted/50">
                    <TabsTrigger
                      value="calendar"
                      className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      상담 일정
                    </TabsTrigger>
                    <TabsTrigger
                      value="applications"
                      className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm"
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      내 신청
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="calendar" className="space-y-4 mt-6">
                    <Card className="overflow-hidden border-none shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-4">
                        <CardTitle>일정표</CardTitle>
                        <CardDescription>이용 가능한 날짜에 예약을 신청하세요</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="flex justify-center">
                          <div className="w-full max-w-md">
                            <div>
                              <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                disabled={(date) => !isDateAvailable(date)}
                                locale={ko}
                                className="mx-auto"
                                classNames={{
                                  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                                  month: "space-y-4 w-full",
                                  caption: "flex justify-center pt-1 relative items-center mb-2",
                                  caption_label: "text-lg font-medium",
                                  nav: "space-x-1 flex items-center",
                                  nav_button: "h-10 w-10 bg-transparent p-0 hover:opacity-70 transition-opacity",
                                  nav_button_previous: "absolute left-1",
                                  nav_button_next: "absolute right-1",
                                  table: "w-full border-collapse space-y-1",
                                  head_row: "flex w-full",
                                  head_cell:
                                    "w-14 h-14 sm:w-16 sm:h-16 font-medium text-muted-foreground rounded-md flex items-center justify-center",
                                  row: "flex w-full mt-2",
                                  cell: "w-14 h-14 sm:w-16 sm:h-16 text-center text-sm relative p-0 focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent rounded-md",
                                  day: "h-14 w-14 sm:h-16 sm:w-16 p-0 font-normal aria-selected:opacity-100 rounded-full flex items-center justify-center text-base transition-colors",
                                  day_selected:
                                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground shadow-md",
                                  day_today: "bg-accent text-accent-foreground",
                                  day_outside: "text-muted-foreground opacity-50",
                                  day_disabled: "text-muted-foreground opacity-50 cursor-not-allowed",
                                  day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                                  day_hidden: "invisible",
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        {selectedDate && (
                          <div className="mt-8 bg-muted/20 p-6 rounded-2xl">
                            <div className="flex items-center justify-center mb-4">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                                <Clock3 className="h-5 w-5" />
                              </div>
                              <h3 className="font-medium text-lg">
                                예약하실 월일 및 요일입니다. : {" "}
                                <span className="text-primary font-semibold">{formatDate(selectedDate)}</span>
                              </h3>
                            </div>
                            <div className="flex flex-wrap gap-2 justify-center">
                              {getAvailableTimes(selectedDate).map((time) => (
                                <Badge
                                  key={time}
                                  variant="outline"
                                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground text-base py-2 px-4 rounded-full transition-colors duration-200 border-primary/20 hover:border-transparent"
                                  onClick={() => {
                                    if (selectedProfessor) {
                                      setSelectedTime(time)
                                      setIsBookingModalOpen(true)
                                    } else {
                                      alert("원하시는 교수님을 먼저 선택해주세요")
                                    }
                                  }}
                                >
                                  {time}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="applications" className="space-y-4 mt-6">
                    <Card className="overflow-hidden border-none shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-4">
                        <CardTitle>나의 예약 신청 현황</CardTitle>
                        <CardDescription>상담 요청을 보고 관리하세요</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        {applications.length > 0 ? (
                          <div className="space-y-4">
                            {applications.map((app) => (
                              <div
                                key={app.id}
                                className="flex items-center justify-between p-4 border border-muted/50 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                              >
                                <div className="space-y-2">
                                  <div className="font-medium text-lg">{app.professorName}</div>
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {app.date} at {app.time}
                                  </div>
                                  <div className="text-sm">{app.reason}</div>
                                  <Badge
                                    variant={app.status === "Confirmed" ? "default" : "secondary"}
                                    className={`rounded-full px-3 ${app.status === "Confirmed" ? "bg-green-500/90" : "bg-amber-500/90"}`}
                                  >
                                    {app.status === "Confirmed" ? (
                                      <span className="flex items-center">
                                        <CheckCircle2 className="mr-1 h-3 w-3" />
                                        {app.status}
                                      </span>
                                    ) : (
                                      <span className="flex items-center">
                                        <Clock3 className="mr-1 h-3 w-3" />
                                        {app.status}
                                      </span>
                                    )}
                                  </Badge>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleCancelApplication(app.id)}
                                  disabled={app.status === "Confirmed"}
                                  className="rounded-full hover:bg-red-100 hover:text-red-500 transition-colors"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-xl">
                            <Clock className="h-12 w-12 mx-auto mb-3 text-muted-foreground/70" />
                            <p className="text-lg">아직 예약 신청 내역이 없습니다</p>
                            <p className="text-sm mt-1">원하시는 교수님을 선택하고 예약을 신청해보세요!</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </main>

        {/* Department Search Modal */}
        <Dialog open={isDepartmentModalOpen} onOpenChange={setIsDepartmentModalOpen}>
          <DialogContent className="sm:max-w-md rounded-2xl border-none shadow-lg">
            <DialogHeader>
              <DialogTitle>소속 목록</DialogTitle>
              <DialogDescription>원하시는 소속에 있는 교수님들을 보여드립니다</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="원하시는 소속을 검색하세요"
                  className="pl-8 rounded-full border-muted"
                  value={departmentSearchTerm}
                  onChange={(e) => setDepartmentSearchTerm(e.target.value)}
                />
              </div>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {professorsByDepartment.map((dept) => (
                    <div key={dept.department} className="bg-muted/20 rounded-xl p-3">
                      <h3 className="font-medium text-sm text-primary mb-2">{dept.department}</h3>
                      <div className="space-y-2">
                        {dept.professors.map((professor) => (
                          <div
                            key={professor.id}
                            className="p-2 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                            onClick={() => {
                              setSelectedProfessor(professor)
                              setIsDepartmentModalOpen(false)
                            }}
                          >
                            {professor.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {professorsByDepartment.length === 0 && (
                    <div className="p-6 text-center text-muted-foreground bg-muted/20 rounded-xl">
                      <BookOpen className="h-8 w-8 mx-auto mb-2 text-muted-foreground/70" />
                      <p>소속을 찾지 못했습니다</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDepartmentModalOpen(false)} className="rounded-full">
                닫기
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Booking Modal */}
        <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
          <DialogContent className="rounded-2xl border-none shadow-lg">
            <DialogHeader>
              <DialogTitle>상담 신청</DialogTitle>
              <DialogDescription>{selectedProfessor?.name}과의 상담 일정을 잡으세요</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date" className="text-sm font-medium">
                    날짜
                  </Label>
                  <div className="p-3 rounded-lg bg-muted/30 mt-1 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2 text-primary" />
                    <span>{selectedDate ? formatDate(selectedDate) : ""}</span>
                  </div>
                </div>
                <div>
                  <Label htmlFor="time" className="text-sm font-medium">
                    Time
                  </Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger className="mt-1 rounded-lg border-muted">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableTimes(selectedDate).map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="reason" className="text-sm font-medium">
                  상담 사유
                </Label>
                <Input
                  id="reason"
                  placeholder="당신의 상담신청 사유를 입력하세요"
                  value={consultationReason}
                  onChange={(e) => setConsultationReason(e.target.value)}
                  className="mt-1 rounded-lg border-muted"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsBookingModalOpen(false)} className="rounded-full">
                닫기
              </Button>
              <Button onClick={handleBookConsultation} className="rounded-full">
                신청하기
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarProvider>
  )
}


"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StudentDashboardSidebar } from "@/components/student-dashboard-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { User, Mail, Phone, BookOpen, Lock, Save, Camera, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock student data
const studentData = {
  id: "20205238",
  name: "이현서",
  department: "소프트웨어 융합 대학",
  email: "lhs103725@gmail.com",
  phone: "010-3974-8149",
  enrollmentYear: "2020",
  currentSemester: "4학년",
  advisor: "김성태",
}

export default function ProfilePage() {
  const { toast } = useToast()
  const [student, setStudent] = useState(studentData)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(studentData)

  // For password change
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [profileImage, setProfileImage] = useState("/placeholder.svg?height=80&width=80")
  const [newProfileImage, setNewProfileImage] = useState<string | null>(null)

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSaveProfile = () => {
    setStudent(formData)
    setIsEditing(false)

    // Update profile image if a new one was selected
    if (newProfileImage) {
      setProfileImage(newProfileImage)
      setNewProfileImage(null)
    }

    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    })
  }

  const handlePasswordChange = () => {
    // Password validation
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation password must match.",
        variant: "destructive",
      })
      return
    }

    if (newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would send this to the server
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
    })

    // Reset form
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setFormData(student)
    setNewProfileImage(null)
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <StudentDashboardSidebar activePage="profile" />

        <main className="flex-1 p-6">
          <div className="flex flex-col space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">내 정보</h1>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>내 정보 수정</Button>
              ) : (
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={handleCancelEdit}>
                    닫기
                  </Button>
                  <Button onClick={handleSaveProfile}>
                    <Save className="mr-2 h-4 w-4" />
                    변경사항 저장
                  </Button>
                </div>
              )}
            </div>

            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="personal">개인 정보</TabsTrigger>
                <TabsTrigger value="security">보안</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Avatar className="h-20 w-20">
                          <AvatarImage
                            src={isEditing && newProfileImage ? newProfileImage : profileImage}
                            alt={student.name}
                          />
                          <AvatarFallback className="text-lg">
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {isEditing && (
                          <div className="absolute -right-2 -bottom-2 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer">
                            <label htmlFor="profile-image" className="cursor-pointer">
                              <Camera className="h-4 w-4" />
                              <input
                                type="file"
                                id="profile-image"
                                className="sr-only"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (!file) return
                                  if (file) {
                                    const reader = new FileReader()
                                    reader.onload = (event) => {
                                      if (event.target && typeof event.target.result === "string") {
                                        if (event.target && typeof event.target.result === "string") {
                                          setNewProfileImage(event.target.result)
                                        }
                                      }
                                    }
                                    reader.readAsDataURL(file)
                                  }
                                }}
                              />
                            </label>
                          </div>
                        )}
                      </div>
                      {isEditing && newProfileImage && (
                        <div className="mt-4 text-center">
                          <p className="text-sm text-muted-foreground mb-2">새로운 이미지
                          </p>
                          <div className="flex justify-center space-x-2">
                            <Button variant="outline" size="sm" onClick={() => setNewProfileImage(null)}>
                              닫기
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                setProfileImage(newProfileImage)
                                setNewProfileImage(null)
                                toast({
                                  title: "Profile picture updated",
                                  description: "Your profile picture has been updated successfully.",
                                })
                              }}
                            >
                              적용
                            </Button>
                          </div>
                        </div>
                      )}
                      <div>
                        <h2 className="text-2xl font-bold">{student.name}</h2>
                        <p className="text-muted-foreground">학번: {student.id}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="flex items-center">
                            <User className="mr-2 h-4 w-4" />
                            이름
                          </Label>
                          {isEditing ? (
                            <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
                          ) : (
                            <div className="p-2 border rounded-md bg-muted/50">{student.name}</div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="flex items-center">
                            <Mail className="mr-2 h-4 w-4" />
                            이메일
                          </Label>
                          {isEditing ? (
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                            />
                          ) : (
                            <div className="p-2 border rounded-md bg-muted/50">{student.email}</div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone" className="flex items-center">
                            <Phone className="mr-2 h-4 w-4" />
                            연락처
                          </Label>
                          {isEditing ? (
                            <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
                          ) : (
                            <div className="p-2 border rounded-md bg-muted/50">{student.phone}</div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="department" className="flex items-center">
                            <BookOpen className="mr-2 h-4 w-4" />
                            소속
                          </Label>
                          {isEditing ? (
                            <Input
                              id="department"
                              name="department"
                              value={formData.department}
                              onChange={handleInputChange}
                            />
                          ) : (
                            <div className="p-2 border rounded-md bg-muted/50">{student.department}</div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="enrollmentYear" className="flex items-center">
                            등록년도
                          </Label>
                          {isEditing ? (
                            <Input
                              id="enrollmentYear"
                              name="enrollmentYear"
                              value={formData.enrollmentYear}
                              onChange={handleInputChange}
                            />
                          ) : (
                            <div className="p-2 border rounded-md bg-muted/50">{student.enrollmentYear}</div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="advisor" className="flex items-center">
                            지도 교수
                          </Label>
                          {isEditing ? (
                            <Input id="advisor" name="advisor" value={formData.advisor} onChange={handleInputChange} />
                          ) : (
                            <div className="p-2 border rounded-md bg-muted/50">{student.advisor}</div>
                          )}
                        </div>
                      </div>
                    </div>
                    {isEditing && (
                      <div className="mt-6 p-4 border rounded-md">
                        <h3 className="text-lg font-medium mb-4">내 사진</h3>
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={newProfileImage || profileImage} alt={student.name} />
                            <AvatarFallback className="text-lg">
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-2">
                            <div className="flex space-x-2">
                              <Button asChild size="sm" variant="outline">
                                <label htmlFor="profile-image-upload" className="cursor-pointer">
                                  <Camera className="mr-2 h-4 w-4" />
                                  내 사진 업로드
                                  <input
                                    type="file"
                                    id="profile-image-upload"
                                    className="sr-only"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0]
                                      if (file) {
                                        const reader = new FileReader()
                                        reader.onload = (event) => {
                                          setNewProfileImage(event.target.result)
                                        }
                                        reader.readAsDataURL(file)
                                      }
                                    }}
                                  />
                                </label>
                              </Button>
                              {newProfileImage && (
                                <Button size="sm" variant="destructive" onClick={() => setNewProfileImage(null)}>
                                  <X className="mr-2 h-4 w-4" />
                                  제거
                                </Button>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                            추천: 정사각형 이미지, 최소 200x200픽셀
                            </p>
                          </div>
                        </div>
                        {newProfileImage && (
                          <div className="mt-4">
                            <p className="text-sm font-medium mb-2">적용 예시:</p>
                            <div className="flex items-center space-x-4">
                              <Avatar className="h-20 w-20">
                                <AvatarImage src={newProfileImage} alt="새로운 이미지" />
                                <AvatarFallback className="text-lg">
                                  {student.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={newProfileImage} alt="새로운 이미지 (small)" />
                                <AvatarFallback>
                                  {student.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="flex justify-center space-y-130">
                <Card className="grid items-center space-x-5 space-y-6">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lock className="mr-2 h-5 w-5" />
                      비밀번호 변경
                    </CardTitle>
                    <CardDescription>보안을 위해 주기적으로 비밀번호를 변경해주세요!</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">현재 비밀번호</Label>
                      <Input
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="new-password">새로운 비밀번호</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">비밀번호 재확인</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handlePasswordChange}>비밀번호 변경</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}


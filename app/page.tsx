import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import Image from 'next/image'
import logo from '../components/images/knock-logo.png'
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Image src={logo} alt='로고' />
          </div>
          <CardTitle className="text-2xl">로그인</CardTitle>
          <CardDescription>예약 기능을 이용하기 위해 로그인 혹은 가입하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">로그인</TabsTrigger>
              <TabsTrigger value="signup">회원가입</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="id">아이디 (학번)</Label>
                <Input id="id" placeholder="아이디를 입력하세요" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input id="password" type="password" placeholder="비밀번호를 입력하세요" />
              </div>
              <Button className="w-full" asChild>
                <Link href="/student/dashboard">로그인</Link>
              </Button>
            </TabsContent>
            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-id">아이디 (학번)</Label>
                <Input id="signup-id" placeholder="사용하실 아이디를 입력하세요" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">비밀번호</Label>
                <Input id="signup-password" type="password" placeholder="사용하실 비밀번호를 입력하세요" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input id="name" placeholder="이름을 입력하세요" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">소속</Label>
                <Input id="department" placeholder="당신의 소속을 입력하세요" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input id="email" type="email" placeholder="당신의 이메일을 입력하세요" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">전화번호</Label>
                <Input id="phone" placeholder="당신의 전화번호를 입력하세요" />
              </div>
              <Button className="w-full">회원가입</Button>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="flex justify-content space-x-4">
            <span className="kakao">
              kakao
            </span>
            <span className="google">
              google
            </span>
            <span className="apple">
              apple
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}


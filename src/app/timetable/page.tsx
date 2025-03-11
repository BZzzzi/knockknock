"use client";

import React, { useEffect } from "react";
import { useCallback, useState } from "react";
import { DAYS } from "@/app/common/const";
import { TIMES } from "@/app/common/const";
import UserModal from "../modal/user/page";
import AdminUserModal from "../modal/admin-user/page";
import styles from "@/app/public/styles/ScrollContainerTable.module.css";
import { supabase } from "../utils/supabaseClient";
import { deleteScheduleData, saveScheduleData } from "../utils/scheduleHelpers";

interface TableProps {
  isAdmin?: boolean; // 관리자 여부를 확인하는 prop
}

interface ScheduleData {
  id: string; // UUID
  name: string;
  student_signature: number;
  email: string;
  subject: string;
  meeting_detail: string;
  duration_10minutes_over: boolean;
  time: string;
  date: Date;
  day: string;
  start_time: string;
  end_time: string;
  state: string;
  delay_reason: string;
}
type ScheduleState = Record<string, ScheduleData>;

export default function Table({ isAdmin = false }: TableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{
    time: string;
    day: string;
    date: Date;
  } | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalData, setModalData] = useState<ScheduleData | null>(null);
  const [schedules, setSchedules] = useState<ScheduleState>({});

  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

  // 주 시작 날짜 계산 함수 (월요일 기준)
  const getStartOfWeek = (date: Date): Date => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // 월요일로 이동
    return new Date(date.setDate(diff));
  };

  // 주중(월~금) 날짜 배열 생성
  const getWeekdays = (startDate: Date): Date[] => {
    return Array.from({ length: 5 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      return date;
    });
  };

  // 날짜 포맷팅 함수
  const formatDate = (date: Date): string => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dayOfWeek = daysOfWeek[date.getDay()];
    return `${month}.${day}(${dayOfWeek})`;
  };

  // 년도와 방학 정보 가져오기
  const getYearAndTerm = (date: Date): string => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    let term = "방학";
    if (month >= 1 && month <= 2) {
      term = "동계방학";
    } else if (month >= 3 && month <= 6) {
      term = "1학기";
    } else if (month >= 7 && month <= 8) {
      term = "하계방학";
    } else if (month >= 9 && month <= 12) {
      term = "2학기";
    }
    return `${year}년 ${term}`;
  };

  const startOfWeek = getStartOfWeek(new Date(currentDate));
  const weekdays = getWeekdays(startOfWeek);

  // 이전 주 이동
  const handlePrevWeek = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() - 7);
      return newDate;
    });
  };

  // 다음 주 이동
  const handleNextWeek = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + 7);
      return newDate;
    });
  };

  // 데이터 새로고침 함수
  // useCallback으로 변수가 변경될 때만 변경 및 새로 생성
  // async로로 데이터를 비동기적으로 가져옴
  // cellKey는 newSchedules 객체의 키
  // setSchedules(newSchedules)으로 상태 업데이트
  const refreshData = useCallback(async () => {
    try {
      const startOfWeek = getStartOfWeek(currentDate); // 현재 주의 시작일 계산
      const weekdays = getWeekdays(startOfWeek); // 현재 주의 날짜 배열 생성
      const formattedWeekdays = weekdays.map((date) => date.toISOString().split("T")[0]); // ISO 형식 날짜

      const { data: allSchedules, error } = await supabase
        .from("userTable")
        .select("*")
        .in("date", formattedWeekdays); // 현재 주의 날짜에 해당하는 데이터만 가져옴

      if (error) throw error;

      if (!allSchedules || allSchedules.length === 0) {
        console.log("No schedules found");
        setSchedules({});
        return;
      }

      const newSchedules: ScheduleState = {};

      allSchedules.forEach((schedule) => {
        const start = schedule.start_time;
        const end = schedule.end_time;
        const time = `${start} - ${end}`;
        const cellKey = `${schedule.day}-${time}`;

        newSchedules[cellKey] = {
          id: schedule.id,
          name: schedule.name,
          student_signature: schedule.student_signature,
          email: schedule.email,
          subject: schedule.subject,
          meeting_detail: schedule.meeting_detail,
          duration_10minutes_over: schedule.duration_10minutes_over,
          date: new Date(schedule.date),
          day: schedule.day,
          time,
          start_time: start,
          end_time: end,
          state: schedule.state,
          delay_reason: schedule.delay_reason,
        };
      });

      setSchedules(newSchedules); // 상태 업데이트
      console.log("Updated Schedules:", newSchedules);
    } catch (err) {
      console.error("Failed to refresh schedules:", err);
    }
  }, [currentDate]);

  // 모달창 열 때
  const openModal = useCallback(
    async (rowIndex: number, colIndex: number) => {
      console.log(`Clicked cell at row: ${rowIndex}, col: ${colIndex}`);
      const startOfWeek = getStartOfWeek(currentDate); // 현재 주의 시작일 (월요일)
      const selectedDate = new Date(startOfWeek);
      selectedDate.setDate(startOfWeek.getDate() + colIndex); // 선택된 요일의 날짜 계산
      console.log(selectedDate);
      const time = TIMES[rowIndex];
      const day = DAYS[colIndex];

      try {
        // 최신 데이터 조회
        const matchingSchedule = Object.values(schedules).find(
          (schedule) => schedule.day === day && schedule.time === time
        );
        setSelectedCell({ time, day, date: selectedDate });
        setModalData(matchingSchedule || null);
      } catch (err) {
        console.error("Failed to fetch modal data:", err);
      }

      setIsModalOpen(true);
    },
    [schedules]
  );

  const saveSchedule = useCallback(
    async (
      name: string,
      student_signature: number,
      email: string,
      subject: string,
      meeting_detail: string,
      duration_10minutes_over: boolean,
      state: string,
      delay_reason?: string
    ) => {
      if (!selectedCell) return;

      // 선택된 셀에서 날짜와 시간 정보 추출
      const { day: selectedDay, time, date: selectedDate } = selectedCell; // selectedCell의 date와 day를 구조분해할 때 이름 변경
      const [start, end] = time.split(" - ");
      // day와 time에 해당하는 데이터가 있으면 업데이트.
      // 데이터가 없으면 새로운 데이터를 삽입.
      try {
        const id = modalData?.id || "";
        const result = await saveScheduleData(
          id,
          name,
          student_signature,
          email,
          subject,
          meeting_detail,
          duration_10minutes_over,
          selectedDate,
          selectedDay,
          start,
          end,
          state,
          delay_reason || "" // 일반 페이지에서는 빈 문자열 전달
        );
        console.log("Selected Cell:", selectedCell);
        console.log("Modal Data:", modalData);

        if (result) {
          await refreshData();
          setIsModalOpen(false);
        } else {
          alert("스케줄 저장에 실패했습니다.");
        }
      } catch (err) {
        console.error("Failed to save schedule:", err);
        alert("스케줄 저장 중 오류가 발생했습니다.");
      }
    },
    [selectedCell, modalData, refreshData]
  );

  useEffect(() => {
    console.log("Fetching data for currentDate:", currentDate);
    refreshData();
  }, [refreshData, currentDate]);

  const deleteSchedule = useCallback(async () => {
    if (!modalData || !modalData.id) return;

    try {
      const isDeleted = await deleteScheduleData(modalData.id); // 삭제 함수 호출
      if (isDeleted) {
        await refreshData(); // 데이터 새로고침
        setIsModalOpen(false); // 모달 닫기
      } else {
        alert("삭제에 실패했습니다.");
      }
    } catch (err) {
      console.error("Failed to delete schedule:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  }, [modalData, refreshData]);

  const getSchedule = (day: string, time: string) => {
    const entry = schedules[`${day}-${time}`];

    const statusColors: Record<string, string> = {
      "상태를 선택하세요.": "bg-amber-300",
      "확인 중": "bg-amber-500",
      확정: "bg-sky-500",
      "면담 중": "bg-purple-500",
      완료: "bg-emerald-500",
      불참: "bg-red-500",
    };

    return entry ? (
      <div className="flex flex-col items-center justify-center">
        {/* 상태 텍스트와 둥근 배경 */}
        <div
          className={`flex items-center justify-center px-2 py-1 rounded-full shadow-md  ${
            statusColors[entry.state] || "bg-gray-400"
          }`}>
          <span className="text-[10px] sm:text-sm lg:text-base text-white">{entry.state}</span>
        </div>
        {/* 이름 */}
        <div className="text-[10px] sm:text-sm lg:text-lg text-center mt-1">{entry.name}</div>
      </div>
    ) : null;
  };

  return (
    <div className={`${styles["scroll-container"]}`}>
      <div
        className={`relative ${
          isAdmin ? "py-[1%]" : "py-[2%]"
        } flex flex-col items-center justify-center bg-gray-100 lg:px-[10%] md:px-[8%] sm:px-[5%]`}>
        {/* 관리자 페이지 버튼 */}
        {isAdmin && (
          <div className="w-full flex justify-end pr-[3%] py-1">
            <div className="flex flex-col justify-center px-4 py-1 bg-gray-500 rounded-full">
              <p className="text-xs sm:text-sm lg:text-base font-bold text-white">
                ※ 관리자 페이지입니다.
              </p>
            </div>
          </div>
        )}

        {/* 상단 패널 */}
        <div className="w-[95%] py-6 px-3 bg-green-800 rounded-t-xl">
          <div className="flex items-center justify-between w-full">
            {/* 이전 주 버튼 */}
            <button
              onClick={handlePrevWeek}
              className="text-xs sm:text-sm lg:text-xl py-[1%] px-[1.3%] m-3 text-gray-50 rounded-full hover:bg-green-900 transition duration-50">
              ◀
            </button>

            {/* 가운데 타이틀 */}
            <div className="flex flex-col items-center flex-grow">
              <h2 className="text-base sm:text-xl lg:text-2xl font-bold mb-2 text-gray-50">
                📆 {getYearAndTerm(startOfWeek)} 📆
              </h2>
              <div className="flex flex-row items-center justify-center w-full">
                <p className="text-xs sm:text-sm md:text-md lg:text-xl text-gray-50">
                  {`${formatDate(weekdays[0])} ~ ${formatDate(weekdays[4])}`}
                </p>
              </div>
            </div>

            {/* 다음 주 버튼 */}
            <button
              onClick={handleNextWeek}
              className="text-xs sm:text-sm md:text-md lg:text-xl py-[1%] px-[1.3%] m-3 text-gray-50 rounded-full hover:bg-green-900 transition duration-50">
              ▶
            </button>
          </div>
        </div>

        <table className="w-[95%] rounded-b-xl border-collapse text-center shadow-xl bg-white overflow-hidden">
          <thead>
            <tr>
              <th className="w-[15%] border border-gray-300 text-xs sm:text-sm md:text-md lg:text-xl p-3 bg-gray-200">
                교시
              </th>
              {DAYS.map((day) => (
                <th
                  key={day}
                  className="border border-gray-300 text-xs sm:text-sm md:text-md lg:text-xl p-3 bg-gray-200">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIMES.map((time, rowIndex) => (
              <tr key={rowIndex}>
                <td className="h-[80px] mx-auto border text-xs sm:text-sm md:text-md lg:text-lg border-gray-300 p-1 bg-gray-100">
                  {time}
                </td>
                {DAYS.map((day, colIndex) => (
                  <td
                    key={colIndex}
                    className={`w-[15%] border border-gray-300 p-1 cursor-pointer hover:bg-green-100 ${
                      schedules[`${day}-${time}`] ? "bg-green-50" : "bg-white"
                    }`}
                    onClick={() => openModal(rowIndex, colIndex)}>
                    {getSchedule(day, time)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen &&
        (isAdmin && !modalData ? (
          <AdminUserModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={(
              name,
              student_signature,
              email,
              subject,
              meeting_detail,
              duration_10minutes_over,
              state
            ) =>
              saveSchedule(
                name,
                student_signature,
                email,
                subject,
                meeting_detail,
                duration_10minutes_over,
                state
              )
            }
            onDelete={deleteSchedule} // 삭제 로직 추가
            selectedCell={selectedCell}
            modalData={modalData} // 추가된 데이터 전달
            formatDate={formatDate}
          />
        ) : (
          <UserModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            isAdmin={isAdmin}
            onSave={(
              name,
              student_signature,
              email,
              subject,
              meeting_detail,
              duration_10minutes_over,
              state,
              delay_reason
            ) =>
              saveSchedule(
                name,
                student_signature,
                email,
                subject,
                meeting_detail,
                duration_10minutes_over,
                state,
                delay_reason
              )
            }
            onDelete={deleteSchedule} // 삭제 로직 추가
            selectedCell={selectedCell}
            modalData={modalData} // 추가된 데이터 전달
            formatDate={formatDate}
          />
        ))}
    </div>
  );
}

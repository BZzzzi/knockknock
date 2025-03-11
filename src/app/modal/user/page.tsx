"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { INTERVIEWSTATES, SUBJECTS } from "../../common/const";
import styles from "@/app/public/styles/ScrollContainerModal.module.css";

interface ModalProps {
  isAdmin?: boolean; // 관리자 여부를 확인하는 prop
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    name: string,
    student_signature: number,
    email: string,
    subject: string,
    meeting_detail: string,
    duration_10minutes_over: boolean,
    state: string,
    delay_reason: string
  ) => void;
  onUpdate?: (
    id: string,
    name: string,
    student_signature: number,
    email: string,
    subject: string,
    meeting_detail: string,
    duration_10minutes_over: boolean,
    state: string,
    delay_reason: string
  ) => void; // 수정 콜백
  onDelete?: (id: string) => Promise<void>; // onDelete 추가
  selectedCell?: { time: string; day: string; date: Date } | null;
  modalData?: {
    id: string;
    name: string;
    student_signature: number;
    email: string;
    subject: string;
    meeting_detail: string;
    duration_10minutes_over: boolean;
    state: string;
    delay_reason: string;
  } | null;
  formatDate: (date: Date) => string;
}

// UserModal은 ModalProps들을 timetable에서 받아 동작한다.
export default function UserModal({
  isAdmin,
  isOpen,
  onClose,
  onSave,
  onUpdate,
  onDelete,
  selectedCell,
  modalData,
  formatDate,
}: ModalProps) {
  const [name, setName] = useState<string>("");
  const [student_signature, setStudentSignature] = useState<number | null>(null);
  const [email, setEmail] = useState<string>(""); // 이메일
  const [subject, setSubject] = useState<string>(""); // 수강과목
  const [meetingDetail, setMeetingDetail] = useState<string>(""); // 면담 희망내용
  const [isDuration10MinutesOver, setIsDuration10MinutesOver] = useState<boolean>(false); // 10분 이상 체크 여부
  const [state, setState] = useState<string>("");
  const [delayReason, setDelayReason] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false); // 수정 모드 상태 추가

  const isMounted = useRef(false);

  {
    /* 메일 서비스 */
  }
  const sendEmail = async (name: string) => {
    try {
      // 이메일 내용 생성
      const emailSubject = `${name}님의 면담 일정을 확인해주세요.`;
      // 날짜와 시간 포맷
      const formattedDate = selectedCell?.date && formatDate(new Date(selectedCell.date)); // 날짜 포맷 함수 사용
      const formattedTime = selectedCell?.time || ""; // 시간 값이 없으면 빈 문자열

      // 이메일 HTML 내용
      const emailHTML = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4CAF50;">${name}님의 면담 일정을 확인해주세요.</h2>
        <ul style="background-color: #f9f9f9; padding: 10px; border-radius: 5px;">
          <li><strong>날짜:</strong> ${formattedDate}</li>
          <li><strong>시간:</strong> ${formattedTime}</li>
          <li><strong>일정 확인:</strong> <a href="http://localhost:3000/admin" style="color: #007BFF; text-decoration: none;">일정 관리 페이지로 이동</a></li>
        </ul>
        <hr />
        <footer style="font-size: 0.9em; color: #666;">
          <p>본 메일은 자동 발송된 메일입니다.</p>
        </footer>
      </div>
    `;

      // API 요청 - 이메일 전송
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "khj23465@naver.com", // 수신자 이메일
          subject: emailSubject, // 이메일 제목
          html: emailHTML, // HTML 이메일 내용
        }),
      });

      console.log("Response status:", response.status);
      const responseBody = await response.json();
      console.log("Response body:", responseBody);

      if (response.ok) {
        console.log("Email sent successfully!");
        return true;
      } else {
        console.error("Failed to send email:", responseBody.message);
        return false;
      }
    } catch (error) {
      console.error("Error sending email:", error);
      return false;
    }
  };

  const reApplyEmail = async (email: string, name: string, state: string, delayReason: string) => {
    try {
      // 이메일 내용 생성
      const emailSubject = `[김병정 교수님] ${name}님! 면담 재신청이 필요합니다.`;
      // 날짜와 시간 포맷
      const formattedDate = selectedCell?.date && formatDate(new Date(selectedCell.date)); // 날짜 포맷 함수 사용
      const formattedTime = selectedCell?.time || ""; // 시간 값이 없으면 빈 문자열

      // 이메일 HTML 내용
      const emailHTML = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4CAF50;">${name}님의 면담 재신청이 필요합니다.</h2>
        <ul style="background-color: #f9f9f9; padding: 10px; border-radius: 5px;">
          <li><strong>날짜:</strong> ${formattedDate}</li>
          <li><strong>시간:</strong> ${formattedTime}</li>
          <li><strong>재신청 필요 사유:</strong> ${delayReason}</li>
          <li><strong>면담 신청 확인:</strong> <a href="http://localhost:3000/" style="color: #007BFF; text-decoration: none;">면담 신청 페이지로 이동</a></li>
        </ul>
        <hr />
        <footer style="font-size: 0.9em; color: #666;">
          <p>본 메일은 자동 발송된 메일입니다.</p>
        </footer>
      </div>
    `;

      // API 요청 - 이메일 전송
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email, // 수신자 이메일
          subject: emailSubject, // 이메일 제목
          html: emailHTML, // HTML 이메일 내용
        }),
      });

      console.log("Response status:", response.status);
      const responseBody = await response.json();
      console.log("Response body:", responseBody);

      if (response.ok) {
        console.log("Email sent successfully!");
        return true;
      } else {
        console.error("Failed to send email:", responseBody.message);
        return false;
      }
    } catch (error) {
      console.error("Error sending email:", error);
      return false;
    }
  };

  const ApplyEmail = async (email: string, name: string, state: string) => {
    try {
      // 이메일 내용 생성
      const emailSubject = `[김병정 교수님] ${name}님의 면담이 확정되었습니다.`;
      // 날짜와 시간 포맷
      const formattedDate = selectedCell?.date && formatDate(new Date(selectedCell.date)); // 날짜 포맷 함수 사용
      const formattedTime = selectedCell?.time || ""; // 시간 값이 없으면 빈 문자열

      // 이메일 HTML 내용
      const emailHTML = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4CAF50;">${name}님의 면담이 확정되었습니다.</h2>
        <ul style="background-color: #f9f9f9; padding: 10px; border-radius: 5px;">
          <li><strong>날짜:</strong> ${formattedDate}</li>
          <li><strong>시간:</strong> ${formattedTime}</li>
          <li><strong>면담 신청 확인:</strong> <a href="http://localhost:3000/" style="color: #007BFF; text-decoration: none;">면담 신청 페이지로 이동</a></li>
        </ul>
        <hr />
        <footer style="font-size: 0.9em; color: #666;">
          <p>본 메일은 자동 발송된 메일입니다.</p>
        </footer>
      </div>
    `;

      // API 요청 - 이메일 전송
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email, // 수신자 이메일
          subject: emailSubject, // 이메일 제목
          html: emailHTML, // HTML 이메일 내용
        }),
      });

      console.log("Response status:", response.status);
      const responseBody = await response.json();
      console.log("Response body:", responseBody);

      if (response.ok) {
        console.log("Email sent successfully!");
        return true;
      } else {
        console.error("Failed to send email:", responseBody.message);
        return false;
      }
    } catch (error) {
      console.error("Error sending email:", error);
      return false;
    }
  };

  useEffect(() => {
    if (isOpen) {
      // modalData를 활용하여 초기값 설정
      setName(modalData?.name || "");
      setStudentSignature(modalData?.student_signature || null);
      setEmail(modalData?.email || "");
      setSubject(modalData?.subject || "");
      setMeetingDetail(modalData?.meeting_detail || "");
      setIsDuration10MinutesOver(modalData?.duration_10minutes_over || false);
      setState(modalData?.state || "");
      setDelayReason(modalData?.delay_reason || "");
      setIsEditing(!!modalData); // modalData가 있을 경우 수정 모드로 설정
    } else {
      // 모달이 닫힐 때 상태 초기화
      setName("");
      setStudentSignature(null);
      setEmail("");
      setSubject("");
      setMeetingDetail("");
      setIsDuration10MinutesOver(false);
      setState("");
      setDelayReason("");
      setIsEditing(false);
    }
  }, [isOpen, modalData]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleSave = async () => {
    if (!isMounted.current) return;

    // 모든 필드 입력 여부 확인
    if (
      !name.trim() ||
      student_signature === null ||
      !email.trim() ||
      !subject.trim() ||
      !meetingDetail.trim()
    ) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    try {
      if (isEditing && modalData?.id && onUpdate) {
        const hasChanges =
          modalData.name !== name.trim() ||
          modalData.student_signature !== student_signature ||
          modalData.email !== email.trim() ||
          modalData.subject !== subject ||
          modalData.meeting_detail !== meetingDetail.trim() ||
          modalData.duration_10minutes_over !== isDuration10MinutesOver ||
          modalData.delay_reason !== delayReason ||
          modalData.state !== state.trim();

        if (hasChanges) {
          // 수정 작업 실행
          onUpdate(
            modalData.id,
            name.trim(),
            student_signature,
            email.trim(),
            subject,
            meetingDetail.trim(),
            isDuration10MinutesOver,
            isAdmin ? state.trim() : "확인 중",
            isAdmin && state.trim() === "재신청 필요" ? delayReason.trim() : ""
          );
          alert("수정이 완료되었습니다.");

          // // "확정" 상태일 경우 ApplyEmail 호출
          // if (isAdmin && state.trim() === "확정") {
          //   const emailSent = await ApplyEmail(email.trim(), name.trim(), state.trim());
          //   if (!emailSent) {
          //     alert("확정 이메일 전송에 실패했습니다.");
          //   }
          // }

          // // "재신청 필요" 상태일 경우 reApplyEmail 호출
          // if (isAdmin && state.trim() === "재신청 필요") {
          //   const emailSent = await reApplyEmail(
          //     email.trim(),
          //     name.trim(),
          //     state.trim(),
          //     delayReason.trim()
          //   );
          //   if (!emailSent) {
          //     alert("재신청 이메일 전송에 실패했습니다.");
          //   }
          // }

          // 이메일 전송 호출
          const emailSent = await sendEmail(name.trim());
          if (!emailSent) {
            alert("이메일 전송에 실패했습니다.");
          }
        } else {
          alert("변경된 내용이 없습니다.");
        }
      } else {
        // 저장 작업 실행
        onSave(
          name.trim(),
          student_signature,
          email.trim(),
          subject,
          meetingDetail.trim(),
          isDuration10MinutesOver,
          isAdmin ? state.trim() : "확인 중",
          isAdmin && state.trim() === "재신청 필요" ? delayReason.trim() : ""
        );
        alert("저장이 완료되었습니다.");

        // // "확정" 상태일 경우 ApplyEmail 호출
        // if (isAdmin && state.trim() === "확정") {
        //   const emailSent = await ApplyEmail(email.trim(), name.trim(), state.trim());
        //   if (!emailSent) {
        //     alert("확정 이메일 전송에 실패했습니다.");
        //   }
        // }

        // // "재신청 필요" 상태일 경우 reApplyEmail 호출
        // if (isAdmin && state.trim() === "재신청 필요") {
        //   const emailSent = await reApplyEmail(
        //     email.trim(),
        //     name.trim(),
        //     state.trim(),
        //     delayReason.trim()
        //   );
        //   if (!emailSent) {
        //     alert("재신청 이메일 전송에 실패했습니다.");
        //   }
        // }

        // 이메일 전송 호출
        const emailSent = await sendEmail(name.trim());
        if (!emailSent) {
          alert("이메일 전송에 실패했습니다.");
        }
      }
    } catch (error) {
      console.error("Error in handleSave:", error);
      alert("저장 중 문제가 발생했습니다.");
    } finally {
      onClose(); // 모달 닫기
    }
  };

  const handleDelete = useCallback(() => {
    if (modalData?.id && onDelete) {
      onDelete(modalData.id).then(() => {
        alert("삭제가 완료되었습니다."); // 삭제 완료 알림
      });
    }
  }, [modalData?.id, onDelete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`bg-white rounded-lg shadow-lg w-[85%] sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%] p-6 h-[80vh] flex flex-col justify-between ${styles["scroll-container"]}`}>
        <div className="text-left">
          <div className="flex justify-between items-center mb-1">
            <p className="text-xl sm:text-2xl lg:text-2xl font-bold">김병정 교수님 면담 신청</p>
            <button
              onClick={onClose}
              className="text-right text-gray-500 hover:text-black text-lg font-bold">
              ✕
            </button>
          </div>
          {selectedCell ? (
            <div className="my-2">
              <p className="text-sm sm:text-lg lg:text-lg font-bold">
                {selectedCell?.date && formatDate(new Date(selectedCell.date))} {selectedCell.time}
              </p>
              <p className="text-sm sm:text-base lg:text-base text-gray-500">공학관 3층(1311호)</p>
            </div>
          ) : (
            <p>No cell selected</p>
          )}
        </div>
        <form className="space-y-3">
          {/* 이름 */}
          <div>
            <label className="block text-sm sm:text-base lg:text-lg text-gray-700">
              이름<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-3 py-2 text-sm sm:text-base lg:text-lg border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none focus:bg-gray-50"
            />
          </div>

          {/* 학번 */}
          <div>
            <label className="block text-sm sm:text-base lg:text-lg text-gray-700">
              학번<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={student_signature !== null ? student_signature : ""} // null일 경우 빈 문자열
              onChange={(e) => setStudentSignature(e.target.value ? Number(e.target.value) : null)} // 빈 입력 처리
              onKeyDown={(e) => {
                if (e.key === "e" || e.key === "E") {
                  e.preventDefault();
                }
              }}
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(/[eE]/g, "");
              }}
              className="w-full mt-1 px-3 py-2 text-sm sm:text-base lg:text-lg border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none focus:bg-gray-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          {/* 이메일 */}
          <div>
            <label className="block text-sm sm:text-base lg:text-lg text-gray-700">
              이메일<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2 text-sm sm:text-base lg:text-lg border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none focus:bg-gray-50"
            />
          </div>

          {/* 수강과목 */}
          <div>
            <label className="block text-sm sm:text-base lg:text-lg text-gray-700">
              수강과목<span className="text-red-500">*</span>
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full mt-1 px-3 py-2 text-sm sm:text-base lg:text-lg border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none">
              <option value="">과목을 선택하세요.</option>
              {SUBJECTS.map((subject, index) => (
                <option key={index} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          {/* 면담희망내용 */}
          <div>
            <label className="block text-sm sm:text-base lg:text-lg text-gray-700">
              면담 희망내용<span className="text-red-500">*</span>
            </label>
            <textarea
              value={meetingDetail}
              onChange={(e) => setMeetingDetail(e.target.value)}
              className="w-full mt-1 px-3 py-2 text-sm sm:text-base lg:text-lg border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none focus:bg-gray-50"
            />
            <div className="flex items-center gap-1">
              <label
                htmlFor="duration_10minutes_over"
                className="text-xs lg:text-base cursor-pointer">
                ※ 면담은 10분 내외로 진행됩니다. 10분 이상 희망 시 체크 표시
              </label>
              <input
                type="checkbox"
                id="duration_10minutes_over"
                checked={isDuration10MinutesOver} // 체크 상태를 boolean 값으로 설정
                onChange={(e) => setIsDuration10MinutesOver(e.target.checked)} // e.target.checked는 boolean 반환
                className="form-checkbox"
              />
            </div>
          </div>

          {/* 면담 상태 */}
          <div>
            <label className="block text-sm sm:text-base lg:text-lg text-gray-700">
              면담 상태<span className="text-red-500">*</span>
            </label>

            {isAdmin ? (
              // 관리자 전용 select
              <div>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-sm sm:text-base lg:text-lg border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none">
                  <option value="">상태를 선택하세요.</option>
                  {INTERVIEWSTATES.map((input, index) => (
                    <option key={index} value={input}>
                      {input}
                    </option>
                  ))}
                </select>
                {state === "재신청 필요" && (
                  <div className="mt-3">
                    <label className="block text-sm sm:text-base lg:text-lg text-gray-700">
                      사유 입력<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="사유를 입력하세요"
                      value={delayReason} // 이유 상태 값
                      onChange={(e) => setDelayReason(e.target.value)} // 이유 상태 업데이트
                      className="w-full mt-1 px-3 py-2 text-sm sm:text-base lg:text-lg border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none focus:bg-gray-50"
                    />
                  </div>
                )}
              </div>
            ) : (
              // 일반 유저용 select
              <div>
                <select
                  value={state}
                  disabled // 선택 불가
                  className="w-full mt-1 px-3 py-2 text-sm sm:text-base lg:text-lg border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none">
                  <option value={state}>{state || "확인 중"}</option>
                </select>
                {/* 일반 유저에게만 표시되는 메시지 */}
                <div className="mt-1.5 flex items-center">
                  <label className="text-xs lg:text-base">
                    ※ 저장 시, 교수님께 면담 신청 메일이 전달됩니다.
                  </label>
                </div>
              </div>
            )}
          </div>
        </form>

        <div className="flex justify-between mt-5">
          {/* 왼쪽: 삭제 버튼 */}
          <div>
            {modalData?.id && (
              <button
                onClick={handleDelete} // 래퍼 함수 사용
                className="px-4 py-2 text-sm sm:text-base lg:text-lg bg-red-500 hover:bg-red-600 text-white rounded">
                삭제
              </button>
            )}
          </div>

          {/* 오른쪽: 수정/저장, 취소 버튼 */}
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm sm:text-base lg:text-lg  bg-green-800 hover:bg-green-900 text-white rounded">
              {isEditing ? "수정" : "저장"}
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 text-sm sm:text-base lg:text-lg bg-gray-400 hover:bg-gray-500 text-white rounded">
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

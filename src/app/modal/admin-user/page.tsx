"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PROFESSORSCHEDULE } from "../../common/const";
import styles from "@/app/public/styles/ScrollContainerModal.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    name: string,
    student_signature: number,
    email: string,
    subject: string,
    meeting_detail: string,
    duration_10minutes_over: boolean,
    state: string
  ) => void;
  onUpdate?: (
    id: string,
    name: string,
    student_signature: number,
    email: string,
    subject: string,
    meeting_detail: string,
    duration_10minutes_over: boolean,
    state: string
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
  } | null;
  formatDate: (date: Date) => string;
}

// UserModal은 ModalProps들을 timetable에서 받아 동작한다.
export default function UserModal({
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
  const [isEditing, setIsEditing] = useState<boolean>(false); // 수정 모드 상태 추가

  const isMounted = useRef(false);

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
      setIsEditing(!!modalData); // modalData가 있을 경우 수정 모드로 설정
    } else {
      // 모달이 닫힐 때 상태 초기화
      setName("");
      setStudentSignature(null);
      setState("");
      setIsEditing(false);
    }
  }, [isOpen, modalData]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleSave = () => {
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

    if (isEditing && modalData?.id && onUpdate) {
      const hasChanges =
        modalData.name !== name.trim() ||
        modalData.student_signature !== student_signature ||
        modalData.email !== email.trim() ||
        modalData.subject !== subject ||
        modalData.meeting_detail !== meetingDetail.trim() ||
        modalData.duration_10minutes_over !== isDuration10MinutesOver ||
        modalData.state !== state.trim();

      if (hasChanges) {
        onUpdate(
          modalData.id,
          name.trim(),
          student_signature,
          email.trim(),
          subject,
          meetingDetail.trim(),
          isDuration10MinutesOver,
          state.trim()
        );
        alert("수정이 완료되었습니다.");
      } else {
        alert("변경된 내용이 없습니다.");
      }
    } else {
      onSave(
        name.trim(),
        student_signature,
        email.trim(),
        subject,
        meetingDetail.trim(),
        isDuration10MinutesOver,
        state
      );
      alert("저장이 완료되었습니다.");
    }

    onClose(); // 모달 닫기
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
        className={`bg-white rounded-lg shadow-lg w-[85%] sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%] p-6 max-h-[50vh] flex flex-col justify-between ${styles["scroll-container"]}`}>
        <div className="text-left">
          <div className="flex justify-between items-center mb-1">
            <p className="text-xl sm:text-2xl lg:text-2xl font-bold">교수 일정 등록</p>
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
            </div>
          ) : (
            <p>No cell selected</p>
          )}
        </div>
        <form className="space-y-3">
          <div>
            <label className="block text-sm sm:text-base lg:text-lg text-gray-700">
              등록 일정<span className="text-red-500">*</span>
            </label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full mt-1 px-3 py-2 text-sm sm:text-base lg:text-lg border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none">
              <option value="">일정을 선택하세요.</option>
              {PROFESSORSCHEDULE.map((input, index) => (
                <option key={index} value={input}>
                  {input}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm sm:text-base lg:text-lg text-gray-700">일정 내용</label>
            <textarea
              value={meetingDetail}
              onChange={(e) => setMeetingDetail(e.target.value)}
              className="w-full mt-1 px-3 py-2 text-sm sm:text-base lg:text-lg border border-gray-300 bg-gray-100 rounded-md shadow-sm focus:outline-none focus:bg-gray-50"
            />
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

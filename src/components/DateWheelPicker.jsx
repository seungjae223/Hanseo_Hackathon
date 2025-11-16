// src/components/DateRangeManager.jsx
import React, { useState } from 'react';
import DateWheelPicker from './DateWheelPicker'; // 방금 주신 휠 피커


// 날짜를 "YYYY/MM/DD" 형식으로 바꾸는 도우미 함수
function format(d) {
  if (!(d instanceof Date)) d = new Date(d); // Date 객체 확인
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}/${m}/${day}`;
}

export default function DateRangeManager() {
  // 1. 날짜 범위 상태 (Image 2의 값)
  const [startDate, setStartDate] = useState(new Date("2025/11/15"));
  const [endDate, setEndDate] = useState(new Date("2025/11/22"));
  
  // 2. 모달(피커) 표시 여부 상태
  const [isOpen, setIsOpen] = useState(false);

  // 3. 임시 상태 (확인 누르기 전까지)
  const [tempStart, setTempStart] = useState(startDate);
  const [tempEnd, setTempEnd] = useState(endDate);

  const openPicker = () => {
    // 모달 열 때 현재 날짜로 임시 상태 설정
    setTempStart(startDate);
    setTempEnd(endDate);
    setIsOpen(true);
  };

  const handleConfirm = () => {
    // '확인' 누르면 실제 날짜 상태 업데이트
    setStartDate(tempStart);
    setEndDate(tempEnd);
    setIsOpen(false);
  };
  
  const handleCancel = () => {
    setIsOpen(false); // 임시 상태 버리고 그냥 닫기
  };

  return (
    <div>
      {/* ------------------------------------- */}
      {/* 1. 날짜 범위 표시 상자 (Image 2)       */}
      {/* ------------------------------------- */}
      <div className="dateDisplayBoxContainer">
        <span className="dateDisplayLabel">기한</span>
        <div className="dateDisplayBox" onClick={openPicker}>
          {format(startDate)} ~ {format(endDate)}
        </div>
      </div>

      {/* ------------------------------------- */}
      {/* 2. 날짜 선택 모달 (Image 1 스타일)    */}
      {/* ------------------------------------- */}
      {isOpen && (
        <div className="modalOverlay" onClick={handleCancel}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            
            {/* '시작일' 휠 피커 */}
            <DateWheelPicker
              label="시작일"
              value={tempStart}
              onChange={setTempStart} // 임시 상태 변경
            />
            
            {/* '종료일' 휠 피커 */}
            <DateWheelPicker
              label="종료일"
              value={tempEnd}
              onChange={setTempEnd} // 임시 상태 변경
            />
            
            <button onClick={handleConfirm} className="confirmButton">
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
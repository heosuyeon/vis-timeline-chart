// 날짜 문자열을 로컬 시간 00:00으로 변환하는 헬퍼 함수
// 서버에서 "2025-10-01" 형식으로 내려오는 날짜를 그대로 사용
export function parseDateString(dateString: string): Date {
  // "2025-10-01" 형식을 파싱하여 로컬 시간 00:00으로 생성
  var parts = dateString.split("-");
  var year = parseInt(parts[0], 10);
  var month = parseInt(parts[1], 10) - 1; // JavaScript Date는 월이 0부터 시작
  var day = parseInt(parts[2], 10);
  return new Date(year, month, day);
}

// 서버에서 받은 end 날짜를 vis-timeline에 맞게 변환
// 서버의 end 날짜는 inclusive(포함)이지만, vis-timeline의 end는 exclusive(미포함)이므로
// 서버에서 "2025-10-31"을 받으면, 그것을 11월 1일 00:00으로 변환하여 10월 31일까지 포함되도록 함
// 이 함수는 서버 데이터를 변경하는 것이 아니라, vis-timeline의 동작 방식에 맞게 변환하는 것
export function parseEndDateString(dateString: string): Date {
  // 서버에서 받은 end 날짜 문자열을 파싱
  var parts = dateString.split("-");
  var year = parseInt(parts[0], 10);
  var month = parseInt(parts[1], 10) - 1; // JavaScript Date는 월이 0부터 시작
  var day = parseInt(parts[2], 10);
  // vis-timeline의 end는 exclusive이므로, 해당 날짜까지 포함하려면 다음 날 00:00으로 설정
  // 서버에서 "2025-10-31"을 받으면 → 11월 1일 00:00으로 변환 → 10월 31일까지 표시됨
  return new Date(year, month, day + 1);
}

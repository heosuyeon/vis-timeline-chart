const moment = require("moment");

// 방 상태 타입 정의
export interface RoomStatus {
  label: string; // "판매신청", "판매오픈", "계약일", "결제요청" 등
  timestamp: string; // "25-10-29 09:24:00"
  color?: string; // span 색상 (예: "#27A644", "#E3B860", "#AA00D0", "#7AABF9")
}

// style 문자열에서 background-color 추출하는 헬퍼 함수
function extractBackgroundColor(style: string): string | null {
  if (!style) return null;
  const match = style.match(/background-color:\s*([^;]+)/);
  return match ? match[1].trim() : null;
}

// room-statuses 아이템의 content를 생성하는 함수
export function getGroupLabelContent(
  start: Date,
  end: Date,
  statuses?: RoomStatus[],
  items?: any[] // 같은 그룹의 아이템 배열 (날짜순 정렬 후 컬러 추출용)
) {
  // 날짜 개수 계산
  const timeDiff = end.getTime() - start.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  const daysCount = daysDiff;

  // 외부 container (grid)
  const container = document.createElement("div");
  container.style.display = "grid";
  container.style.gridTemplateColumns = `repeat(${daysCount}, 1fr)`;
  container.style.width = "100%";
  container.style.height = "100%";

  // 첫번째 자식 div 하나만 생성 (기존 container 스타일)
  const dayDiv = document.createElement("div");
  dayDiv.style.position = "relative";
  dayDiv.style.display = "flex";
  dayDiv.style.alignItems = "center";
  dayDiv.style.justifyContent = "center";

  const countBedgeDiv = document.createElement("div");
  countBedgeDiv.className = "count-badge"; // 카운트 뱃지 식별을 위한 클래스
  countBedgeDiv.style.position = "absolute";
  countBedgeDiv.style.top = "0";
  countBedgeDiv.style.left = "80%";
  countBedgeDiv.style.backgroundColor = "#252B39";
  countBedgeDiv.style.borderRadius = "50%";
  countBedgeDiv.style.width = "20px";
  countBedgeDiv.style.height = "20px";
  countBedgeDiv.style.display = "flex";
  countBedgeDiv.style.alignItems = "center";
  countBedgeDiv.style.justifyContent = "center";
  countBedgeDiv.style.fontSize = "12px";
  countBedgeDiv.style.fontWeight = "700";
  countBedgeDiv.style.color = "white";
  countBedgeDiv.style.cursor = "pointer"; // 호버 가능함을 표시

  // 가운데에 위치할 내부 div
  const innerDiv = document.createElement("div");
  innerDiv.style.display = "flex";
  innerDiv.style.alignItems = "center";
  innerDiv.style.gap = "2px";
  innerDiv.style.flexDirection = "column";
  innerDiv.style.backgroundColor = "#F7F7FA";
  innerDiv.style.borderRadius = "8px";
  innerDiv.style.padding = "17px 0";

  // 기본 색상
  const defaultColors = ["#27A644", "#E3B860", "#AA00D0", "#7AABF9"];

  // items가 있으면 items에서 컬러 추출 (날짜순 정렬)
  if (items && items.length > 0) {
    // 날짜순으로 정렬 (start 기준)
    const sortedItems = [...items].sort((a, b) => {
      return a.start.getTime() - b.start.getTime();
    });

    // 아이템 개수를 뱃지에 표시
    const itemCount = sortedItems.length;
    countBedgeDiv.textContent = itemCount.toString();

    // 각 아이템의 컬러를 추출하여 span 생성 (최대 4개)
    const displayCount = Math.min(sortedItems.length, 4);
    for (let j = 0; j < displayCount; j++) {
      const item = sortedItems[j];
      const span = document.createElement("span");
      span.style.borderRadius = "50%";
      span.style.width = "8px";
      span.style.height = "8px";
      span.style.textIndent = "-9999px";
      span.style.fontSize = "0";

      // style에서 background-color 추출
      const backgroundColor = item.style
        ? extractBackgroundColor(item.style)
        : null;
      span.style.backgroundColor =
        backgroundColor || defaultColors[j] || defaultColors[0];

      span.textContent = (j + 1).toString();
      innerDiv.appendChild(span);
    }
  } else if (statuses && statuses.length > 0) {
    // timestamp 기준으로 날짜순 정렬
    const sortedStatuses = [...statuses].sort((a, b) => {
      // timestamp 형식: "25-10-29 09:24:00" -> "2025-10-29 09:24:00"으로 변환
      const parseTimestamp = (ts: string): Date => {
        const [datePart, timePart] = ts.split(" ");
        const [year, month, day] = datePart.split("-");
        const fullYear = `20${year}`;
        return new Date(
          `${fullYear}-${month}-${day} ${timePart || "00:00:00"}`
        );
      };

      const dateA = parseTimestamp(a.timestamp);
      const dateB = parseTimestamp(b.timestamp);
      return dateA.getTime() - dateB.getTime();
    });

    // 룸 상태 개수를 뱃지에 표시
    const totalStatusCount = sortedStatuses.length;
    countBedgeDiv.textContent = totalStatusCount.toString();

    // 항상 최대 4개까지만 표시
    const displayCount = Math.min(sortedStatuses.length, 4);

    for (let j = 0; j < displayCount; j++) {
      const status = sortedStatuses[j];
      const span = document.createElement("span");
      span.style.borderRadius = "50%";
      span.style.width = "8px";
      span.style.height = "8px";
      span.style.textIndent = "-9999px";
      span.style.fontSize = "0";
      // 상태에 color가 있으면 사용, 없으면 기본 색상 사용
      span.style.backgroundColor =
        status.color || defaultColors[j] || defaultColors[0];
      span.textContent = status.label || (j + 1).toString();
      // 데이터 속성으로 상태 정보 저장 (선택사항)
      span.setAttribute("data-status-label", status.label);
      span.setAttribute("data-status-timestamp", status.timestamp);
      innerDiv.appendChild(span);
    }
  } else {
    // 기본 색상 span 4개 생성
    countBedgeDiv.textContent = "0";
    const labels = ["1", "2", "3", "4"];

    for (let j = 0; j < defaultColors.length; j++) {
      const span = document.createElement("span");
      span.style.borderRadius = "50%";
      span.style.width = "8px";
      span.style.height = "8px";
      span.style.textIndent = "-9999px";
      span.style.fontSize = "0";
      span.style.backgroundColor = defaultColors[j];
      span.textContent = labels[j];
      innerDiv.appendChild(span);
    }
  }

  dayDiv.appendChild(countBedgeDiv);
  dayDiv.appendChild(innerDiv);
  container.appendChild(dayDiv);

  return container;
}

// 일반 아이템의 content를 생성하는 함수 (room-statuses이 아닌 아이템용)
export function getItemContent(
  startDateString: string,
  endDateString: string,
  name: string,
  backgroundColor?: string,
  selectedBorderColor?: string
) {
  // 날짜 포맷팅 (예: "11-08 ~ 12-07")
  const startDate = startDateString;
  const endDate = endDateString;
  const startFormatted = moment(startDate).format("MM-DD");
  const endFormatted = moment(endDate).format("MM-DD");
  const dateRange = `${startFormatted} ~ ${endFormatted}`;

  const container = document.createElement("div");

  // HTML content 생성
  const contentDiv = document.createElement("div");

  const nameSpan = document.createElement("span");
  nameSpan.style.fontSize = "13px";
  nameSpan.style.fontWeight = "700";
  nameSpan.style.marginRight = "4px";
  nameSpan.textContent = name;

  const dateSpan = document.createElement("span");
  dateSpan.style.fontSize = "11px";
  dateSpan.textContent = dateRange;

  contentDiv.appendChild(nameSpan);
  contentDiv.appendChild(dateSpan);
  container.appendChild(contentDiv);

  return container;
}

const moment = require("moment");

// group-label 아이템의 content를 생성하는 함수
export function getGroupLabelContent(start: Date, end: Date) {
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
  countBedgeDiv.style.position = "absolute";
  countBedgeDiv.style.top = "0";
  countBedgeDiv.style.left = "80%";
  countBedgeDiv.style.backgroundColor = "#252B39";
  countBedgeDiv.style.borderRadius = "50%";
  countBedgeDiv.style.padding = "4px 6px";
  countBedgeDiv.style.fontSize = "12px";
  countBedgeDiv.style.fontWeight = "700";
  countBedgeDiv.style.color = "white";
  countBedgeDiv.textContent = "10";
  dayDiv.appendChild(countBedgeDiv);

  // 가운데에 위치할 내부 div
  const innerDiv = document.createElement("div");
  innerDiv.style.display = "flex";
  innerDiv.style.alignItems = "center";
  innerDiv.style.gap = "2px";
  innerDiv.style.flexDirection = "column";
  innerDiv.style.backgroundColor = "#F7F7FA";
  innerDiv.style.borderRadius = "8px";
  innerDiv.style.padding = "17px 0";

  // span 4개 생성
  const colors = ["#27A644", "#E3B860", "#AA00D0", "#7AABF9"];
  const labels = ["1", "2", "3", "4"];

  for (let j = 0; j < colors.length; j++) {
    const span = document.createElement("span");
    span.style.borderRadius = "50%";
    span.style.width = "8px";
    span.style.height = "8px";
    span.style.textIndent = "-9999px";
    span.style.fontSize = "0";
    span.style.backgroundColor = colors[j];
    span.textContent = labels[j];
    innerDiv.appendChild(span);
  }

  dayDiv.appendChild(innerDiv);
  container.appendChild(dayDiv);

  return container;
}

// 일반 아이템의 content를 생성하는 함수 (group-label이 아닌 아이템용)
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

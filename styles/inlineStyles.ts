import { DataSet } from "vis-data";
import { groupsJson } from "../data/groupsData";

export function applyInlineStyles(
  container: HTMLElement | null,
  items: DataSet<any>
) {
  if (!container) return;

  // 모든 vis-label 찾기
  var labels = container.querySelectorAll(".vis-label");

  for (var i = 0; i < labels.length; i++) {
    var label = labels[i];
    var visInner = label.querySelector(".vis-inner");
    if (!visInner) continue;

    // 그룹 ID 추출 (vis-timeline이 data-group-id 또는 다른 속성으로 저장할 수 있음)
    // 또는 content를 통해 그룹 식별
    var contentDiv = visInner.querySelector("div");
    if (!contentDiv) continue;

    var roomNumberMatch = contentDiv.textContent?.match(/(\d+)호/);
    if (!roomNumberMatch) continue;

    var roomNumber = roomNumberMatch[1];
    var groupData = groupsJson.find(function (g) {
      return g.roomNumber === roomNumber;
    });

    if (!groupData) continue;

    // DOM 구조: .vis-inner > div > div:first-child (사이드바), div:last-child (콘텐츠)
    var innerDiv = visInner.querySelector("div");
    if (innerDiv) {
      // 최상위 div에 height: 100% 적용
      var topDiv = innerDiv as HTMLElement;
      topDiv.style.setProperty("height", "100%", "important");

      // 사이드바 div: .vis-inner > div > div:first-child
      var firstChildDiv = innerDiv.firstElementChild as HTMLElement;
      if (firstChildDiv && firstChildDiv.tagName === "DIV") {
        firstChildDiv.style.setProperty(
          "background-color",
          groupData.color.sidebar,
          "important"
        );
      }

      // 콘텐츠 div: .vis-inner > div > div:last-child
      var lastChildDiv = innerDiv.lastElementChild as HTMLElement;
      if (lastChildDiv && lastChildDiv.tagName === "DIV") {
        // 상태 span: .vis-inner > div > div:last-child > div:first-child > span
        var firstChildOfLast = lastChildDiv.firstElementChild;
        if (firstChildOfLast) {
          var statusSpan = firstChildOfLast.querySelector(
            "span"
          ) as HTMLElement;
          if (statusSpan) {
            statusSpan.style.setProperty(
              "color",
              groupData.color.statusText,
              "important"
            );
            statusSpan.style.setProperty(
              "border-color",
              groupData.color.statusBorder,
              "important"
            );
            statusSpan.style.setProperty(
              "border",
              "2px solid " + groupData.color.statusBorder,
              "important"
            );
          }
        }
      }
    }
  }

  // room-statuses 요소에 data-count 속성 추가 (자손의 div[data-count] 값 사용)
  var roomStatusItems = container.querySelectorAll(".vis-item.room-statuses");
  for (var i = 0; i < roomStatusItems.length; i++) {
    var roomStatusItem = roomStatusItems[i] as HTMLElement;
    // 이미 data-count가 설정되어 있으면 스킵
    if (roomStatusItem.hasAttribute("data-count")) {
      continue;
    }
    // 자손 중에 div[data-count] 찾기
    var countDiv = roomStatusItem.querySelector(
      "div[data-count]"
    ) as HTMLElement;
    if (countDiv) {
      var countValue = countDiv.getAttribute("data-count");
      if (countValue) {
        roomStatusItem.setAttribute("data-count", countValue);
      }
    }
  }
}

import { DataSet } from "vis-data";
import { groupsJson } from "../data/groupsData";

export function applyInlineStyles(
  container: HTMLElement | null,
  items: DataSet<any>
) {
  if (!container) return;

  // group-label 클래스를 가진 아이템만 스타일 적용
  var itemElements = container.querySelectorAll(".vis-item.group-label");
  for (var i = 0; i < itemElements.length; i++) {
    var itemElement = itemElements[i] as HTMLElement;
    var itemContent = itemElement.querySelector(".vis-item-content");
    if (itemContent) {
      var firstDiv = itemContent.querySelector("div");
      if (firstDiv) {
        // 인라인 스타일이 제거된 경우, 원본 데이터에서 스타일 다시 적용
        var itemId = itemElement.getAttribute("data-id");
        if (itemId) {
          var itemData = items.get(parseInt(itemId, 10));
          // content가 DOM 요소인 경우
          if (itemData && itemData.content && itemData.content.nodeType === 1) {
            // 기존 content를 새로운 요소로 교체
            itemContent.innerHTML = "";
            // DOM 요소를 복제하여 추가
            var clonedContent = itemData.content.cloneNode(true) as HTMLElement;
            itemContent.appendChild(clonedContent);
          } else if (itemData && itemData.content) {
            // content가 문자열인 경우
            var tempDiv = document.createElement("div");
            tempDiv.innerHTML = itemData.content;
            var sourceDiv = tempDiv.querySelector("div");
            if (sourceDiv) {
              var styles = sourceDiv.getAttribute("style");
              if (styles) {
                firstDiv.setAttribute("style", styles);
                // 자식 요소들도 스타일 적용
                var sourceSpans = sourceDiv.querySelectorAll("span");
                var targetSpans = firstDiv.querySelectorAll("span");
                for (
                  var j = 0;
                  j < sourceSpans.length && j < targetSpans.length;
                  j++
                ) {
                  var sourceStyle = sourceSpans[j].getAttribute("style");
                  if (sourceStyle) {
                    (targetSpans[j] as HTMLElement).setAttribute(
                      "style",
                      sourceStyle
                    );
                  }
                }
              }
            }
          }
        }
      }
    }
  }

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
}

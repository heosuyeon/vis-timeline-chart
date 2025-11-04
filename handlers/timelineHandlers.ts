import { Timeline } from "vis-timeline/peer";
import { DataSet } from "vis-data";
import { logEvent, setHoveredItem } from "./logHandlers";
import {
  showContextMenu,
  hideHoverMenu,
  showHoverMenu,
  getContextMenuShown,
  getIsHoverMenuHovered,
  getHoverMenuShown,
  getCurrentHoveredItemId,
  closeContextMenu,
  setCurrentHoveredItemId,
} from "./menuHandlers";
import { applyInlineStyles } from "../styles/inlineStyles";

export function setupTimelineEventHandlers(
  timeline: Timeline,
  items: DataSet<any>,
  container: HTMLElement | null
) {
  timeline.on("rangechange", function (properties) {
    logEvent("rangechange", properties);
  });

  timeline.on("rangechanged", function (properties) {
    logEvent("rangechanged", properties);
    setTimeout(function () {
      applyInlineStyles(container, items);
    }, 100);
  });

  timeline.on("select", function (properties) {
    logEvent("select", properties);
    // 선택 상태 변경 시 스타일 다시 적용
    setTimeout(function () {
      applyInlineStyles(container, items);
    }, 10);
  });

  timeline.on("itemover", function (properties) {
    logEvent("itemover", properties);
    setHoveredItem(properties.item);
    // 메뉴 표시는 mouseMove에서 처리
  });

  timeline.on("itemout", function (properties) {
    logEvent("itemout", properties);
    setHoveredItem("none");
    // 메뉴 숨김은 mouseMove에서 처리
  });

  timeline.on("click", function (properties) {
    logEvent("click", properties);

    var existingMenu = document.getElementById("contextMenu");
    var existingItem = existingMenu
      ? (existingMenu as any).timelineProperties?.item
      : null;

    // 아이템을 클릭한 경우
    if (properties.item && properties.event) {
      // 클릭 이벤트 전파 중지 (메뉴를 닫는 리스너가 먼저 실행되지 않도록)
      properties.event.stopPropagation();

      // 호버 메뉴 숨기기
      hideHoverMenu();

      // 다른 아이템을 클릭한 경우 또는 같은 아이템을 다시 클릭한 경우
      if (existingMenu && existingItem !== properties.item) {
        // 기존 메뉴 닫기
        closeContextMenu();
      } else if (existingMenu && existingItem === properties.item) {
        // 같은 아이템을 다시 클릭한 경우 메뉴 닫기
        closeContextMenu();
      }

      // 약간의 지연을 주어 현재 클릭 이벤트가 처리된 후 메뉴 표시
      setTimeout(function () {
        showContextMenu(
          properties.event.clientX,
          properties.event.clientY,
          properties
        );
      }, 10);
    } else {
      // 아이템 외부를 클릭한 경우 메뉴 닫기
      if (existingMenu) {
        closeContextMenu();
      }
    }
  });

  timeline.on("doubleClick", function (properties) {
    logEvent("doubleClick", properties);
  });

  timeline.on("contextmenu", function (properties) {
    logEvent("contextmenu", properties);
  });

  timeline.on("mouseDown", function (properties) {
    logEvent("mouseDown", properties);
  });

  timeline.on("mouseUp", function (properties) {
    logEvent("mouseUp", properties);
  });

  timeline.on("mouseMove", function (properties) {
    logEvent("mouseMove", properties);

    // 클릭 컨텍스트 메뉴가 열려있으면 호버 메뉴 표시하지 않음
    if (getContextMenuShown()) {
      return;
    }

    // 호버 메뉴 위에 마우스가 있으면 완전히 무시
    if (getIsHoverMenuHovered()) {
      return;
    }

    // 아이템 위에 있을 때
    if (properties.item && properties.event) {
      // 같은 아이템이고 메뉴가 이미 표시되어 있으면 위치 계산하지 않음
      if (
        getHoverMenuShown() &&
        getCurrentHoveredItemId() === properties.item
      ) {
        return;
      }

      // 다른 아이템으로 변경된 경우에만 위치 계산 (아이템 ID 저장)
      var itemY = properties.event.clientY;

      // 아이템 ID로 DOM 요소 찾기
      if (properties.item) {
        var itemElement: HTMLElement | null = null;

        // 방법 1: data-id 속성으로 찾기
        itemElement = document.querySelector(
          '.vis-item[data-id="' + properties.item + '"]'
        ) as HTMLElement;

        // 방법 2: 타임라인 내부에서 마우스 위치로 찾기
        if (!itemElement && properties.event) {
          var timelineItems = document.querySelectorAll(
            ".vis-timeline .vis-item"
          );
          for (var i = 0; i < timelineItems.length; i++) {
            var item = timelineItems[i] as HTMLElement;
            var rect = item.getBoundingClientRect();
            if (
              properties.event.clientY >= rect.top &&
              properties.event.clientY <= rect.bottom &&
              properties.event.clientX >= rect.left &&
              properties.event.clientX <= rect.right
            ) {
              itemElement = item;
              break;
            }
          }
        }

        if (itemElement) {
          var rect = itemElement.getBoundingClientRect();
          itemY = rect.top + rect.height / 2; // 아이템의 정확한 중간 y 위치
        }
      }

      showHoverMenu(properties.event.clientX, itemY, properties, items);
    } else {
      // 아이템 위가 아니고 메뉴 위도 아니면 메뉴 숨기기
      if (!getIsHoverMenuHovered()) {
        hideHoverMenu();
      }
    }
  });

  items.on("*", function (event, properties) {
    logEvent(event, properties);
  });
}

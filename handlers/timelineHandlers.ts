import { Timeline } from "vis-timeline/peer";
import { DataSet } from "vis-data";
import { logEvent, setHoveredItem } from "./logHandlers";
import {
  showContextMenu,
  showGroupContextMenu,
  hideHoverMenu,
  showHoverMenu,
  getContextMenuShown,
  getIsHoverMenuHovered,
  getHoverMenuShown,
  getCurrentHoveredItemId,
  closeContextMenu,
} from "./menuHandlers";
import { applyInlineStyles } from "../styles/inlineStyles";
import { groupsJson } from "../data/groupsData";

let currentVisibleArrows: string[] = []; // 현재 보이는 arrow ID들

export function setupTimelineEventHandlers(
  timeline: Timeline,
  items: DataSet<any>,
  container: HTMLElement | null,
  myArrows?: any,
  arrowsSpecs?: any[]
) {
  timeline.on("rangechange", function (properties) {
    logEvent("rangechange", properties);
  });

  timeline.on("rangechanged", function (properties) {
    logEvent("rangechanged", properties);
    setTimeout(function () {
      applyInlineStyles(container, items);
      // 차트 이동 시 현재 보이는 arrow는 CSS로 유지 (자동으로 위치 업데이트됨)
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

    // 그룹 레이블 클릭 감지 (아이템 클릭이 아닐 때)
    if (!properties.item && properties.event) {
      var mouseX = properties.event.clientX;
      var mouseY = properties.event.clientY;

      // 모든 .vis-label 요소 찾기
      var allLabels = document.querySelectorAll(".vis-label");
      var clickedGroupId: number | null = null;

      for (var i = 0; i < allLabels.length; i++) {
        var label = allLabels[i] as HTMLElement;
        var rect = label.getBoundingClientRect();

        // 클릭 위치가 이 레이블 영역 안에 있는지 확인
        if (
          mouseX >= rect.left &&
          mouseX <= rect.right &&
          mouseY >= rect.top &&
          mouseY <= rect.bottom
        ) {
          // .vis-inner 안에서 방 번호 추출
          var visInner = label.querySelector(".vis-inner");
          if (visInner) {
            var contentDiv = visInner.querySelector("div");
            if (contentDiv) {
              var textContent = contentDiv.textContent || "";
              var roomNumberMatch = textContent.match(/(\d+)호/);
              if (roomNumberMatch) {
                var roomNumber = roomNumberMatch[1];
                var groupData = groupsJson.find(function (g: any) {
                  return g.roomNumber === roomNumber;
                });
                if (groupData) {
                  clickedGroupId = groupData.id;
                  break;
                }
              }
            }
          }
        }
      }

      // 그룹 레이블을 클릭한 경우
      if (clickedGroupId !== null) {
        // 클릭 이벤트 전파 중지
        properties.event.stopPropagation();

        // 호버 메뉴 숨기기
        hideHoverMenu();

        // 기존 메뉴가 있으면 닫기 (다른 그룹이든 같은 그룹이든 상관없이)
        if (existingMenu) {
          closeContextMenu();
        }

        // 그룹 정보를 properties에 추가
        var groupProperties = {
          ...properties,
          group: clickedGroupId,
          item: null,
        };

        // 약간의 지연을 주어 현재 클릭 이벤트가 처리된 후 메뉴 표시
        setTimeout(function () {
          showGroupContextMenu(
            properties.event.clientX,
            properties.event.clientY,
            groupProperties
          );
        }, 10);
        return;
      }
    }

    // 아이템을 클릭한 경우
    if (properties.item && properties.event) {
      // 아이템 데이터 가져오기
      var itemData: any = items.get(properties.item);
      var isGroupLabel = itemData && itemData.className === "room-statuses";

      // room-statuses 아이템을 클릭한 경우 컨텍스트 메뉴 표시하지 않음
      if (isGroupLabel) {
        // 호버 메뉴 숨기기
        hideHoverMenu();
        // 기존 컨텍스트 메뉴가 있으면 닫기
        if (existingMenu) {
          closeContextMenu();
        }
        return; // room-statuses 클릭 시 더 이상 처리하지 않음
      }

      // 일반 아이템인 경우에만 컨텍스트 메뉴 표시
      // 클릭 이벤트 전파 중지 (메뉴를 닫는 리스너가 먼저 실행되지 않도록)
      properties.event.stopPropagation();

      // 호버 메뉴 숨기기
      hideHoverMenu();

      // 기존 메뉴가 있으면 닫기 (다른 아이템이든 같은 아이템이든 상관없이)
      if (existingMenu) {
        closeContextMenu();
      }

      // 클릭한 아이템과 연관된 arrow만 보이게 하기
      if (myArrows && arrowsSpecs) {
        const clickedItemId = String(properties.item);

        // 모든 화살표 먼저 숨기기
        arrowsSpecs.forEach((arrowSpec: any, index: number) => {
          const pathElement = (myArrows as any)._dependencyPath[index];
          if (pathElement) {
            pathElement.style.display = "none";
          }
        });

        // 클릭한 아이템과 연관된 화살표만 보이게 하기
        currentVisibleArrows = [];
        arrowsSpecs.forEach((arrowSpec: any, index: number) => {
          // 클릭한 아이템이 시작점(id_item_1)인 경우만 보이게 하기
          const isRelated = String(arrowSpec.id_item_1) === clickedItemId;

          if (isRelated) {
            const pathElement = (myArrows as any)._dependencyPath[index];
            if (pathElement) {
              pathElement.style.display = "block";
              currentVisibleArrows.push(String(arrowSpec.id));
            }
          }
        });
      }

      // 약간의 지연을 주어 현재 클릭 이벤트가 처리된 후 메뉴 표시
      setTimeout(function () {
        showContextMenu(
          properties.event.clientX,
          properties.event.clientY,
          properties,
          items
        );
      }, 10);
    } else {
      // 아이템 외부를 클릭한 경우 메뉴 닫기 및 모든 arrow 숨기기
      if (existingMenu) {
        closeContextMenu();
      }

      // 모든 화살표 숨기기
      if (myArrows && arrowsSpecs) {
        arrowsSpecs.forEach((arrowSpec: any, index: number) => {
          const pathElement = (myArrows as any)._dependencyPath[index];
          if (pathElement) {
            pathElement.style.display = "none";
          }
        });
        currentVisibleArrows = [];
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
      // 아이템 데이터 가져오기
      var itemData: any = items.get(properties.item);
      var isGroupLabel =
        itemData &&
        itemData.className &&
        String(itemData.className).includes("room-statuses");

      // room-statuses 아이템인 경우
      if (isGroupLabel) {
        // 같은 아이템이고 메뉴가 이미 표시되어 있으면 위치 계산하지 않음
        if (
          getHoverMenuShown() &&
          getCurrentHoveredItemId() === properties.item
        ) {
          return;
        }

        // 아이템 요소 찾기
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

        var itemY = properties.event.clientY;
        if (itemElement) {
          var rect = itemElement.getBoundingClientRect();
          itemY = rect.top + rect.height / 2; // 아이템의 정확한 중간 y 위치
        }

        showHoverMenu(properties.event.clientX, itemY, properties, items);
      } else {
        // 일반 아이템인 경우 기존 로직 유지
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
      }
    } else {
      // 아이템 위가 아니면 메뉴 숨기기
      if (!getIsHoverMenuHovered()) {
        hideHoverMenu();
      }
    }
  });

  items.on("*", function (event, properties) {
    logEvent(event, properties);
  });
}

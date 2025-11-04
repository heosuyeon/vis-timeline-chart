import { Timeline } from "vis-timeline/peer";
import { DataSet } from "vis-data";
import "vis-timeline/styles/vis-timeline-graph2d.min.css";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
const moment = require("moment");
require("moment/locale/ko");
moment.locale("ko");

var groupsJson = [
  {
    id: 0,
    roomNumber: "202",
    roomName: "귀여운방",
    status: "판매중",
    type: "원룸",
    window: "외창",
    monthlyRent: 200000,
    currentGuest: "이소정",
    stayPeriod: "25-11-02~25-11-31",
    value: 1,
    color: {
      sidebar: "green",
      statusBorder: "green",
      statusText: "green",
    },
    nestedGroups: [11, 12, 13],
  },
  {
    id: 1,
    roomNumber: "203",
    roomName: "귀여운방",
    status: "판매중",
    type: "원룸",
    window: "외창",
    monthlyRent: 210000,
    currentGuest: "이소정",
    stayPeriod: "25-11-02~25-11-31",
    value: 2,
    color: {
      sidebar: "blue",
      statusBorder: "blue",
      statusText: "blue",
    },
  },
  {
    id: 2,
    roomNumber: "204",
    roomName: "귀여운방",
    status: "판매중",
    type: "원룸",
    window: "외창",
    monthlyRent: 220000,
    currentGuest: "이소정",
    stayPeriod: "25-11-02~25-11-31",
    value: 3,
    color: {
      sidebar: "orange",
      statusBorder: "orange",
      statusText: "orange",
    },
  },
];

var groups = new DataSet<any>();

groups.add([
  {
    id: 1,
    content: "Lee",
    nestedGroups: [11, 12, 13],
  },
  {
    id: 2,
    content: "invisible group",
    visible: false,
  },
  {
    id: 3,
    content: "John",
    nestedGroups: [14],
    showNested: false,
  },
  {
    id: 4,
    content: "Alson",
  },
]);

groups.add([
  {
    id: 11,
    content: "cook",
  },
  {
    id: 12,
    content: "shop",
  },
  {
    id: 13,
    content: "clean house",
  },
  {
    id: 14,
    content: "wash dishes",
  },
]);

// create a dataset with items
// note that months are zero-based in the JavaScript Date object, so month 3 is April
const items = new DataSet<any>([
  {
    id: 0,
    group: 0,
    content: "item 0",
    start: new Date("2025-10-01"),
    end: new Date("2025-11-30"),
  },
  {
    id: 1,
    group: 0,
    content: "item 1",
    start: new Date("2025-10-01"),
    end: new Date("2025-10-31"),
  },
  {
    id: 2,
    group: 0,
    content: "item 2",
    start: new Date("2025-11-01"),
    end: new Date("2025-11-30"),
  },

  {
    id: 5,
    group: 1,
    content: "item 5",
    start: new Date("2025-11-04"),
    end: new Date("2026-01-05"),
    type: "point",
  },
  {
    id: 6,
    group: 11,
    content: "item 6",
    start: new Date("2025-11-04"),
    end: new Date("2025-12-04"),
  },
  {
    id: 7,
    group: 11,
    content: "item 7",
    start: new Date("2025-12-05"),
    end: new Date("2026-01-05"),
  },
]);

// create visualization
var container = document.getElementById("visualization");
var options = {
  // option groupOrder can be a property name or a sort function
  // the sort function must compare two groups and return a value
  //     > 0 when a > b
  //     < 0 when a < b
  //       0 when a == b
  groupOrder: function (a, b) {
    return a.value - b.value;
  },
  // editable: true,
  // start: new Date(),
  // end: new Date(100000 * 60 * 60 * 24 + new Date().valueOf()),
  // loadingScreenTemplate: function () {
  //   return "<h1>Loading...</h1>";
  // },
  orientation: "top",
  stack: true,
  horizontalScroll: true,
  horizontalScrollInvert: false,
  verticalScroll: true,
  zoomKey: "ctrlKey",
  maxHeight: 400,

  margin: {
    item: 0,
    axis: 5,
  },

  start: new Date(),
  end: new Date(1000 * 60 * 60 * 24 + new Date().valueOf()),

  // min: new Date(2025, 9, 1), // lower limit of visible range
  // max: new Date(2026, 1, 31), // upper limit of visible range
  // zoomMin: 1000 * 60 * 60 * 24 * 7, // 최소 7일 까지 보여줌
  zoomMax: 1000 * 60 * 60 * 24 * 31 * 3, // about three months in milliseconds

  // format: {
  //   minorLabels: function (date: Date, scale: string, step: number) {
  //     if (scale === "month") {
  //       var d = new Date(date);
  //       var day = d.getDate();
  //       var weekday = moment(d).format("ddd"); // 월, 화, 수, 목, 금, 토, 일
  //       return day + "일 (" + weekday + ")";
  //     }
  //   },

  //   majorLabels: function (date: Date, scale: string, step: number) {
  //     var d = new Date(date);
  //     if (scale === "month") {
  //       return moment(d).format("YYYY년 M월");
  //     } else if (scale === "year") {
  //       return moment(d).format("YYYY년");
  //     }
  //     return moment(d).format("YYYY-MM-DD");
  //   },
  // },

  // timeAxis: {
  //   scale: "day",
  //   step: 1,
  // },

  onInitialDrawComplete: function () {
    logEvent("Timeline initial draw completed", {});
    applyInlineStyles();
  },
  onMove: function (item, callback) {
    var title =
      "Do you really want to move the item to\n" +
      "start: " +
      item.start +
      "\n" +
      "end: " +
      item.end +
      "?";

    prettyConfirm("Move item", title, function (ok) {
      if (ok) {
        callback(item); // send back item as confirmation (can be changed)
      } else {
        callback(null); // cancel editing item
      }
    });
  },
};

var timeline = new Timeline(container!, items, groups, options as any);

// 인라인 스타일 직접 적용 함수
function applyInlineStyles() {
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
}

timeline.on("rangechange", function (properties) {
  logEvent("rangechange", properties);
});

timeline.on("rangechanged", function (properties) {
  logEvent("rangechanged", properties);
  setTimeout(applyInlineStyles, 50);
});

timeline.on("select", function (properties) {
  logEvent("select", properties);
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
      if (currentCloseMenuHandler) {
        document.removeEventListener("click", currentCloseMenuHandler);
        currentCloseMenuHandler = null;
      }
      existingMenu.style.display = "none";
      contextMenuShown = false;
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
    if (existingMenu && currentCloseMenuHandler) {
      document.removeEventListener("click", currentCloseMenuHandler);
      currentCloseMenuHandler = null;
      existingMenu.style.display = "none";
      contextMenuShown = false;
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
  if (contextMenuShown) {
    return;
  }

  // 호버 메뉴 위에 마우스가 있으면 완전히 무시
  if (isHoverMenuHovered) {
    return;
  }

  // 아이템 위에 있을 때
  if (properties.item && properties.event) {
    // 같은 아이템이고 메뉴가 이미 표시되어 있으면 위치 계산하지 않음
    if (hoverMenuShown && currentHoveredItemId === properties.item) {
      return;
    }

    // 다른 아이템으로 변경된 경우에만 위치 계산 (아이템 ID 저장)
    currentHoveredItemId = properties.item;

    // 아이템의 중간 y 위치 계산
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

    showHoverMenu(properties.event.clientX, itemY, properties);
  } else {
    // 아이템 위가 아니고 메뉴 위도 아니면 메뉴 숨기기
    if (!isHoverMenuHovered) {
      hideHoverMenu();
    }
  }
});

// other possible events:

// timeline.on('mouseOver', function (properties) {
//   logEvent('mouseOver', properties);
// });

// timeline.on("mouseMove", function (properties) {
//   logEvent("mouseMove", properties);
// });

items.on("*", function (event, properties) {
  logEvent(event, properties);
});

function stringifyObject(object) {
  if (!object) return;
  var replacer = function (key, value) {
    if (value && value.tagName) {
      return "DOM Element";
    } else {
      return value;
    }
  };
  return JSON.stringify(object, replacer);
}

function logEvent(event, properties) {
  var log = document.getElementById("log");
  if (!log) return;
  var msg = document.createElement("div");
  msg.innerHTML =
    "event=" +
    JSON.stringify(event) +
    ", " +
    "properties=" +
    stringifyObject(properties);
  log.firstChild ? log.insertBefore(msg, log.firstChild) : log.appendChild(msg);
}

function setHoveredItem(id) {
  var hoveredItem = document.getElementById("hoveredItem");
  if (!hoveredItem) return;
  hoveredItem.innerHTML = "hoveredItem=" + id;
}

function prettyConfirm(title, text, callback) {
  Swal.fire({
    title: title,
    text: text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
  }).then((result) => {
    callback(result.value);
  });
}

// 전역 변수로 현재 closeMenu 함수 추적
var currentCloseMenuHandler: ((event: MouseEvent) => void) | null = null;

// 호버 메뉴 관련 플래그
var isHoverMenuHovered: boolean = false;
var hoverMenuShown: boolean = false;
var currentHoveredItemId: any = null;

// 클릭 컨텍스트 메뉴 상태 플래그
var contextMenuShown: boolean = false;

function showContextMenu(x: number, y: number, properties: any) {
  var contextMenu = document.getElementById("contextMenu");
  if (!contextMenu) return;

  // 클릭 컨텍스트 메뉴 표시 플래그 설정
  contextMenuShown = true;

  // 기존 리스너가 있으면 제거
  if (currentCloseMenuHandler) {
    document.removeEventListener("click", currentCloseMenuHandler);
    currentCloseMenuHandler = null;
  }

  // 먼저 보이게 해서 크기를 측정
  contextMenu.style.visibility = "hidden";
  contextMenu.style.display = "block";

  // 메뉴 크기 가져오기
  var menuWidth = contextMenu.offsetWidth || 200;
  var menuHeight = contextMenu.offsetHeight || 150;

  // 뷰포트 크기
  var viewportWidth = window.innerWidth;
  var viewportHeight = window.innerHeight;

  // 위치 계산
  var leftPos = x;
  var topPos = y;

  // 오른쪽 경계 체크
  if (leftPos + menuWidth > viewportWidth) {
    leftPos = viewportWidth - menuWidth - 10;
    if (leftPos < 0) leftPos = 10;
  }

  // 아래쪽 경계 체크
  if (topPos + menuHeight > viewportHeight) {
    topPos = viewportHeight - menuHeight - 10;
    if (topPos < 0) topPos = 10;
  }

  // 왼쪽 경계 체크
  if (leftPos < 0) leftPos = 10;

  // 위쪽 경계 체크
  if (topPos < 0) topPos = 10;

  contextMenu.style.left = leftPos + "px";
  contextMenu.style.top = topPos + "px";
  contextMenu.style.visibility = "visible";

  // 클릭된 아이템 정보 저장
  (contextMenu as any).timelineProperties = properties;

  // 메뉴 외부 클릭 시 닫기
  var closeMenu = function (event: MouseEvent) {
    var target = event.target as Node;
    if (contextMenu && !contextMenu.contains(target)) {
      // 타임라인 내부 클릭은 timeline.on('click')에서 처리하므로 여기서는 무시
      var timelineContainer = document.getElementById("visualization");
      if (timelineContainer && timelineContainer.contains(target)) {
        return; // 타임라인 내부 클릭은 timeline.on('click')에서 처리
      }

      // 타임라인 외부 클릭 시 메뉴 닫기
      contextMenu.style.display = "none";
      contextMenuShown = false;
      if (currentCloseMenuHandler) {
        document.removeEventListener("click", currentCloseMenuHandler);
        currentCloseMenuHandler = null;
      }
    }
  };

  // 전역 변수에 저장
  currentCloseMenuHandler = closeMenu;

  // 약간의 지연을 주어 현재 클릭 이벤트가 처리된 후 리스너 추가
  setTimeout(function () {
    document.addEventListener("click", closeMenu);
  }, 0);
}

// 컨텍스트 메뉴 항목 클릭 이벤트 처리
document.addEventListener("DOMContentLoaded", function () {
  var contextMenu = document.getElementById("contextMenu");
  if (!contextMenu) return;

  var menuItems = contextMenu.querySelectorAll(".context-menu-item");
  menuItems.forEach(function (item) {
    item.addEventListener("click", function (e) {
      e.stopPropagation();
      var action = (this as HTMLElement).getAttribute("data-action");
      var properties = (contextMenu as any).timelineProperties;

      // 리스너 제거
      if (currentCloseMenuHandler) {
        document.removeEventListener("click", currentCloseMenuHandler);
        currentCloseMenuHandler = null;
      }

      handleContextMenuAction(action, properties);
      contextMenu.style.display = "none";
      contextMenuShown = false;
    });
  });

  // 호버 메뉴에 마우스 이벤트 추가
  var hoverMenu = document.getElementById("hoverMenu");
  if (hoverMenu) {
    hoverMenu.addEventListener("mouseenter", function () {
      isHoverMenuHovered = true;
    });
    hoverMenu.addEventListener("mouseleave", function () {
      isHoverMenuHovered = false;
      // 메뉴에서 벗어나면 숨기기
      hideHoverMenu();
    });
  }
});

function handleContextMenuAction(action: string, properties: any) {
  switch (action) {
    case "contract":
      Swal.fire(
        "계약내용 관리 및 방 이동",
        "선택된 기능을 실행합니다.",
        "info"
      );
      break;
    case "deposit":
      Swal.fire("예약금 요청", "선택된 기능을 실행합니다.", "info");
      break;
    case "guarantee":
      Swal.fire(
        "보증금 입금일시 / 반환일시",
        "선택된 기능을 실행합니다.",
        "info"
      );
      break;
    case "payment":
      Swal.fire("결제 및 정산 현황", "선택된 기능을 실행합니다.", "info");
      break;
    case "memo":
      Swal.fire("메모", "선택된 기능을 실행합니다.", "info");
      break;
    case "checkout":
      Swal.fire("퇴실처리", "선택된 기능을 실행합니다.", "info");
      break;
  }
  logEvent("contextMenuAction", { action: action, properties: properties });
}

function showHoverMenu(x: number, y: number, properties: any) {
  var hoverMenu = document.getElementById("hoverMenu");
  if (!hoverMenu) return;

  // 클릭 컨텍스트 메뉴가 열려있으면 호버 메뉴 표시하지 않음
  if (contextMenuShown) {
    return;
  }

  // 아이템 정보 가져오기
  var item = properties.item;
  if (!item) return;

  // 같은 아이템이고 이미 메뉴가 표시되어 있으면 위치 변경하지 않음
  if (
    hoverMenuShown &&
    currentHoveredItemId === item &&
    hoverMenu.style.display === "block"
  ) {
    return;
  }

  // 아이템 데이터에서 정보 추출 (실제 데이터 구조에 맞게 수정 필요)
  var itemData: any = items.get(item);
  if (!itemData) return;

  // 메뉴 내용 업데이트
  // 예제 데이터 - 실제로는 itemData에서 가져와야 함
  var roomStatus =
    "이용중(" + moment(itemData.start).format("YYYY-MM-DD HH:mm:ss") + ")";
  var contractNumber = itemData.contractNumber || "12345678";
  var contractDate = moment(itemData.start).format("YYYY-MM-DD");
  var guest = itemData.guest || "김한수 / 34 / M(010-1234-5678)";

  document.getElementById("hoverRoomStatus")!.innerHTML = roomStatus;
  document.getElementById("hoverContractNumber")!.innerHTML = contractNumber;
  document.getElementById("hoverContractDate")!.innerHTML = contractDate;
  document.getElementById("hoverGuest")!.innerHTML = guest;

  // 먼저 보이게 해서 크기를 측정
  hoverMenu.style.visibility = "hidden";
  hoverMenu.style.display = "block";

  // 메뉴 크기 가져오기
  var menuWidth = hoverMenu.offsetWidth || 280;
  var menuHeight = hoverMenu.offsetHeight || 150;

  // 뷰포트 크기
  var viewportWidth = window.innerWidth;
  var viewportHeight = window.innerHeight;

  // 위치 계산
  var leftPos = x;
  var topPos = y;

  // 오른쪽 경계 체크
  if (leftPos + menuWidth > viewportWidth) {
    leftPos = viewportWidth - menuWidth - 10;
    if (leftPos < 0) leftPos = 10;
  }

  // 아래쪽 경계 체크
  if (topPos + menuHeight > viewportHeight) {
    topPos = viewportHeight - menuHeight - 10;
    if (topPos < 0) topPos = 10;
  }

  // 왼쪽 경계 체크
  if (leftPos < 0) leftPos = 10;

  // 위쪽 경계 체크
  if (topPos < 0) topPos = 10;

  // 위치 설정
  hoverMenu.style.left = leftPos + "px";
  hoverMenu.style.top = topPos + "px";

  // 현재 호버된 아이템 ID 저장
  currentHoveredItemId = item;

  // 위치 계산 완료 후 즉시 표시
  hoverMenu.style.visibility = "visible";
  hoverMenuShown = true;
}

function hideHoverMenu() {
  var hoverMenu = document.getElementById("hoverMenu");
  if (!hoverMenu) return;
  hoverMenu.style.display = "none";
  hoverMenuShown = false;
  currentHoveredItemId = null;
}

import Swal from "sweetalert2";
import { DataSet } from "vis-data";
import { logEvent } from "./logHandlers";
import { groupsJson } from "../data/groupsData";
const moment = require("moment");

// 전역 변수로 현재 closeMenu 함수 추적
var currentCloseMenuHandler: ((event: MouseEvent) => void) | null = null;

// 호버 메뉴 관련 플래그
var isHoverMenuHovered: boolean = false;
var hoverMenuShown: boolean = false;
var currentHoveredItemId: any = null;

// 클릭 컨텍스트 메뉴 상태 플래그
var contextMenuShown: boolean = false;

// getter 함수들
export function getContextMenuShown(): boolean {
  return contextMenuShown;
}

export function getIsHoverMenuHovered(): boolean {
  return isHoverMenuHovered;
}

export function getHoverMenuShown(): boolean {
  return hoverMenuShown;
}

export function getCurrentHoveredItemId(): any {
  return currentHoveredItemId;
}

export function getCurrentCloseMenuHandler():
  | ((event: MouseEvent) => void)
  | null {
  return currentCloseMenuHandler;
}

// 메뉴 닫기 함수
export function closeContextMenu() {
  var existingMenu = document.getElementById("contextMenu");
  if (existingMenu && currentCloseMenuHandler) {
    document.removeEventListener("click", currentCloseMenuHandler);
    currentCloseMenuHandler = null;
    existingMenu.style.display = "none";
    contextMenuShown = false;
  }
}

export function showContextMenu(
  x: number,
  y: number,
  properties: any,
  items?: DataSet<any>
) {
  var contextMenu = document.getElementById("contextMenu");
  if (!contextMenu) return;

  // 클릭 컨텍스트 메뉴 표시 플래그 설정
  contextMenuShown = true;

  // 기존 리스너가 있으면 제거
  if (currentCloseMenuHandler) {
    document.removeEventListener("click", currentCloseMenuHandler);
    currentCloseMenuHandler = null;
  }

  // 아이템이 지나간 일정인지 확인
  var isPastItem = false;
  if (properties.item && items) {
    var itemData: any = items.get(properties.item);
    if (
      itemData &&
      itemData.className &&
      itemData.className.includes("-past")
    ) {
      isPastItem = true;
    }
  }

  // 일반 아이템용 메뉴 항목 동적 생성 (지나간 일정 여부에 따라 다름)
  var menuItems: string[];
  var actionMap: { [key: string]: string };

  if (isPastItem) {
    // 지나간 일정용 메뉴
    menuItems = [
      "계약내용 관리 및 방 이동",
      "---", // 구분선
      "결제 및 정산 현황",
      "---", // 구분선
      "입실자 평가 및 후기 관리",
      "메모",
      "계약 내용 삭제",
    ];

    actionMap = {
      "계약내용 관리 및 방 이동": "contract",
      "결제 및 정산 현황": "payment",
      "입실자 평가 및 후기 관리": "review",
      메모: "memo",
      "계약 내용 삭제": "delete",
    };
  } else {
    // 일반 아이템용 메뉴
    menuItems = [
      "계약내용 관리 및 방 이동",
      "---", // 구분선
      "예약금 요청",
      "보증금 입금일시 / 반환일시",
      "결제 및 정산 현황",
      "---", // 구분선
      "메모",
      "퇴실처리",
    ];

    actionMap = {
      "계약내용 관리 및 방 이동": "contract",
      "예약금 요청": "deposit",
      "보증금 입금일시 / 반환일시": "guarantee",
      "결제 및 정산 현황": "payment",
      메모: "memo",
      퇴실처리: "checkout",
    };
  }

  contextMenu.innerHTML = "";
  for (var i = 0; i < menuItems.length; i++) {
    var menuItem = menuItems[i];
    if (menuItem === "---") {
      // 구분선
      var divider = document.createElement("div");
      divider.className = "context-menu-divider";
      contextMenu.appendChild(divider);
    } else {
      // 메뉴 항목
      var item = document.createElement("div");
      item.className = "context-menu-item";
      item.textContent = menuItem;
      var action = actionMap[menuItem];
      if (action) {
        item.setAttribute("data-action", action);
      }
      contextMenu.appendChild(item);
    }
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

export function showGroupContextMenu(x: number, y: number, properties: any) {
  var contextMenu = document.getElementById("contextMenu");
  if (!contextMenu) return;

  // 클릭 컨텍스트 메뉴 표시 플래그 설정
  contextMenuShown = true;

  // 기존 리스너가 있으면 제거
  if (currentCloseMenuHandler) {
    document.removeEventListener("click", currentCloseMenuHandler);
    currentCloseMenuHandler = null;
  }

  // 그룹용 메뉴 항목 동적 생성
  const menuItems = [
    "방 정보 수정",
    "계약 현황",
    "판매관리",
    "---", // 구분선
    "결제 요청",
    "매출 / 정산 / 환불 현황",
    "보증금 현황",
    "룸투어 예약 관리",
    "---", // 구분선
    "입실자 평가 및 후기 관리",
    "메모",
    "관리 히스토리",
    "방 삭제",
  ];

  contextMenu.innerHTML = "";
  for (var i = 0; i < menuItems.length; i++) {
    var menuItem = menuItems[i];
    if (menuItem === "---") {
      // 구분선
      var divider = document.createElement("div");
      divider.className = "context-menu-divider";
      contextMenu.appendChild(divider);
    } else {
      // 메뉴 항목
      var item = document.createElement("div");
      item.className = "context-menu-item";
      item.textContent = menuItem;
      item.setAttribute("data-action", "group-" + menuItem);
      contextMenu.appendChild(item);
    }
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

  // 클릭된 그룹 정보 저장
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

export function handleContextMenuAction(action: string, properties: any) {
  // 그룹 메뉴 액션인지 확인
  if (action && action.startsWith("group-")) {
    var groupAction = action.replace("group-", "");
    var groupId = properties.group;

    Swal.fire(
      groupAction,
      "그룹 ID: " + groupId + " - 선택된 기능을 실행합니다.",
      "info"
    );
    logEvent("groupContextMenuAction", {
      action: groupAction,
      groupId: groupId,
      properties: properties,
    });
    return;
  }

  // 일반 아이템 메뉴 액션
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
    case "review":
      Swal.fire(
        "입실자 평가 및 후기 관리",
        "선택된 기능을 실행합니다.",
        "info"
      );
      break;
    case "delete":
      Swal.fire("계약 내용 삭제", "선택된 기능을 실행합니다.", "info");
      break;
  }
  logEvent("contextMenuAction", { action: action, properties: properties });
}

export function showHoverMenu(
  x: number,
  y: number,
  properties: any,
  items: DataSet<any>
) {
  var hoverMenu = document.getElementById("hoverMenu");
  if (!hoverMenu) return;

  // 클릭 컨텍스트 메뉴가 열려있으면 호버 메뉴 표시하지 않음
  if (getContextMenuShown()) {
    return;
  }

  // 아이템 정보 가져오기
  var item = properties.item;
  if (!item) return;

  // 같은 아이템이고 이미 메뉴가 표시되어 있으면 위치 변경하지 않음
  if (
    getHoverMenuShown() &&
    getCurrentHoveredItemId() === item &&
    hoverMenu.style.display === "block"
  ) {
    return;
  }

  // 아이템 데이터에서 정보 추출 (실제 데이터 구조에 맞게 수정 필요)
  var itemData: any = items.get(item);
  if (!itemData) return;

  // 메뉴 내용 먼저 업데이트 (크기 측정 전에)
  // room-statuses 아이템인 경우 roomStatuses 리스트 표시
  if (itemData.className === "room-statuses" && itemData.roomStatuses) {
    // 기존 내용 제거
    hoverMenu.innerHTML = "";
    hoverMenu.classList.add("black-bg");
    hoverMenu.classList.remove("white-bg");

    // roomStatuses를 timestamp 기준으로 날짜순 정렬
    var statuses = [...itemData.roomStatuses].sort(function (a: any, b: any) {
      // timestamp 형식: "25-10-29 09:24:00" -> "2025-10-29 09:24:00"으로 변환
      var parseTimestamp = function (ts: string): Date {
        var parts = ts.split(" ");
        var datePart = parts[0];
        var timePart = parts[1] || "00:00:00";
        var dateParts = datePart.split("-");
        var year = "20" + dateParts[0];
        return new Date(
          year + "-" + dateParts[1] + "-" + dateParts[2] + " " + timePart
        );
      };

      var dateA = parseTimestamp(a.timestamp);
      var dateB = parseTimestamp(b.timestamp);
      return dateA.getTime() - dateB.getTime();
    });

    // 상태 리스트 표시
    for (var i = 0; i < statuses.length; i++) {
      var status = statuses[i];
      var row = document.createElement("div");
      row.className = "hover-menu-row";
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.gap = "8px";

      // 왼쪽에 10x10 동그라미 span 추가
      var colorCircle = document.createElement("span");
      colorCircle.style.width = "10px";
      colorCircle.style.height = "10px";
      colorCircle.style.borderRadius = "50%";
      colorCircle.style.backgroundColor = status.color || "#27A644";
      colorCircle.style.flexShrink = "0";

      var label = document.createElement("div");
      label.className = "hover-menu-label";
      label.textContent = status.label || "";

      var value = document.createElement("div");
      value.className = "hover-menu-value";
      value.textContent = `(${status.timestamp})` || "";

      row.appendChild(colorCircle);
      row.appendChild(label);
      row.appendChild(value);
      hoverMenu.appendChild(row);
    }
  } else {
    hoverMenu.classList.remove("black-bg");
    hoverMenu.classList.add("white-bg");
    // 일반 아이템 메뉴 내용 업데이트
    // 아이템 데이터에서 정보 가져오기

    // 방 상태: className에 따라 표시
    var statusText = "";
    if (itemData.className === "in-progress") {
      statusText = "이용중";
    } else if (itemData.className === "for-sale") {
      statusText = "판매중";
    } else if (itemData.className === "leave") {
      statusText = "퇴실확정";
    } else {
      statusText = "이용중";
    }
    var roomStatus =
      statusText +
      "(" +
      moment(itemData.start).format("YYYY-MM-DD HH:mm:ss") +
      ")";

    var contractNumber = itemData.contractNumber || "00000000";
    var contractDate = moment(itemData.start).format("YYYY-MM-DD");
    var guest =
      itemData.guest ||
      (itemData.currentGuest
        ? itemData.currentGuest + " / - / -(-)"
        : "- / - / -(-)");
    var contractPerson = itemData.contractPerson || guest;

    // 계약기간 계산
    var startDate = moment(itemData.start).format("YYYY-MM-DD");
    var endDate = moment(itemData.end).subtract(1, "days").format("YYYY-MM-DD"); // end는 exclusive이므로 1일 빼기
    var periodType = itemData.periodType || "1개월";
    var contractType = itemData.contractType || "신규";
    var contractPeriod = `${periodType} (${startDate} ~ ${endDate}) / ${contractType}`;

    var entryFee = itemData.entryFee || "-";
    var paymentAmount = itemData.paymentAmount || "-";
    var accountInfo = itemData.accountInfo || "-";
    var deposit = itemData.deposit || "-";
    var additionalPaymentOption = itemData.additionalPaymentOption || "-";

    // 일반 아이템 메뉴 HTML 생성 (index.html 구조와 동일)
    hoverMenu.innerHTML = `
      <div>
        <div class="hover-menu-row">
          <div class="hover-menu-label">방 상태</div>
          <div class="hover-menu-value" id="hoverRoomStatus">${roomStatus}</div>
        </div>
        <div class="hover-menu-row">
          <div class="hover-menu-label">계약번호</div>
          <div class="hover-menu-value" id="hoverContractNumber">${contractNumber}</div>
        </div>
        <div class="hover-menu-row">
          <div class="hover-menu-label">계약일자</div>
          <div class="hover-menu-value" id="hoverContractDate">${contractDate}</div>
        </div>
        <div class="hover-menu-row">
          <div class="hover-menu-label">입실자</div>
          <div class="hover-menu-value" id="hoverGuest">${guest}</div>
        </div>
        <div class="hover-menu-row">
          <div class="hover-menu-label">계약자</div>
          <div class="hover-menu-value">${contractPerson}</div>
        </div>
        <div class="hover-menu-row">
          <div class="hover-menu-label">계약기간</div>
          <div class="hover-menu-value">${contractPeriod}</div>
        </div>
        <div class="hover-menu-row">
          <div class="hover-menu-label">입실료</div>
          <div class="hover-menu-value">${entryFee}</div>
        </div>
        <div class="hover-menu-row">
          <div class="hover-menu-label">결제금액</div>
          <div class="hover-menu-value">${paymentAmount}</div>
        </div>
        <div class="hover-menu-row">
          <div class="hover-menu-label">계좌정보</div>
          <div class="hover-menu-value">${accountInfo}</div>
        </div>
      </div>
      <div>
        <hr />
        <div class="hover-menu-row">
          <div class="hover-menu-label">보증금</div>
          <div class="hover-menu-value">${deposit}</div>
        </div>
        <div class="hover-menu-row">
          <div class="hover-menu-label">추가 결제옵션</div>
          <div class="hover-menu-value">${additionalPaymentOption}</div>
        </div>
      </div>
    `;
  }

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
  setCurrentHoveredItemId(item);

  // 위치 계산 완료 후 즉시 표시
  hoverMenu.style.visibility = "visible";
  setHoverMenuShown(true);
}

export function hideHoverMenu() {
  var hoverMenu = document.getElementById("hoverMenu");
  if (!hoverMenu) return;
  hoverMenu.style.display = "none";
  setHoverMenuShown(false);
  setCurrentHoveredItemId(null);
}

// 컨텍스트 메뉴 항목 클릭 이벤트 처리
export function setupMenuEventListeners() {
  var contextMenu = document.getElementById("contextMenu");
  if (!contextMenu) {
    console.error("Context menu not found");
    return;
  }

  // 이벤트 위임 사용: 동적으로 생성된 메뉴 항목에도 작동
  contextMenu.addEventListener("click", function (e) {
    var target = e.target as HTMLElement;

    // .context-menu-item 또는 그 자식 요소인지 확인
    var menuItem = target.closest(".context-menu-item");
    if (!menuItem) return;

    e.stopPropagation();
    e.preventDefault();

    var action = (menuItem as HTMLElement).getAttribute("data-action");
    if (!action) {
      console.warn("No data-action found on menu item");
      return;
    }

    // properties를 먼저 저장 (closeContextMenu 전에)
    var properties = (contextMenu as any).timelineProperties;
    if (!properties) {
      console.warn("No timeline properties found");
      return;
    }

    // 메뉴 닫기
    closeContextMenu();

    // 액션 실행 (스윗 얼럿 표시) - setTimeout으로 메뉴가 닫힌 후 실행
    setTimeout(function () {
      handleContextMenuAction(action, properties);
    }, 10);
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
}

// currentHoveredItemId를 업데이트하는 함수
export function setCurrentHoveredItemId(itemId: any) {
  currentHoveredItemId = itemId;
}

// hoverMenuShown을 업데이트하는 함수
export function setHoverMenuShown(shown: boolean) {
  hoverMenuShown = shown;
}

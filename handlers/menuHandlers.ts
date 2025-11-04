import Swal from "sweetalert2";
import { DataSet } from "vis-data";
import { logEvent } from "./logHandlers";
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

export function showContextMenu(x: number, y: number, properties: any) {
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

export function handleContextMenuAction(action: string, properties: any) {
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
        closeContextMenu();

        handleContextMenuAction(action, properties);
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
}

// currentHoveredItemId를 업데이트하는 함수
export function setCurrentHoveredItemId(itemId: any) {
  currentHoveredItemId = itemId;
}

// hoverMenuShown을 업데이트하는 함수
export function setHoverMenuShown(shown: boolean) {
  hoverMenuShown = shown;
}

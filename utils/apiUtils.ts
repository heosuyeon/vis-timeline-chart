import { DataSet } from "vis-data";
import { parseDateString, parseEndDateString } from "./dateUtils";
import {
  getItemContent,
  getGroupLabelContent,
} from "../content/contentGenerators";

// 방 상태 데이터 타입 (최대 4개)
export interface RoomStatus {
  label: string; // "판매신청", "판매오픈", "계약일", "결제요청" 등
  timestamp: string; // "25-10-29 09:24:00"
  color?: string; // span 색상 (예: "#27A644", "#E3B860", "#AA00D0", "#7AABF9")
}

// 서버 데이터 타입 정의 (실제 서버 응답 구조에 맞게 수정 필요)
export interface ServerItemData {
  id: number;
  group: number;
  startDate: string; // "2025-10-01"
  endDate: string; // "2025-10-31"
  name: string;
  currentGuest?: string;
  backgroundColor?: string;
  selectedBorderColor?: string;
  style?: string;
  className?: string;
}

// 방(그룹) 데이터 타입
export interface ServerRoomData {
  groupId: number;
  startDate: string; // 방의 시작 날짜
  endDate: string; // 방의 종료 날짜
  statuses?: RoomStatus[]; // 방 상태 배열 (최대 4개)
  currentGuest?: string;
}

// 서버 데이터를 받아서 items DataSet으로 변환하는 함수
export function createItemsFromServerData(
  itemsData: ServerItemData[],
  roomsData?: ServerRoomData[]
): DataSet<any> {
  const items: any[] = [];
  let itemIdCounter = 0;

  // 먼저 방(그룹)별로 group-label 아이템 생성 (상태가 있는 경우)
  if (roomsData) {
    for (const roomData of roomsData) {
      // 방 상태가 있고 최대 4개까지 있는 경우에만 group-label 생성
      if (roomData.statuses && roomData.statuses.length > 0) {
        const allStatuses = roomData.statuses; // 전체 상태 리스트
        const start = parseDateString(roomData.startDate);
        const end = parseEndDateString(roomData.endDate);

        items.push({
          id: itemIdCounter++,
          group: roomData.groupId,
          // 전체 상태 리스트를 전달 (함수 내에서 최대 4개만 표시)
          content: getGroupLabelContent(start, end, allStatuses),
          currentGuest: roomData.currentGuest,
          className: "group-label",
          start: start,
          end: end,
          // 전체 상태 리스트 저장 (호버메뉴용)
          allStatuses: allStatuses,
        });
      }
    }
  }

  // 일반 아이템들 추가
  for (const itemData of itemsData) {
    items.push({
      id: itemData.id || itemIdCounter++,
      group: itemData.group,
      content: getItemContent(
        itemData.startDate,
        itemData.endDate,
        itemData.name,
        itemData.backgroundColor,
        itemData.selectedBorderColor
      ),
      currentGuest: itemData.currentGuest,
      start: parseDateString(itemData.startDate),
      end: parseEndDateString(itemData.endDate),
      style: itemData.style,
      className: itemData.className,
    });
  }

  return new DataSet<any>(items);
}

// 예제: 서버에서 데이터를 가져오는 함수 (실제 API 엔드포인트에 맞게 수정 필요)
export async function fetchItemsFromServer(
  itemsApiUrl: string,
  roomsApiUrl?: string
): Promise<{
  items: ServerItemData[];
  rooms?: ServerRoomData[];
}> {
  try {
    // 아이템 데이터 가져오기
    const itemsResponse = await fetch(itemsApiUrl);
    if (!itemsResponse.ok) {
      throw new Error(`HTTP error! status: ${itemsResponse.status}`);
    }
    const itemsData: ServerItemData[] = await itemsResponse.json();

    // 방 데이터 가져오기
    let roomsData: ServerRoomData[] | undefined;
    if (roomsApiUrl) {
      const roomsResponse = await fetch(roomsApiUrl);
      if (roomsResponse.ok) {
        roomsData = await roomsResponse.json();
      }
    }

    return {
      items: itemsData,
      rooms: roomsData,
    };
  } catch (error) {
    console.error("Error fetching data from server:", error);
    throw error;
  }
}

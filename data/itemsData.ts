import { DataSet } from "vis-data";
import { parseDateString, parseEndDateString } from "../utils/dateUtils";

export function createItemsDataSet(): DataSet<any> {
  // 기본 아이템 데이터
  const baseItems: any[] = [
    {
      id: "0",
      group: 0,
      timeLineType: "contract",
      status: "in-progress",
      // content: getItemContent("2025-10-01", "2025-10-31", "김한수"),
      currentGuest: "김한수",
      start: parseDateString("2025-10-01"),
      end: parseEndDateString("2025-10-31"),
      style: "border: 2px solid transparent; color: white; border-radius: 8px;",
      className: "in-progress",
      // 호버 메뉴용 정보
      contractNumber: "20251001001",
      guest: "김한수 / 34 / M(010-1234-5678)",
      contractPerson: "김한수 / 34 / M(010-1234-5678)",
      periodType: "1개월",
      contractType: "신규",
      entryFee: "75 만원",
      paymentAmount: "70 만원",
      accountInfo: "하나은행 1234567890 김한수",
      deposit: "200,000 원",
      additionalPaymentOption: "-",
    },
    {
      id: "0-1",
      group: 0,
      timeLineType: "contract",
      status: "in-progress",
      // content: getItemContent("2025-11-01", "2025-11-30", "김한수"),
      currentGuest: "김한수",
      start: parseDateString("2025-11-01"),
      end: parseEndDateString("2025-11-30"),
      style: "border: 2px solid transparent; color: white; border-radius: 8px;",
      className: "in-progress",
      // 호버 메뉴용 정보
      contractNumber: "20251101001",
      guest: "김한수 / 34 / M(010-1234-5678)",
      contractPerson: "김한수 / 34 / M(010-1234-5678)",
      periodType: "1개월",
      contractType: "연장",
      entryFee: "75 만원",
      paymentAmount: "70 만원",
      accountInfo: "하나은행 1234567890 김한수",
      deposit: "200,000 원",
      additionalPaymentOption: "-",
    },
    {
      id: "2",
      group: 1,
      timeLineType: "contract",
      status: "for-sale",
      // content: getItemContent("2025-10-20", "2025-11-20", "이정민"),
      currentGuest: "이정민",
      start: parseDateString("2025-10-20"),
      end: parseEndDateString("2025-11-20"),
      style: "border: 2px solid transparent; color: white; border-radius: 8px;",
      className: "for-sale",
      // 호버 메뉴용 정보
      contractNumber: "20251020002",
      guest: "이정민 / 28 / F(010-2345-6789)",
      contractPerson: "이정민 / 28 / F(010-2345-6789)",
      periodType: "1개월",
      contractType: "신규",
      entryFee: "80 만원",
      paymentAmount: "75 만원",
      accountInfo: "국민은행 2345678901 이정민",
      deposit: "250,000 원",
      additionalPaymentOption: "주차비 10만원",
    },
    {
      id: "3",
      group: 2,
      timeLineType: "contract",
      status: "leave",
      // content: getItemContent("2025-11-04", "2025-12-04", "황정민"),
      currentGuest: "황정민",
      start: parseDateString("2025-11-04"),
      end: parseEndDateString("2025-12-04"),
      style: "border: 2px solid transparent; color: white; border-radius: 8px;",
      className: "leave",
      // 호버 메뉴용 정보
      contractNumber: "20251104003",
      guest: "황정민 / 31 / M(010-3456-7890)",
      contractPerson: "황정민 / 31 / M(010-3456-7890)",
      periodType: "1개월",
      contractType: "신규",
      entryFee: "85 만원",
      paymentAmount: "80 만원",
      accountInfo: "신한은행 3456789012 황정민",
      deposit: "300,000 원",
      additionalPaymentOption: "-",
    },
  ];

  // 방 상태 아이템 데이터
  const roomStatuses: any[] = [
    {
      timeLineType: "system",
      id: "room-0-statuses-0",
      group: 0,
      content: "판매신청 20-10-01 10:40:08 김소연(관리자)",
      start: parseDateString("2025-10-01"),
      end: parseEndDateString("2025-10-01"),
      className: "room-statuses",
      style: {
        backgroundColor: "#27a644",
      },
    },
    {
      id: "room-0-statuses-1",
      group: 0,
      timeLineType: "system",
      content: "예약금 요청 20-10-01 10:40:08 김소연(관리자)",
      start: parseDateString("2025-10-01"),
      end: parseEndDateString("2025-10-01"),
      className: "room-statuses",
      style: {
        backgroundColor: "#35BB88",
      },
    },
    {
      id: "room-0-statuses-2",
      group: 0,
      timeLineType: "system",
      content: "추가 결제완료 20-10-25 10:40:08 김소연(관리자)",
      start: parseDateString("2025-10-25"),
      end: parseEndDateString("2025-10-25"),
      className: "room-statuses",
      style: {
        backgroundColor: "#4A67DD",
      },
    },
    {
      id: "room-1-statuses-0",
      group: 1,
      timeLineType: "system",
      content: "계약일자 20-10-20 10:40:08 김소연(관리자)",
      start: parseDateString("2025-10-20"),
      end: parseEndDateString("2025-10-20"),
      className: "room-statuses",
      style: {
        backgroundColor: "#4A67DD",
      },
    },
    {
      id: "room-1-statuses-1",
      group: 1,
      timeLineType: "system",
      content: "판매취소 20-10-20 10:40:08 김소연(관리자)",
      start: parseDateString("2025-10-20"),
      end: parseEndDateString("2025-10-20"),
      className: "room-statuses",
      style: {
        backgroundColor: "#D25454",
      },
    },
    {
      id: "room-1-statuses-2",
      group: 1,
      timeLineType: "system",
      content: "판매취소 20-10-20 10:40:08 김소연(관리자)",
      start: parseDateString("2025-10-20"),
      end: parseEndDateString("2025-10-20"),
      className: "room-statuses",
      style: {
        backgroundColor: "#D25454",
      },
    },
    {
      id: "room-1-statuses-3",
      group: 1,
      timeLineType: "system",
      content: "판매취소 20-10-20 10:40:08 김소연(관리자)",
      start: parseDateString("2025-10-20"),
      end: parseEndDateString("2025-10-20"),
      className: "room-statuses",
      style: {
        backgroundColor: "#D25454",
      },
    },
    {
      id: "room-1-statuses-4",
      group: 1,
      timeLineType: "system",
      content: "판매취소 20-10-20 10:40:08 김소연(관리자)",
      start: parseDateString("2025-10-20"),
      end: parseEndDateString("2025-10-20"),
      className: "room-statuses",
      style: {
        backgroundColor: "#D25454",
      },
    },
  ];

  // group(방)별로 계약 아이템 그룹핑
  const itemsByGroup = new Map<number, any[]>();
  baseItems.forEach((item) => {
    const groupId = item.group;
    if (!itemsByGroup.has(groupId)) {
      itemsByGroup.set(groupId, []);
    }
    itemsByGroup.get(groupId)!.push(item);
  });

  // group(방)별로 방 상태 아이템 그룹핑
  const roomStatusesByGroup = new Map<number, any[]>();
  roomStatuses.forEach((item) => {
    const groupId = item.group;
    if (!roomStatusesByGroup.has(groupId)) {
      roomStatusesByGroup.set(groupId, []);
    }
    roomStatusesByGroup.get(groupId)!.push(item);
  });

  // 결과 배열 초기화
  const resultItems: any[] = [];

  // 현재 날짜 (시간 제외)
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  // 모든 그룹 ID 수집 및 정렬
  const allGroupIds = Array.from(
    new Set([
      ...Array.from(itemsByGroup.keys()),
      ...Array.from(roomStatusesByGroup.keys()),
    ])
  ).sort((a, b) => a - b);

  // 같은 날짜의 system 아이템들을 합치는 헬퍼 함수
  const mergeSystemItemsByDate = (items: any[]): any[] => {
    // 날짜 문자열로 변환 (YYYY-MM-DD 형식)
    const getDateKey = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    // 그룹 ID와 날짜를 키로 하여 아이템들을 묶음
    const mergedMap = new Map<string, any[]>();
    items.forEach((item) => {
      const dateKey = `${item.group}-${getDateKey(item.start)}`;
      if (!mergedMap.has(dateKey)) {
        mergedMap.set(dateKey, []);
      }
      mergedMap.get(dateKey)!.push(item);
    });

    // 합쳐진 아이템들을 생성
    const mergedItems: any[] = [];
    mergedMap.forEach((itemList, dateKey) => {
      if (itemList.length === 1) {
        // 아이템이 하나면 그대로 추가
        mergedItems.push(itemList[0]);
      } else {
        // 여러 아이템이면 하나로 합침
        const firstItem = itemList[0];
        const mergedItem = {
          ...firstItem,
          id: `${firstItem.group}-merged-${getDateKey(firstItem.start)}`,
          systemItems: itemList, // 원본 아이템들을 배열로 저장
          content: itemList.map((item: any) => item.content).join(", "), // 임시로 content 합침 (템플릿에서 사용)
          systemItemsCount: itemList.length, // 배지 표시를 위한 카운트
        };
        mergedItems.push(mergedItem);
      }
    });

    return mergedItems;
  };

  // 각 그룹별로 처리
  allGroupIds.forEach((groupId) => {
    // 1. 먼저 해당 그룹의 방 상태 아이템들을 추가 (먼저 렌더링되어 위에 표시)
    const groupRoomStatuses = roomStatusesByGroup.get(groupId) || [];
    // 같은 날짜의 아이템들을 합침
    const mergedSystemItems = mergeSystemItemsByDate(groupRoomStatuses);
    // 시작 날짜 기준으로 정렬
    mergedSystemItems
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .forEach((item) => {
        resultItems.push(item);
      });

    // 2. 그 다음 해당 그룹의 계약 아이템들을 추가 (나중에 렌더링되어 아래에 표시)
    const items = itemsByGroup.get(groupId) || [];
    // 시작 날짜 기준으로 정렬
    items
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .forEach((item) => {
        // end 날짜가 현재 날짜보다 이전인지 확인 (시간 제외)
        const itemEnd = new Date(item.end);
        itemEnd.setHours(0, 0, 0, 0);

        // 지난 일정인 경우 -past를 클래스명 뒤에 추가
        if (itemEnd < now) {
          item.className = item.className ? `${item.className}-past` : "";
        }

        resultItems.push(item);
      });
  });

  return new DataSet<any>(resultItems);
}

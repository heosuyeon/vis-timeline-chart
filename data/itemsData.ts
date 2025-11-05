import { DataSet } from "vis-data";
import { parseDateString, parseEndDateString } from "../utils/dateUtils";
import {
  getGroupLabelContent,
  getItemContent,
} from "../content/contentGenerators";
import { groupsJson } from "./groupsData";

export function createItemsDataSet(): DataSet<any> {
  // 기본 아이템 데이터
  const baseItems: any[] = [
    {
      id: "0",
      group: 0,
      content: getItemContent("2025-10-01", "2025-10-31", "김한수"),
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
      content: getItemContent("2025-11-01", "2025-11-30", "김한수"),
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
      content: getItemContent("2025-10-20", "2025-11-20", "이정민"),
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
      content: getItemContent("2025-11-04", "2025-12-04", "황정민"),
      currentGuest: "황정민",
      start: parseDateString("2025-11-04"),
      end: parseEndDateString("2025-12-04"),
      style: "border: 2px solid transparent; color: white; border-radius: 8px;",
      className: "checked-out",
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

  // group별로 아이템 그룹핑
  const itemsByGroup = new Map<number, any[]>();
  baseItems.forEach((item) => {
    const groupId = item.group;
    if (!itemsByGroup.has(groupId)) {
      itemsByGroup.set(groupId, []);
    }
    itemsByGroup.get(groupId)!.push(item);
  });

  // 결과 배열 초기화
  const resultItems: any[] = [];

  // 현재 날짜 (시간 제외)
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  // 각 그룹별로 처리
  itemsByGroup.forEach((items, groupId) => {
    // 해당 그룹의 일반 아이템들을 먼저 추가
    items.forEach((item) => {
      // end 날짜가 현재 날짜보다 이전인지 확인 (시간 제외)
      const itemEnd = new Date(item.end);
      itemEnd.setHours(0, 0, 0, 0);

      // 지난 일정인 경우 -past를 클래스명 뒤에 추가
      if (itemEnd < now) {
        item.className = item.className ? `${item.className}-past` : "";
      }

      resultItems.push(item);
    });

    // 같은 그룹에 아이템이 2개 이상인 경우 room-statuses 추가
    if (items.length >= 2) {
      // 가장 빠른 start 날짜 찾기
      const earliestStart = items.reduce((earliest, item) => {
        return item.start < earliest ? item.start : earliest;
      }, items[0].start);

      // 가장 늦은 end 날짜 찾기
      const latestEnd = items.reduce((latest, item) => {
        return item.end > latest ? item.end : latest;
      }, items[0].end);

      // room-statuses의 시작일은 가장 빠른 start 날짜의 하루 전
      const groupLabelStart = new Date(earliestStart);
      groupLabelStart.setDate(groupLabelStart.getDate() - 1);

      // currentGuest는 첫 번째 아이템의 것을 사용
      const currentGuest = items[0].currentGuest;

      // 해당 그룹의 roomStatuses 가져오기
      const groupData = groupsJson.find((g) => g.id === groupId);
      const roomStatuses = groupData?.roomStatuses;

      // room-statuses 아이템 생성 (roomStatuses를 전달하여 컬러와 개수 표시)
      const groupLabelItem = {
        id: `room-statuses-${groupId}`,
        group: groupId,
        content: getGroupLabelContent(
          groupLabelStart,
          latestEnd,
          roomStatuses,
          undefined
        ),
        currentGuest: currentGuest,
        className: "room-statuses",
        start: groupLabelStart,
        end: latestEnd,
        roomStatuses: roomStatuses, // 호버 메뉴에서 사용하기 위해 저장
      };

      resultItems.push(groupLabelItem);
    }
  });

  return new DataSet<any>(resultItems);
}

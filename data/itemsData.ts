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
      style:
        "background-color: #ED946B; border: 2px solid transparent; color: white; border-radius: 8px;",
      className: "in-progress",
    },
    {
      id: "0-1",
      group: 0,
      content: getItemContent("2025-11-01", "2025-11-30", "김한수"),
      currentGuest: "김한수",
      start: parseDateString("2025-11-01"),
      end: parseEndDateString("2025-11-30"),
      style:
        "background-color: #ED946B; border: 2px solid transparent; color: white; border-radius: 8px;",
      className: "in-progress",
    },
    {
      id: "2",
      group: 1,
      content: getItemContent("2025-10-20", "2025-11-20", "이정민"),
      currentGuest: "이정민",
      start: parseDateString("2025-10-20"),
      end: parseEndDateString("2025-11-20"),
      style:
        "background-color: #27A644; border: 2px solid transparent; color: white; border-radius: 8px;",
      className: "for-sale",
    },
    {
      id: "3",
      group: 2,
      content: getItemContent("2025-11-04", "2025-12-04", "황정민"),
      currentGuest: "황정민",
      start: parseDateString("2025-11-04"),
      end: parseEndDateString("2025-12-04"),
      style:
        "background-color: #AA00D0; border: 2px solid transparent; color: white; border-radius: 8px;",
      className: "checked-out",
    },
  ];

  // group-label이 아닌 아이템만 필터링
  const regularItems = baseItems.filter(
    (item) => item.className !== "group-label"
  );

  // group별로 아이템 그룹핑
  const itemsByGroup = new Map<number, any[]>();
  regularItems.forEach((item) => {
    const groupId = item.group;
    if (!itemsByGroup.has(groupId)) {
      itemsByGroup.set(groupId, []);
    }
    itemsByGroup.get(groupId)!.push(item);
  });

  // 결과 배열 초기화
  const resultItems: any[] = [];

  // 각 그룹별로 처리
  itemsByGroup.forEach((items, groupId) => {
    // 해당 그룹의 일반 아이템들을 먼저 추가
    items.forEach((item) => {
      resultItems.push(item);
    });

    // 같은 그룹에 아이템이 2개 이상인 경우 group-label 추가
    if (items.length >= 2) {
      // 가장 빠른 start 날짜 찾기
      const earliestStart = items.reduce((earliest, item) => {
        return item.start < earliest ? item.start : earliest;
      }, items[0].start);

      // 가장 늦은 end 날짜 찾기
      const latestEnd = items.reduce((latest, item) => {
        return item.end > latest ? item.end : latest;
      }, items[0].end);

      // group-label의 시작일은 가장 빠른 start 날짜의 하루 전
      const groupLabelStart = new Date(earliestStart);
      groupLabelStart.setDate(groupLabelStart.getDate() - 1);

      // currentGuest는 첫 번째 아이템의 것을 사용
      const currentGuest = items[0].currentGuest;

      // 해당 그룹의 roomStatuses 가져오기
      const groupData = groupsJson.find((g) => g.id === groupId);
      const roomStatuses = groupData?.roomStatuses;

      // group-label 아이템 생성 (roomStatuses를 전달하여 컬러와 개수 표시)
      const groupLabelItem = {
        id: `group-label-${groupId}`,
        group: groupId,
        content: getGroupLabelContent(
          groupLabelStart,
          latestEnd,
          roomStatuses,
          undefined
        ),
        currentGuest: currentGuest,
        className: "group-label",
        start: groupLabelStart,
        end: latestEnd,
        roomStatuses: roomStatuses, // 호버 메뉴에서 사용하기 위해 저장
      };

      resultItems.push(groupLabelItem);
    }
  });

  return new DataSet<any>(resultItems);
}

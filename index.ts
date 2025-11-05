import { Timeline } from "vis-timeline/peer";
import { DataSet } from "vis-data";
import "vis-timeline/styles/vis-timeline-graph2d.min.css";
import "sweetalert2/dist/sweetalert2.min.css";
import "./css/vis-timeline.override.css";
import "./css/common.css";
const moment = require("moment");
require("moment/locale/ko");
moment.locale("ko");
import { createGroupsDataSet } from "./data/groupsData";
import { createItemsDataSet } from "./data/itemsData";
import {
  createItemsFromServerData,
  fetchItemsFromServer,
} from "./utils/apiUtils";
import { createTimelineOptions } from "./config/timelineOptions";
import { setupTimelineEventHandlers } from "./handlers/timelineHandlers";
import { setupMenuEventListeners } from "./handlers/menuHandlers";
import { applyInlineStyles } from "./styles/inlineStyles";
import { logEvent } from "./handlers/logHandlers";

// DOM이 로드된 후 실행
function initTimeline(serverItems?: DataSet<any>) {
  // 타임라인 컨테이너
  var container = document.getElementById("visualization");
  if (!container) {
    console.error("Visualization container not found");
    return;
  }

  // 데이터셋 생성
  var groups = createGroupsDataSet();
  // 서버 데이터가 있으면 사용, 없으면 기본 데이터 사용
  var items = serverItems || createItemsDataSet();

  // 타임라인 인스턴스
  var timeline: Timeline | null = null;

  // 옵션 생성 (타임라인 인스턴스를 가져오는 함수 전달)
  var options = createTimelineOptions(
    container,
    function () {
      return timeline;
    },
    function () {
      applyInlineStyles(container, items);
      logEvent("Timeline initial draw completed", {});
    }
  );

  // 타임라인 생성
  timeline = new Timeline(container, items, groups, options as any);

  // 이벤트 핸들러 설정
  setupTimelineEventHandlers(timeline, items, container);

  // 메뉴 이벤트 리스너 설정
  setupMenuEventListeners();

  // 폼 이벤트 리스너
  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", (e) => {
      // e.preventDefault();
      // const name = (document.querySelector("#name") as HTMLInputElement).value;
      // const filteredItems = items.get({
      //   fields: ["currentGuest"], // get only the specified properties
      //   filter: (item) => item.currentGuest === name, // get only items from the specified group
      // });
      // items.update(filteredItems);
    });
  }
}

// 서버에서 데이터를 가져와서 타임라인 초기화
async function initTimelineWithServerData(
  itemsApiUrl?: string,
  roomsApiUrl?: string
) {
  if (itemsApiUrl) {
    try {
      const { items: itemsData, rooms: roomsData } = await fetchItemsFromServer(
        itemsApiUrl,
        roomsApiUrl
      );
      const items = createItemsFromServerData(itemsData, roomsData);
      initTimeline(items);
    } catch (error) {
      console.error(
        "Failed to load data from server, using default data:",
        error
      );
      initTimeline();
    }
  } else {
    initTimeline();
  }
}

// DOM이 준비되면 초기화
document.addEventListener("DOMContentLoaded", () => {
  // initTimelineWithServerData("/api/items");
  initTimeline();
});

// 전역 함수로 export (서버 데이터 업데이트용)
(window as any).updateTimelineItems = async function (
  itemsApiUrl: string,
  roomsApiUrl?: string
) {
  try {
    const { items: itemsData, rooms: roomsData } = await fetchItemsFromServer(
      itemsApiUrl,
      roomsApiUrl
    );
    const items = createItemsFromServerData(itemsData, roomsData);
    // 타임라인 재초기화 또는 items 업데이트
    const container = document.getElementById("visualization");
    if (container) {
      // 기존 타임라인이 있다면 제거하고 새로 생성
      // 또는 items만 업데이트
      initTimeline(items);
    }
  } catch (error) {
    console.error("Failed to update timeline items:", error);
  }
};

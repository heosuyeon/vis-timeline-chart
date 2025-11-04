import { Timeline } from "vis-timeline/peer";
import "vis-timeline/styles/vis-timeline-graph2d.min.css";
import "sweetalert2/dist/sweetalert2.min.css";
const moment = require("moment");
require("moment/locale/ko");
moment.locale("ko");

import { createGroupsDataSet } from "./data/groupsData";
import { createItemsDataSet } from "./data/itemsData";
import { createTimelineOptions } from "./config/timelineOptions";
import { setupTimelineEventHandlers } from "./handlers/timelineHandlers";
import { setupMenuEventListeners } from "./handlers/menuHandlers";
import { applyInlineStyles } from "./styles/inlineStyles";
import { logEvent } from "./handlers/logHandlers";

// DOM이 로드된 후 실행
function initTimeline() {
  // 타임라인 컨테이너
  var container = document.getElementById("visualization");
  if (!container) {
    console.error("Visualization container not found");
    return;
  }

  // 데이터셋 생성
  var groups = createGroupsDataSet();
  var items = createItemsDataSet();

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

// DOM이 준비되면 초기화
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTimeline);
} else {
  // DOM이 이미 로드된 경우
  initTimeline();
}

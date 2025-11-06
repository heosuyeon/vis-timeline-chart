import { TimelineOptions } from "vis-timeline/peer";
import Swal from "sweetalert2";
const moment = require("moment");

export function createTimelineOptions(
  container: HTMLElement | null,
  getTimeline: () => any,
  applyInlineStyles: () => void,
  items?: any
): TimelineOptions {
  const now = new Date();

  return {
    width: "100%",
    groupOrder: function (a, b) {
      return a.value - b.value;
    },
    // 아이템 템플릿 함수
    template: function (item: any) {
      // console.log("template contract item ", item);
      if (item.timeLineType === "contract") {
        // 계약 아이템 템플릿
        const startDate = item.start;
        const endDate = item.end;
        const startFormatted = moment(startDate).format("MM-DD");
        const endFormatted = moment(endDate).format("MM-DD");
        const dateRange = `${startFormatted} ~ ${endFormatted}`;

        // HTML content 생성
        const contentDiv = document.createElement("div");

        const nameSpan = document.createElement("span");
        nameSpan.classList.add("timeline-item-guest-name");
        nameSpan.textContent = item.currentGuest;

        const dateSpan = document.createElement("span");
        dateSpan.classList.add("timeline-item-date");
        dateSpan.textContent = dateRange;

        contentDiv.appendChild(nameSpan);
        contentDiv.appendChild(dateSpan);
        return contentDiv;
        // return `<div><span class="timeline-item-guest">${item.currentGuest}</span><span class="timeline-item-date">${dateRange}</span></div>`;
      } else if (item.timeLineType === "system") {
        // 시스템 아이템 템플릿
        console.log("template system item ", item);
        const contentDiv = document.createElement("div");

        // systemItems가 있으면 사용, 없으면 단일 아이템을 배열로 변환
        const systemItems =
          item.systemItems && Array.isArray(item.systemItems)
            ? item.systemItems
            : [{ content: item.content, style: item.style, start: item.start }];

        // 날짜 순으로 정렬 (start 기준)
        const sortedSystemItems = [...systemItems].sort((a, b) => {
          const dateA = a.start ? new Date(a.start).getTime() : 0;
          const dateB = b.start ? new Date(b.start).getTime() : 0;
          return dateA - dateB;
        });

        // 최대 4개까지만 렌더링
        sortedSystemItems.slice(0, 4).forEach((systemItem: any) => {
          const dot = document.createElement("span");
          dot.textContent = systemItem.content;
          dot.style.backgroundColor =
            systemItem.style?.backgroundColor || "#27a644";
          contentDiv.appendChild(dot);
        });

        // 2개 이상의 아이템이 있으면 data-count 속성 추가
        if (systemItems.length >= 2) {
          contentDiv.setAttribute("data-count", String(systemItems.length));
        }

        return contentDiv;
      }
    },
    // orientation: "top", // 타임라인 방향 (top, bottom)
    orientation: {
      axis: "top",
      item: "bottom",
    },
    stack: true, // 아이템을 겹겹이 쌓을건지 여부
    horizontalScroll: true, // 가로 스크롤 여부
    horizontalScrollInvert: false, // 가로 스크롤 방향 여부
    verticalScroll: true, // 세로 스크롤 여부
    zoomKey: "ctrlKey" as any, // 확대/축소 키
    maxHeight: 400,
    margin: {
      item: 0,
      axis: 0,
    },
    start: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 15), // 15일 전
    end: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 15), // 15일 후 (총 30일 범위)
    zoomMin: 1000 * 60 * 60 * 24 * 7, // 최소 7일까지 확대 가능
    zoomMax: 1000 * 60 * 60 * 24 * 90, // 최대 90일까지 축소 가능
    timeAxis: {
      scale: "day",
      step: 1, // 매일 표시
    },
    format: {
      // 년, 월, 일
      minorLabels: function (date: Date, scale: string, step: number) {
        var d = new Date(date);
        var day = d.getDate();
        var weekday = moment(d).format("ddd"); // Mon, Tue, Wed, etc.
        return day + " " + weekday;
      },
      // 일, 요일
      majorLabels: function (date: Date, scale: string, step: number) {
        var d = new Date(date);
        if (scale === "month") {
          return moment(d).format("YYYY-M");
        } else if (scale === "year") {
          return moment(d).format("YYYY");
        }
        return moment(d).format("YYYY-M-D");
      },
    },
    onInitialDrawComplete: function () {
      // 초기 렌더링 시 30일이 컨테이너 너비에 맞게 보이도록 설정 (오늘 날짜가 가운데에 오도록)
      setTimeout(function () {
        if (container) {
          var containerWidth = container.offsetWidth || 1500; // 기본 너비
          var daysToShow = 30;
          var halfDays = daysToShow / 2;

          // 컨테이너 너비에 맞춰 30일 범위로 설정 (오늘 날짜가 가운데)
          var today = new Date();
          var startDate = new Date(
            today.getTime() - 1000 * 60 * 60 * 24 * halfDays
          );
          var endDate = new Date(
            today.getTime() + 1000 * 60 * 60 * 24 * halfDays
          );
          var timeline = getTimeline();
          if (timeline) {
            timeline.setWindow(startDate, endDate, { animation: false });
          }
        }
        applyInlineStyles();
      }, 100);
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
    loadingScreenTemplate: function () {
      return "<h1>Loading...</h1>";
    },
  } as any;
}

function prettyConfirm(
  title: string,
  text: string,
  callback: (ok: boolean) => void
) {
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

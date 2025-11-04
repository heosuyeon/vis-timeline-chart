import { TimelineOptions } from "vis-timeline/peer";
import Swal from "sweetalert2";
const moment = require("moment");

export function createTimelineOptions(
  container: HTMLElement | null,
  getTimeline: () => any,
  applyInlineStyles: () => void
): TimelineOptions {
  const now = new Date();

  return {
    width: "100%",
    groupOrder: function (a, b) {
      return a.value - b.value;
    },
    orientation: "top",
    stack: true,
    horizontalScroll: true,
    horizontalScrollInvert: false,
    verticalScroll: true,
    zoomKey: "ctrlKey" as any,
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
      minorLabels: function (date: Date, scale: string, step: number) {
        var d = new Date(date);
        var day = d.getDate();
        var weekday = moment(d).format("ddd"); // Mon, Tue, Wed, etc.
        return day + " " + weekday;
      },
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

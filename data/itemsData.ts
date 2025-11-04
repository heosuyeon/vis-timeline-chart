import { DataSet } from "vis-data";
import { parseDateString, parseEndDateString } from "../utils/dateUtils";
import {
  getGroupLabelContent,
  getItemContent,
} from "../content/contentGenerators";

export function createItemsDataSet(): DataSet<any> {
  var item0Start = parseDateString("2025-09-30");
  var item0End = parseEndDateString("2025-11-30");

  return new DataSet<any>([
    {
      id: 0,
      group: 0,
      content: getGroupLabelContent(item0Start, item0End),
      currentGuest: "김한수",
      className: "group-label",
      start: item0Start,
      end: item0End,
    },
    {
      id: 1,
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
      id: 2,
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
      id: 3,
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
      id: 6,
      group: 2,
      content: getItemContent("2025-11-04", "2025-12-04", "황정민"),
      currentGuest: "황정민",
      start: parseDateString("2025-11-04"),
      end: parseEndDateString("2025-12-04"),
      style:
        "background-color: #AA00D0; border: 2px solid transparent; color: white; border-radius: 8px;",
      className: "checked-out",
    },
  ]);
}

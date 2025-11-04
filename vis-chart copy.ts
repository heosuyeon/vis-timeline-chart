import { Timeline } from "vis-timeline/peer";
import { DataSet } from "vis-data";
import "vis-timeline/styles/vis-timeline-graph2d.min.css";
const moment = require("moment");
require("moment/locale/ko");
moment.locale("ko");

// create groups
let numberOfGroups = 25;
const groups = new DataSet<any>();
for (let i = 0; i < numberOfGroups; i++) {
  groups.add({
    id: i,
    content: "Truck&nbsp;" + i,
    // content: `<div></div>`,
  });
}

// create items
let numberOfItems = 1000;
const items = new DataSet<any>();

const itemsPerGroup = Math.round(numberOfItems / numberOfGroups);

for (let truck = 0; truck < numberOfGroups; truck++) {
  var date = new Date();
  for (let order = 0; order < itemsPerGroup; order++) {
    date.setHours(date.getHours() + 4 * Number(Math.random() < 0.2));
    const start = new Date(date);

    date.setHours(date.getHours() + 2 + Math.floor(Math.random() * 4));
    const end = new Date(date);

    items.add({
      id: order + itemsPerGroup * truck,
      group: truck,
      start: start,
      end: end,
      content: "Order " + order,
      className: "timeline-item",
    });
  }
}

console.log("items", items);
console.log("groups", groups);
// specify options
const options = {
  stack: true,
  horizontalScroll: true,
  horizontalScrollInvert: false,
  verticalScroll: true,
  zoomKey: "ctrlKey",
  maxHeight: 800,
  start: new Date(),
  end: new Date(1000 * 60 * 60 * 24 + new Date().valueOf()),
  editable: true,
  itemsAlwaysDraggable: {
    item: true,
    range: true,
  },
  margin: {
    // item: 10, // minimal margin between items
    // axis: 5, // minimal margin between items and the axis
    item: 0,
    axis: 0,
  },
  orientation: "top",
};

// create a Timeline
const container = document.getElementById("visualization");
const timeline = new Timeline(container!, items, groups, options as any);

import { stringifyObject } from "../utils/domUtils";

export function logEvent(event: any, properties: any) {
  var log = document.getElementById("log");
  if (!log) return;
  var msg = document.createElement("div");
  msg.innerHTML =
    "event=" +
    JSON.stringify(event) +
    ", " +
    "properties=" +
    stringifyObject(properties);
  log.firstChild ? log.insertBefore(msg, log.firstChild) : log.appendChild(msg);
}

export function setHoveredItem(id: any) {
  var hoveredItem = document.getElementById("hoveredItem");
  if (!hoveredItem) return;
  hoveredItem.innerHTML = "hoveredItem=" + id;
}

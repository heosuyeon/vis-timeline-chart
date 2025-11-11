import { DataSet } from "vis-data";

export interface GroupColor {
  sidebar: string;
  statusBorder: string;
  statusText: string;
}

export interface RoomStatus {
  label: string;
  timestamp: string;
  color?: string;
}

export interface GroupJson {
  id: number;
  roomNumber: string;
  roomName: string;
  status: string;
  type: string;
  window: string;
  monthlyRent: number;
  currentGuest: string;
  stayPeriod: string;
  value: number;
  color: GroupColor;
  roomStatuses?: RoomStatus[]; // 방 상태 데이터 (선택사항)
}

export var groupsJson: GroupJson[] = [
  {
    id: 0,
    roomNumber: "202",
    roomName: "귀여운방",
    status: "이용중",
    type: "원룸",
    window: "외창",
    monthlyRent: 200000,
    currentGuest: "김한수",
    stayPeriod: "25-10-01~25-10-31",
    value: 1,
    color: {
      sidebar: "#ED946B",
      statusBorder: "#ED946B",
      statusText: "#ED946B",
    },
    // 방 상태 데이터
    roomStatuses: [
      {
        label: "판매신청",
        timestamp: "25-10-29 09:24:00",
        color: "#27A644",
      },
      {
        label: "판매오픈",
        timestamp: "25-10-29 10:32:21",
        color: "#27A644",
      },
      {
        label: "계약일",
        timestamp: "25-10-29 13:02:12",
        color: "#5D6EE2",
      },
      {
        label: "결제요청",
        timestamp: "25-10-29 13:08:08",
        color: "#7AABF9",
      },
      {
        label: "결제확인",
        timestamp: "25-10-29 13:08:08",
        color: "#7AABF9",
      },
    ],
  },
  {
    id: 1,
    roomNumber: "203",
    roomName: "귀여운방",
    status: "판매중",
    type: "원룸",
    window: "외창",
    monthlyRent: 210000,
    currentGuest: "이정민",
    stayPeriod: "25-11-1~25-11-31",
    value: 2,
    color: {
      sidebar: "#27A644",
      statusBorder: "#27A644",
      statusText: "#27A644",
    },
  },
  {
    id: 2,
    roomNumber: "204",
    roomName: "귀여운방",
    status: "퇴실확정",
    type: "원룸",
    window: "외창",
    monthlyRent: 220000,
    currentGuest: "황정민",
    stayPeriod: "25-11-02~25-11-31",
    value: 3,
    color: {
      sidebar: "#AA00D0",
      statusBorder: "#AA00D0",
      statusText: "#AA00D0",
    },
  },
];

export function createGroupsDataSet(): DataSet<any> {
  var groupsData = [];
  for (var i = 0; i < groupsJson.length; i++) {
    var data = groupsJson[i];

    // DOM 요소 생성
    var container = document.createElement("div");
    container.style.height = "100%";
    container.classList.add("group");

    // 배경색 div
    var sidebarDiv = document.createElement("div");
    sidebarDiv.style.backgroundColor = data.color.sidebar;
    container.appendChild(sidebarDiv);

    // 내용 div
    var contentDiv = document.createElement("div");

    // 첫 번째 줄: 방 번호와 상태
    var firstLine = document.createElement("div");
    var roomNumberBold = document.createElement("b");
    roomNumberBold.textContent = `${data.roomNumber}호 (${data.roomName})`;
    firstLine.appendChild(roomNumberBold);

    var statusSpan = document.createElement("span");
    statusSpan.style.color = data.color.statusText;
    statusSpan.style.borderColor = data.color.statusBorder;
    statusSpan.style.border = `2px solid ${data.color.statusBorder}`;
    statusSpan.textContent = data.status;
    firstLine.appendChild(statusSpan);

    contentDiv.appendChild(firstLine);

    // 두 번째 줄: 타입, 창문, 월세
    var secondLine = document.createElement("p");
    secondLine.textContent = `${data.type} / ${
      data.window
    } / 월 ${data.monthlyRent.toLocaleString()}원`;
    contentDiv.appendChild(secondLine);

    // 세 번째 줄: 현재 입실자 정보
    var thirdLine = document.createElement("div");
    var currentGuestLabel = document.createElement("span");
    currentGuestLabel.style.color = "#E44343";
    currentGuestLabel.textContent = "현재 입실자 ";
    thirdLine.appendChild(currentGuestLabel);

    const currentGuestSpan = document.createElement("span");
    currentGuestSpan.textContent = data.currentGuest + " ";
    thirdLine.appendChild(currentGuestSpan);

    const currentGuestLabel2 = document.createElement("span");
    currentGuestLabel2.style.color = "#E44343";
    currentGuestLabel2.textContent = "주자정보 ";
    thirdLine.appendChild(currentGuestLabel2);

    const stayPeriodSpan = document.createElement("span");
    // stayPeriodSpan.textContent = data.stayPeriod;
    stayPeriodSpan.textContent = "-";
    thirdLine.appendChild(stayPeriodSpan);

    contentDiv.appendChild(thirdLine);
    container.appendChild(contentDiv);

    groupsData.push({
      id: data.id,
      content: container, // DOM 요소 직접 할당
      value: data.value,
    });
  }
  return new DataSet<any>(groupsData);
}

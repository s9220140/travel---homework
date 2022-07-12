// dom
let areaList = document.querySelector(".area-list");
let selectZone = document.querySelector(".selectZone");
let zoneItem = document.querySelector(".hot-zone");
let main_title = document.querySelector(".main-title");
let pageElement = document.querySelector(".pagination");
let travelData = {};
let zoneArray = [];
let zoneData;

// 監聽
selectZone.addEventListener("change", areaChange);
zoneItem.addEventListener("click", hot_zone);
pageElement.addEventListener("click", changePage);

function hot_zone(e) {
  let zone = e.target.textContent;
  filterArea(zone);
  let selectedOption = document.querySelectorAll(".zonetext");
  selectedOption.forEach((item) => {
    if (item.value === zone) {
      item.selected = true;
    }
  });
}
function areaChange(e) {
  let seleted = e.target.value;
  filterArea(seleted);
}
// 取得api資料
function getData() {
  const url =
    "https://api.kcg.gov.tw/api/service/get/9c8e1450-e833-499c-8320-29b36b7ace5c";
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((api) => {
      travelData = api.data.XML_Head.Infos.Info;
      showArea(travelData);
      filterArea("全部行政區");
    });
}
getData();

// 渲染資料
function displayData(data) {
  let str = "";
  data.forEach((item) => {
    str += ` <li>
    <div class="area-content">
        <div class="area-image" style="background: url(${item.Picture1}) center / cover">
                <h3>${item.Name}</h3>
                <p>${item.Zone}</p>         
        </div>
        <div class="area-info">
            <ul>
                <li><img class="icon" src="images/icons_clock.png" alt="clock">${item.Opentime}</li>
                <li><img class="icon" src="images/icons_pin.png" alt="pin">${item.Add}</li>
                <li><img class="icon" src="images/icons_phone.png" alt="phone">${item.Tel}</li>
                <li><img class="icon" src="images/icons_tag.png" alt="tag">${item.Ticketinfo}</li>
            </ul>
        </div>
    </div>
</li>`;
  });
  areaList.innerHTML = str;
}

// 按鈕顏色分配
function btnColor() {
  let zoneItem = document.querySelectorAll(".zoneItem");
  let colorArray = ["#8A82CC", "#FFA782", "#F5D105", "#559AC8"];
  for (let i = 0; i < zoneItem.length; i++) {
    for (let i = 0; i < colorArray.length; i++) {
      zoneItem[i].style.backgroundColor = colorArray[i];
    }
  }
}
btnColor();

// 篩選不重複資料並渲染selectlist
function showArea(data) {
  noRepeatZone(data);
  let filterZone = zoneArray.filter((element, index, arr) => {
    return arr.indexOf(element) === index;
  });
  renderList(filterZone);
}

function renderList(zone) {
  let str = `<option disabled selected value="--全部行政區--">--全部行政區--</option>`;
  zone.forEach((item) => {
    let content = `<option class="zonetext" value="${item}">${item}</option>`;
    str += content;
  });
  selectZone.innerHTML = str;
}

function noRepeatZone(data) {
  data.forEach((item) => {
    let address = item.Add;
    let words = address.split("");
    let zone = `${words[6]}${words[7]}${words[8]}`;
    if (zone === "那瑪夏") {
      zone += "區";
    }
    item.Zone = zone;
    zoneArray.push(zone);
  });
}

function pagination(travelData, nowPage) {
  // 總資料量
  const dataTotal = travelData.length;
  // console.log(dataTotal);
  // 每頁數量
  const perPage = 10;
  // 總頁數
  const pageTotal = Math.ceil(dataTotal / perPage);
  let currentPage = nowPage;
  // 確保當前頁數不會超過總頁數
  if (currentPage > pageTotal) {
    currentPage = pageTotal;
  }

  // ex:最小值為(1*10)-10+1=1,每頁有10筆資料，所以第一頁為1~10，第二頁為11~20...
  const minData = currentPage * perPage - perPage + 1;
  const maxData = currentPage * perPage;
  // console.log(minData,maxData);

  // 建立新陣列儲存分頁資料
  const data = [];
  travelData.forEach((item, index) => {
    // 陣列從0開始，所以要+1
    const num = index + 1;
    // 範圍內資料存入陣列
    if (num >= minData && num <= maxData) {
      data.push(item);
    }
  });
  // console.log(data);
  const page = {
    currentPage,
    pageTotal,
    hasPage: currentPage > 1,
    hasNext: currentPage < pageTotal,
  };
  displayData(data);
  pageBtn(page);
}

function pageBtn(page) {
  let str = "";
  let total = page.pageTotal;
  if (page.hasPage) {
    str += `<li><a href="#" data-page="${
      Number(page.currentPage) - 1
    }">Previous</a></li>`;
  } else {
    str += `<li><a class="btn-disabled" href="#">Previous</a></li>`;
  }

  for (let i = 1; i <= total; i++) {
    if (Number(page.currentPage) === i) {
      str += `<li class="active"><a href="#" data-page="${i}">${i}</a></li>`;
    } else {
      str += `<li><a href="#" data-page="${i}">${i}</a></li>`;
    }
  }

  if (page.hasNext) {
    str += `<li><a href="#" data-page="${
      Number(page.currentPage) + 1
    }">Next</a></li>`;
  } else {
    str += `<li><a class="btn-disabled" href="#">Next</a></li>`;
  }
  pageElement.innerHTML = str;
}

function changePage(e) {
  e.preventDefault();
  if (e.target.nodeName !== "A") return;
  const page = e.target.dataset.page;
  // zoneData:選擇區域的所有資料
  // 將單一區域景點分頁
  pagination(zoneData, page);
}

function filterArea(zone) {
  let selectArea = [];
  travelData.forEach((item) => {
    if (item.Zone === zone) {
      selectArea.push(item);
    } else if (zone === "全部行政區") {
      selectArea.push(item);
    }
    main_title.innerHTML=zone
    pagination(selectArea, 1);
    zoneData = selectArea;
  });
}

$(document).ready(function () {
    //go top
    $(window).scroll(function () {
      if ($(this).scrollTop() > 200) {
          $('.go-top').fadeIn(200);
      } else {
          $('.go-top').fadeOut(200);
      }
  });
  // Animate the scroll to top
  $('.go-top').click(function (event) {
      event.preventDefault();

      $('html, body').animate({
          scrollTop: 0
      }, 300);
  })
});
let circles = [];
let activeWindow = null; // 用於追蹤當前顯示的視窗
let score = 0; // 紀錄總分
let currentQuestion = 0; // 當前題目索引
const questions = [
  {
    question: "1 + 1 = ?",
    options: ["1", "2", "3", "4"],
    correct: 1, // 正確答案索引
  },
  {
    question: "3 + 5 = ?",
    options: ["5", "8", "12", "15"],
    correct: 1,
  },
  {
    question: "2 + 8 = ?",
    options: ["2", "5", "8", "10"],
    correct: 3,
  },
  {
    question: "6 + 6 = ?",
    options: ["3", "6", "11", "12"],
    correct: 3,
  },
];

function setup() {
  createCanvas(windowWidth, windowHeight); // 視窗大小
  background('#f5ebe0'); // 設定背景顏色

  // 初始化 30 個圓形
  for (let i = 0; i < 30; i++) {
    circles.push({
      x: random(width),
      y: random(height),
      r: random(10, 50), // 圓形半徑
      dx: random(-2, 2), // x軸移動速度
      dy: random(-2, 2), // y軸移動速度
      color: [random(255), random(255), random(255), 150], // 隨機顏色 (含透明度)
    });
  }

  // 建立選單按鈕
  createMenu();
}

function draw() {
  background('#f5ebe0'); // 每次重繪背景

  // 更新並繪製每個圓形
  for (let circle of circles) {
    circle.x += circle.dx;
    circle.y += circle.dy;

    // 碰到邊界反彈
    if (circle.x < 0 || circle.x > width) circle.dx *= -1;
    if (circle.y < 0 || circle.y > height) circle.dy *= -1;

    // 根據滑鼠位置調整圓形大小
    if (mouseX > width - 50) {
      circle.r = min(circle.r + 1, 70); // 最大半徑限制為 70
    } else if (mouseX < 50) {
      circle.r = max(circle.r - 1, 10); // 最小半徑限制為 10
    }

    // 繪製圓形
    fill(circle.color); // 使用隨機顏色
    noStroke();
    ellipse(circle.x, circle.y, circle.r * 2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // 當視窗大小改變時調整畫布
}

// 建立選單按鈕
function createMenu() {
  const menuItems = ["自我介紹", "作品集", "測驗卷", "教學影片"];
  const menuContainer = createDiv(); // 建立一個容器
  menuContainer.style('position', 'absolute');
  menuContainer.style('top', '10px');
  menuContainer.style('right', '10px');
  menuContainer.style('background', '#ffffff');
  menuContainer.style('padding', '10px');
  menuContainer.style('border-radius', '5px');
  menuContainer.style('box-shadow', '0 4px 6px rgba(0, 0, 0, 0.1)');
  menuContainer.style('display', 'flex'); // 使用 flex 排列
  menuContainer.style('gap', '10px'); // 按鈕之間的間距

  // 為每個選單項目建立按鈕
  menuItems.forEach(item => {
    const button = createButton(item);
    button.parent(menuContainer); // 將按鈕加入容器
    button.style('padding', '8px 12px');
    button.style('border', 'none');
    button.style('background', '#007BFF');
    button.style('color', '#ffffff');
    button.style('border-radius', '3px');
    button.style('cursor', 'pointer');

    // 滑鼠移入時改變文字顏色
    button.mouseOver(() => {
      button.style('color', '#ffc8dd');
      if (item === "作品集") {
        showSubMenu(button); // 顯示子選單，並將按鈕傳遞給子選單
      }
    });

    // 滑鼠移出時恢復原本顏色
    button.mouseOut(() => {
      button.style('color', '#ffffff');
    });

    // 點擊時執行對應功能
    button.mousePressed(() => {
      closeActiveWindow(); // 關閉當前視窗
      if (item === "自我介紹") {
        showIntroduction(); // 顯示自我介紹頁面
      } else if (item === "測驗卷") {
        showQuestion(); // 顯示測驗頁面
      } else if (item === "教學影片") {
        showVideo(); // 顯示教學影片頁面
      }
    });
  });
}

// 顯示作品集的子選單
function showSubMenu(parentButton) {
  const subMenu = createDiv();
  subMenu.style('position', 'absolute');
  subMenu.style('top', `${parentButton.elt.offsetTop + parentButton.elt.offsetHeight}px`); // 設置在按鈕正下方
  subMenu.style('left', `${parentButton.elt.offsetLeft + parentButton.elt.offsetWidth / 2 - 50}px`); // 居中對齊按鈕
  subMenu.style('background', '#ffffff');
  subMenu.style('padding', '10px');
  subMenu.style('border-radius', '5px');
  subMenu.style('box-shadow', '0 4px 6px rgba(0, 0, 0, 0.1)');
  subMenu.style('display', 'flex');
  subMenu.style('flex-direction', 'column'); // 垂直排列
  subMenu.style('gap', '10px'); // 子選項之間的間距

  const weeks = [
    { label: "第一周", link: "https://hackmd.io/@tKj1dEVGTlSrmRqFZ1bzuw/Hyxy31Oikg" },
    { label: "第二周", link: "https://hackmd.io/@tKj1dEVGTlSrmRqFZ1bzuw/ByU1dZZhJl" },
    { label: "第三周", link: "https://hackmd.io/@tKj1dEVGTlSrmRqFZ1bzuw/SJvAvqXayx" },
    { label: "第四周", link: "https://hackmd.io/@tKj1dEVGTlSrmRqFZ1bzuw/HyNH5Nyylg" },
  ];

  weeks.forEach(week => {
    const weekButton = createButton(week.label);
    weekButton.style('padding', '8px 12px');
    weekButton.style('border', 'none');
    weekButton.style('background', '#007BFF');
    weekButton.style('color', '#ffffff');
    weekButton.style('border-radius', '3px');
    weekButton.style('cursor', 'pointer');
    weekButton.parent(subMenu);

    weekButton.mousePressed(() => {
      closeActiveWindow(); // 關閉當前視窗
      showIframe(week.link); // 顯示對應的頁面
    });
  });

  subMenu.parent(document.body);
  activeWindow = subMenu;
}

// 顯示嵌入的頁面
function showIframe(link) {
  activeWindow = createDiv();
  activeWindow.style('position', 'fixed');
  activeWindow.style('top', '50%');
  activeWindow.style('left', '50%');
  activeWindow.style('transform', 'translate(-50%, -50%)');
  activeWindow.style('background', '#ffffff');
  activeWindow.style('padding', '10px');
  activeWindow.style('border-radius', '10px');
  activeWindow.style('box-shadow', '0 4px 6px rgba(0, 0, 0, 0.1)');
  activeWindow.style('width', '80%');
  activeWindow.style('height', '80%');
  activeWindow.style('text-align', 'center');

  const iframe = createElement('iframe');
  iframe.attribute('src', link);
  iframe.style('width', '100%');
  iframe.style('height', '100%');
  iframe.style('border', 'none');
  iframe.parent(activeWindow);

  const closeButton = createButton("關閉");
  closeButton.style('position', 'absolute');
  closeButton.style('top', '10px');
  closeButton.style('right', '10px');
  closeButton.style('padding', '8px 12px');
  closeButton.style('border', 'none');
  closeButton.style('background', '#FF6B6B');
  closeButton.style('color', '#ffffff');
  closeButton.style('border-radius', '3px');
  closeButton.style('cursor', 'pointer');
  closeButton.parent(activeWindow);

  closeButton.mousePressed(() => {
    closeActiveWindow();
  });

  activeWindow.parent(document.body);
}

// 顯示題目頁面
function showQuestion() {
  if (currentQuestion >= questions.length) {
    // 顯示總分
    closeActiveWindow(); // 確保關閉舊視窗
    activeWindow = createDiv();
    activeWindow.style('position', 'fixed');
    activeWindow.style('top', '50%');
    activeWindow.style('left', '50%');
    activeWindow.style('transform', 'translate(-50%, -50%)');
    activeWindow.style('background', '#ffffff');
    activeWindow.style('padding', '10px');
    activeWindow.style('border-radius', '10px');
    activeWindow.style('box-shadow', '0 4px 6px rgba(0, 0, 0, 0.1)');
    activeWindow.style('width', '80%');
    activeWindow.style('height', '80%');
    activeWindow.style('text-align', 'center');

    // 判斷總分訊息
    let resultMessage = `總分：${score} 分`;
    if (score === 8) {
      resultMessage += "<br>太棒了，真聰明！";
    } else if (score === 0 || score === 2) {
      resultMessage += "<br>別鬧了！";
    }

    const resultText = createP(resultMessage);
    resultText.style('font-size', '24px'); // 調整總分文字大小
    resultText.style('margin-bottom', '20px');
    resultText.parent(activeWindow);

    const closeButton = createButton("關閉");
    closeButton.style('padding', '8px 12px');
    closeButton.style('border', 'none');
    closeButton.style('background', '#FF6B6B');
    closeButton.style('color', '#ffffff');
    closeButton.style('border-radius', '3px');
    closeButton.style('cursor', 'pointer');
    closeButton.parent(activeWindow);

    closeButton.mousePressed(() => {
      closeActiveWindow();
    });

    activeWindow.parent(document.body);
    return;
  }

  // 顯示當前題目
  closeActiveWindow(); // 確保關閉舊視窗
  const questionData = questions[currentQuestion];
  activeWindow = createDiv();
  activeWindow.style('position', 'fixed');
  activeWindow.style('top', '50%');
  activeWindow.style('left', '50%');
  activeWindow.style('transform', 'translate(-50%, -50%)');
  activeWindow.style('background', '#ffffff');
  activeWindow.style('padding', '10px');
  activeWindow.style('border-radius', '10px');
  activeWindow.style('box-shadow', '0 4px 6px rgba(0, 0, 0, 0.1)');
  activeWindow.style('width', '80%');
  activeWindow.style('height', '80%');
  activeWindow.style('text-align', 'center');

  const questionText = createP(questionData.question);
  questionText.style('font-size', '24px'); // 調整題目文字大小
  questionText.style('margin-bottom', '20px');
  questionText.parent(activeWindow);

  questionData.options.forEach((option, index) => {
    const optionButton = createButton(option);
    optionButton.style('padding', '12px 16px'); // 調整按鈕大小
    optionButton.style('margin', '10px'); // 增加按鈕間距
    optionButton.style('border', 'none');
    optionButton.style('background', '#007BFF');
    optionButton.style('color', '#ffffff');
    optionButton.style('border-radius', '5px'); // 增加按鈕圓角
    optionButton.style('font-size', '18px'); // 調整按鈕文字大小
    optionButton.style('cursor', 'pointer');
    optionButton.parent(activeWindow);

    optionButton.mousePressed(() => {
      if (index === questionData.correct) {
        score += 2; // 正確答案加 2 分
      }
      currentQuestion++; // 跳到下一題
      closeActiveWindow();
      showQuestion();
    });
  });

  activeWindow.parent(document.body);
}

// 顯示教學影片頁面
function showVideo() {
  activeWindow = createDiv();
  activeWindow.style('position', 'fixed');
  activeWindow.style('top', '50%');
  activeWindow.style('left', '50%');
  activeWindow.style('transform', 'translate(-50%, -50%)');
  activeWindow.style('background', '#ffffff');
  activeWindow.style('padding', '10px');
  activeWindow.style('border-radius', '10px');
  activeWindow.style('box-shadow', '0 4px 6px rgba(0, 0, 0, 0.1)');
  activeWindow.style('width', '80%');
  activeWindow.style('height', '80%');
  activeWindow.style('text-align', 'center');

  // 嵌入影片
  const iframe = createElement('iframe');
  iframe.attribute('src', 'https://cfchen58.synology.me/%E7%A8%8B%E5%BC%8F%E8%A8%AD%E8%A8%882024/A2/week1/20250221_092037.mp4');
  iframe.style('width', '100%');
  iframe.style('height', '100%');
  iframe.style('border', 'none');
  iframe.parent(activeWindow);

  // 關閉按鈕
  const closeButton = createButton("關閉");
  closeButton.style('position', 'absolute');
  closeButton.style('top', '10px');
  closeButton.style('right', '10px');
  closeButton.style('padding', '8px 12px');
  closeButton.style('border', 'none');
  closeButton.style('background', '#FF6B6B');
  closeButton.style('color', '#ffffff');
  closeButton.style('border-radius', '3px');
  closeButton.style('cursor', 'pointer');
  closeButton.parent(activeWindow);

  closeButton.mousePressed(() => {
    closeActiveWindow();
  });

  activeWindow.parent(document.body);
}

// 顯示自我介紹頁面
function showIntroduction() {
  activeWindow = createDiv();
  activeWindow.style('position', 'fixed');
  activeWindow.style('top', '50%');
  activeWindow.style('left', '50%');
  activeWindow.style('transform', 'translate(-50%, -50%)');
  activeWindow.style('background', '#ffffff');
  activeWindow.style('padding', '10px');
  activeWindow.style('border-radius', '10px');
  activeWindow.style('box-shadow', '0 4px 6px rgba(0, 0, 0, 0.1)');
  activeWindow.style('width', '80%');
  activeWindow.style('height', '80%');
  activeWindow.style('text-align', 'center');

  // 顯示圖片
  const img = createImg('自我介紹.jpg', '自我介紹圖片');
  img.style('width', '100%');
  img.style('height', '100%');
  img.style('object-fit', 'contain');
  img.parent(activeWindow);

  // 關閉按鈕
  const closeButton = createButton("關閉");
  closeButton.style('position', 'absolute');
  closeButton.style('top', '10px');
  closeButton.style('right', '10px');
  closeButton.style('padding', '8px 12px');
  closeButton.style('border', 'none');
  closeButton.style('background', '#FF6B6B');
  closeButton.style('color', '#ffffff');
  closeButton.style('border-radius', '3px');
  closeButton.style('cursor', 'pointer');
  closeButton.parent(activeWindow);

  closeButton.mousePressed(() => {
    closeActiveWindow();
  });

  activeWindow.parent(document.body);
}

// 關閉當前視窗的函數
function closeActiveWindow() {
  if (activeWindow) {
    activeWindow.remove();
    activeWindow = null;
  }
}
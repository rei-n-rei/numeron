## Firebaseの初期設定（main.jsの冒頭に追加）
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD7bYQDKimoTGvFI23S7ENVhIpi-HePLps",
  authDomain: "numeron-7c7ee.firebaseapp.com",
  databaseURL: "https://numeron-7c7ee-default-rtdb.firebaseio.com",
  projectId: "numeron-7c7ee",
  storageBucket: "numeron-7c7ee.firebasestorage.app",
  messagingSenderId: "1056023710959",
  appId: "1:1056023710959:web:5efd17cf3645c5c4419f1a",
  measurementId: "G-DMW44ER20M"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 🎮 ゲームロジック
let cpuNumber = [];
let cpuHistory = [];
let playerHistory = [];
let completedGames = [];

function resetVsComputer() {
  cpuNumber = generateCpuNumber();
  cpuHistory = [cpuNumber.join('')];
  playerHistory = [];

  document.getElementById("result").innerHTML = "";
  document.getElementById("gameHistory").innerHTML = "";
  document.getElementById("guess").value = "";
}

function generateCpuNumber() {
  const digits = [];
  while (digits.length < 3) {
    const rand = Math.floor(Math.random() * 10);
    if (!digits.includes(rand)) digits.push(rand);
  }
  return digits.map(String);
}

function checkVsComputer() {
  const intervalInput = document.getElementById("changeInterval");
  const changeInterval = intervalInput ? parseInt(intervalInput.value) || 3 : 3;

  const inputRaw = document.getElementById("guess").value;
  if (inputRaw.length !== 3 || new Set(inputRaw).size !== 3 || isNaN(inputRaw)) {
    alert("3桁の重複なし数字を入力してください");
    return;
  }

  const guess = inputRaw.split('');
  const currentTurn = playerHistory.length + 1;
  let hit = 0, blow = 0;

  for (let i = 0; i < 3; i++) {
    if (guess[i] === cpuNumber[i]) hit++;
    else if (cpuNumber.includes(guess[i])) blow++;
  }

  const resultLine = `入力: ${inputRaw} → Hit: ${hit}, Blow: ${blow}`;
  playerHistory.push(resultLine);

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = playerHistory
    .map((line, i) => `<div>ターン ${i + 1}: ${line}</div>`)
    .join("");

  if (hit === 3) {
    resultDiv.innerHTML += `<div style="color: green; margin-top:10px;">🎉 ${currentTurn}ターンで正解！</div>`;
    resultDiv.innerHTML += `<div style="margin-top:12px;"><strong>🔍 CPUの変化履歴：</strong><br>` +
      cpuHistory.map((val, i) => `ターン ${i + 1}: ${val}`).join('<br>') + `</div>`;

    const record = {
      date: new Date().toLocaleDateString(),
      turns: currentTurn
    };
    completedGames.push(record);
    sendResultToFirebase("rei", currentTurn); // ☁️ Firebaseに送信
    displayGameHistory();
  }

  document.getElementById("guess").value = "";

  if (currentTurn % changeInterval === 0) {
    const index = Math.floor(Math.random() * 3);
    const originalDigit = cpuNumber[index];
    const usedDigits = new Set(cpuNumber);
    usedDigits.delete(originalDigit);

    let newDigit = (parseInt(originalDigit) + 1) % 10;
    let attempts = 0;
    while (usedDigits.has(String(newDigit)) && attempts < 10) {
      newDigit = (newDigit + 1) % 10;
      attempts++;
    }

    cpuNumber[index] = String(newDigit);
  }

  cpuHistory.push(cpuNumber.join(''));
}

function displayGameHistory() {
  const historyDiv = document.getElementById("gameHistory");
  historyDiv.innerHTML = "<h2>📝 クリア履歴</h2>";

  if (completedGames.length === 0) {
    historyDiv.innerHTML += "<p>まだクリア記録はありません。</p>";
    return;
  }

  completedGames.forEach((record, index) => {
    historyDiv.innerHTML += `<div>ゲーム ${index + 1}（${record.date}） → ${record.turns}ターンでクリア</div>`;
  });
}

// ☁️ Firebase API：結果を保存
function sendResultToFirebase(name, turns) {
  db.ref("numeronResults").push({
    player: name,
    turns: turns,
    date: new Date().toISOString()
  });
}

// ⏱️ ページ初期化処理
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("guess").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      checkVsComputer();
    }
  });
  resetVsComputer();
});

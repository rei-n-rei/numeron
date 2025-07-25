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
  resultDiv.innerHTML = playerHistory.map((line, i) =>
    `<div>ターン ${i + 1}: ${line}</div>`).join("");

  if (hit === 3) {
    resultDiv.innerHTML += `<div style="color: green;">🎉 ${currentTurn}ターンで正解！</div>`;
    resultDiv.innerHTML += `<div><strong>🔍 CPUの変化履歴：</strong><br>` +
      cpuHistory.map((val, i) => `ターン ${i + 1}: ${val}`).join('<br>') + `</div>`;

    const record = {
      date: new Date().toLocaleDateString(),
      turns: currentTurn
    };
    completedGames.push(record);
    sendResultToServer("rei", currentTurn);
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

function sendResultToServer(name, turns) {
  fetch("http://localhost:3000/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ player: name, turns })
  });
}

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("guess").addEventListener("keydown", function (event) {
    if (event.key === "Enter") checkVsComputer();
  });
  resetVsComputer();
});

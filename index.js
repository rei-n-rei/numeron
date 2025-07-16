const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const scores = []; // 仮の保存先（メモリ上）

app.post('/submit', (req, res) => {
  const { player, turns } = req.body;
  const record = {
    player,
    turns,
    date: new Date().toISOString()
  };
  scores.push(record);
  res.json({ message: 'スコア保存完了！' });
});

app.get('/ranking', (req, res) => {
  res.json(scores);
});

app.listen(3000, () => {
  console.log('🚀 API起動：http://localhost:3000');
});

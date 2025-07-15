# ヌメロン - Web版数当てゲーム

## 概要
3桁の重複しない数字を当てるゲームです。ターンごとにCPUの答えが変化するスリリングな仕様になっており、Firebaseを使って成績も保存されます。

## 特徴
- ユーザーによる直接入力とリアルタイム判定（双方向UI）
- 任意ターン間隔でCPUの1桁が変更される（重複回避ロジック）
- 過去のクリア履歴表示
- Firebase Realtime Database に成績保存

## 技術構成
- HTML / CSS / JavaScript
- Firebase（Web APIとして使用）

## 動作環境
- Webブラウザ（Chrome, Edge, Safari 等）
- Windows / macOS / Linux / iOS / Android 全対応

## 利用方法
1. `main.js` 内の Firebase 設定を自身のプロジェクト情報に置き換えてください  
2. 以下のファイルで構成されています：

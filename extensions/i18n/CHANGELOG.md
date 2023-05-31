# Changelog

## Deprecated Features

## 1.1.10
### Added
- 加入LocalizedPosition擴增功能，在上面可做node座標的即時編輯，並且加入存檔功能

## 1.1.9
### Changed
- 優化用AddLocalizedScript掛載LocalizedSkeleton變數只有保留SkeletonData改成全部
### Fixed
- 修正Component順序會導致set-property取直錯誤，改由動態去取得順序在塞值

## 1.1.8
### Fixed
- 修正 LocalizedPosition 新增語系會清空原先設定問題

## 1.1.7
- 提供查詢語系是否支援，如不支援回傳default語系（目前設為en）
- 初始語系直接更新場上語系資源

## 1.1.6
- 如果帶入語系不支援改採用預設"en"
### Fixed
- 修正空場景報錯
- 修正LocalizedPosition 警告

## 1.1.5
- 固定package中vue的版本，避免新版不相容的問題
- LocalizedSprite新增bundle載入失敗的重載功能

## 1.1.4
### Fixed
- 修正多國語系移除圖檔判斷有誤，已經移除圖檔的物件會損壞
- 修正多國語系Spine檔runtime錯誤

## 1.1.3
### Added
- 加入build code hook，將自動刪除scene及prefab上LocalizedSprite關聯圖檔資源

## 1.1.2
- 調整Sprite與Spine還原做法，改用直接Message去塞uuid達成不需要生成對應資源檔放入

## 1.1.1
- 增加menu分類
- 增加requireComponent

## 1.1.0
- 調整圖檔與spine方式，改用備份路徑來解決操作繁瑣問題
- 抽出界面方便擴充Localized系列（Skeleton無法取得更換SkeletonData時機故做法不同）
- 新增AddLocalizedScript直接去辨識需要添加的多國語系元件
- 新增神奇按鈕去刷新畫面

## 1.0.2
- 修正LocalizedSprite抓取圖檔方式會導致圖檔在auto-atlas但還是會另外下載並生成新小圖

## 1.0.1
- 增加介面按鈕說明
- 增加多國語系spine支援
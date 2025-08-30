chrome.commands.onCommand.addListener(async (command) => {
  if (command === "insert-stamp") insertStamp();
});

async function insertStamp() {
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  if (!tab?.id) return;

  if (!/^https?:|^file:/.test(tab.url || "")) return;

  const { defaultText = "" } = await chrome.storage.sync.get(["defaultText"]);
  const now = new Date();
  const fmt = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
  const parts = fmt.formatToParts(now);
  const get = (type) => parts.find(p => p.type === type)?.value || "";
  const stamp = `${get("month")}/${get("day")} ${get("hour")}:${get("minute")}`;
  const finalStr = defaultText ? `${stamp}　${defaultText}` : stamp;

  try {
    await chrome.tabs.sendMessage(tab.id, { type: "insert-stamp", payload: finalStr });
  } catch (err) {
    try {
      await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["contentScript.js"] });
      await chrome.tabs.sendMessage(tab.id, { type: "insert-stamp", payload: finalStr });
    } catch (e) {
      console.warn("スタンプ挿入失敗:", e);
    }
  }
}

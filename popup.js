document.getElementById("save").addEventListener("click", async () => {
  const val = document.getElementById("text").value.trim();
  await chrome.storage.sync.set({ defaultText: val });
  document.getElementById("save").textContent = "保存済み ✅";
  setTimeout(() => (document.getElementById("save").textContent = "保存"), 1200);
});

(async () => {
  const { defaultText = "" } = await chrome.storage.sync.get(["defaultText"]);
  document.getElementById("text").value = defaultText;
})();

function insertAtCursor(text) {
  const el = document.activeElement;
  if (!el) return;

  if (el.tagName === "TEXTAREA" || (el.tagName === "INPUT" && el.type === "text")) {
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    el.setRangeText(text, start, end, "end");
    el.dispatchEvent(new Event("input", { bubbles: true }));
    return;
  }

  if (el.isContentEditable) {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "insert-stamp" && msg.payload) {
    insertAtCursor(msg.payload);
  }
});

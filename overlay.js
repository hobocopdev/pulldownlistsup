if (!window.pulldownOverlayInserted) {
  window.pulldownOverlayInserted = true;

  if (window !== window.top) {
    document.getElementById("run").addEventListener("click", () => {
      const keyword = document.getElementById("keyword").value;
      window.parent.postMessage({ type: "pulldown-select", keyword }, "*");
    });
  } else {
    window.addEventListener("message", (event) => {
      if (event.data.type === "pulldown-select") {
        const keyword = event.data.keyword;
        const selectIndex = 2;
        const selects = document.querySelectorAll("select");
        const select = selects[selectIndex];

        if (!select) {
          alert("找不到指定下拉框");
          return;
        }

        for (let option of select.options) {
          if (option.text.includes(keyword)) {
            select.value = option.value;
            select.dispatchEvent(new Event("change"));
            alert("已选中: " + option.text);
            return;
          }
        }
        alert("没有找到包含该关键词的选项");
      }
    });
  }
}
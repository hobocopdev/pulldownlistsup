
function insertInputNextToSelect(select) {
  if (select.dataset._hasAutoSelector) return; // 避免重复插入
  select.dataset._hasAutoSelector = "1";

  const input = document.createElement("input");
  input.placeholder = "输入后自动选择下拉项";
  input.style.marginLeft = "8px";
  input.style.padding = "4px";
  input.style.fontSize = "14px";
  input.style.border = "1px solid #ccc";
  input.style.borderRadius = "4px";

  select.parentNode.insertBefore(input, select.nextSibling);

  input.addEventListener("input", () => {
    const term = input.value.trim().toLowerCase();
    const options = Array.from(select.options);
    const matched = options.find(opt => 
      (opt.textContent || "").toLowerCase().includes(term)
    );
    if (matched) {
      select.value = matched.value;
      select.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });
}

function runSelectorInjection() {
  const selectors = [
    "select",                  // A 类型（普通 select）
    ".custom-select select"    // B 类型（你可以替换成你实际系统的 class）
  ];

  selectors.forEach(sel => {
    const found = document.querySelectorAll(sel);
    found.forEach(insertInputNextToSelect);
  });
}

window.addEventListener("load", () => setTimeout(runSelectorInjection, 300));

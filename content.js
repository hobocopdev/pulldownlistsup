
function insertGlobalInput() {
  if (document.getElementById("pulldown-auto-input")) return;

  const input = document.createElement("input");
  input.id = "pulldown-auto-input";
  input.placeholder = "子項目を入力（例：池袋）";
  Object.assign(input.style, {
    position: "fixed",
    top: "10px",
    right: "10px",
    zIndex: 999999,
    padding: "6px 10px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    background: "white",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
  });

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      const term = input.value.trim();
      if (term) {
        trySelectByTerm(term);
      }
    }
  });

  document.body.appendChild(input);
}

function trySelectByTerm(term) {
  term = term.toLowerCase();

  // Step 1: Find matching <option> in <optgroup>
  const allOptions = Array.from(document.querySelectorAll("select option"));
  const match = allOptions.find(opt => (opt.textContent || "").toLowerCase().includes(term));

  if (!match) {
    alert("見つかりません：" + term);
    return;
  }

  const optgroup = match.parentElement.tagName === "OPTGROUP" ? match.parentElement : null;
  const groupLabel = optgroup?.label || null;

  // Step 2: Try to find parent select that contains optgroup.label
  if (groupLabel) {
    const parentSelects = Array.from(document.querySelectorAll("select"));
    for (const sel of parentSelects) {
      const options = Array.from(sel.options);
      const foundGroup = Array.from(sel.querySelectorAll("optgroup")).find(g => g.label === groupLabel);
      if (foundGroup) {
        // Step 3: Select mother option if found
        const idx = options.findIndex(opt => opt.textContent === groupLabel || opt.value === groupLabel);
        if (idx !== -1) {
          sel.selectedIndex = idx;
          sel.dispatchEvent(new Event("change", { bubbles: true }));
          // Wait for sub options to regenerate
          setTimeout(() => {
            selectSubItem(term);
          }, 300);
          return;
        }
      }
    }
  }

  // Fallback: Try to select the matched child only
  selectSubItem(term);
}

function selectSubItem(term) {
  const selects = Array.from(document.querySelectorAll("select"));
  for (const sel of selects) {
    const idx = Array.from(sel.options).findIndex(opt => (opt.textContent || "").toLowerCase().includes(term));
    if (idx !== -1) {
      sel.selectedIndex = idx;
      sel.dispatchEvent(new Event("change", { bubbles: true }));
      break;
    }
  }
}

window.addEventListener("load", () => {
  setTimeout(insertGlobalInput, 300);
});

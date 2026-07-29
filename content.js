const soundUrl = chrome.runtime.getURL("pizzicato.ogg");
const audio = new Audio(soundUrl);

console.log("✅ SARS Notifier loaded — monitoring main document");

function trackWaitBadge() {
  const el = document.getElementById("tabs-12-attention");
  if (!el) {
    console.log("⏳ Waiting for #tabs-12-attention...");
    setTimeout(trackWaitBadge, 1000);
    return;
  }

  console.log("✅ Found #tabs-12-attention");

  let lastVisible = getComputedStyle(el).display !== "none";
  let lastCount = parseInt(el.innerText || "0");

  const observer = new MutationObserver(() => {
    const visible = getComputedStyle(el).display !== "none";
    const count = parseInt(el.innerText || "0");

    if (visible && (!lastVisible || count > lastCount)) {
      console.log(`✅ DEBUG: Student wait count increased → ${lastCount} → ${count}`);
      audio.play().catch(err => console.error("🔇 Audio play failed:", err));
    }

    lastVisible = visible;
    lastCount = count;
  });

  observer.observe(el, {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true
  });
}

trackWaitBadge();

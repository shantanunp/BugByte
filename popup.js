document.getElementById("reportBug").addEventListener("click", async () => {
    const summary = document.getElementById("summary").value.trim();
    const description = document.getElementById("description").value.trim();

    if (!summary || !description) {
        alert("Please fill in both summary and description.");
        return;
    }

    // Get current tab URL (optional)
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const currentUrl = tab?.url || "Unknown URL";

    alert(`Bug Summary: ${summary}\nDescription: ${description}\nURL: ${currentUrl}\n(To be sent to AI backend)`);

    // TODO: Send data to backend for AI-based duplicate check
});

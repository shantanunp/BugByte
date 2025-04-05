document.getElementById("reportBug").addEventListener("click", async () => {
    const summary = document.getElementById("summary").value.trim();
    const description = document.getElementById("description").value.trim();

    if (!summary || !description) {
        alert("Please fill in both summary and description.");
        return;
    }

    // Get current tab URL
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const currentUrl = tab?.url || "Unknown URL";

    try {
        const response = await fetch("http://localhost:8000/check-bug", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                summary,
                description,
                url: currentUrl
            })
        });

        const result = await response.json();

        if (result.match_found) {
            const { ticket, score } = result;
            alert(`⚠️ Similar issue found!\n\nTicket: ${ticket.id}\nSummary: ${ticket.summary}\nScore: ${score}\n\nView: ${ticket.url}`);
        } else {
            alert("✅ No matching issue found. Safe to report this as a new bug.");
        }
    } catch (error) {
        console.error("Error contacting AI backend:", error);
        alert("❌ Failed to contact AI backend. Please try again.");
    }
});

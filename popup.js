document.getElementById("reportBug").addEventListener("click", async () => {
    const summary = document.getElementById("summary").value.trim();
    const description = document.getElementById("description").value.trim();

    if (!summary || !description) {
        alert("Please fill in both summary and description.");
        return;
    }

    const payload = {
        summary: summary,
        description: description
    };

    try {
        const response = await fetch("http://localhost:8000/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error("API request failed");
        }

        const result = await response.json();

        if (result.matches.length > 0) {
            const links = result.matches.map(m => `• ${m.id}`).join("\n");
            alert(`Similar issue(s) found:\n${links}`);
        } else {
            alert("No similar issue found. Proceed to create a new one.");
        }

    } catch (error) {
        console.error("Error contacting backend:", error);
        alert("Error checking for duplicate issues. Is the backend running?");
    }
});

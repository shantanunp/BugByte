document.getElementById("reportBug").addEventListener("click", async () => {
    const summary = document.getElementById("summary").value.trim();
    const description = document.getElementById("description").value.trim();

    if (!summary || !description) {
        alert("Please fill in both summary and description.");
        return;
    }

    const responseBox = document.getElementById("responseBox");
    responseBox.innerHTML = "🔍 Checking for similar bugs...";

    try {
        const res = await fetch("http://localhost:8000/search", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({summary, description}),
        });

        if (!res.ok) {
            responseBox.innerHTML = "Failed to connect to backend.";
            return;
        }

        const data = await res.json();

        if (!data.matches || data.matches.length === 0) {
            responseBox.innerHTML = "No similar bugs found.";
        } else {
            responseBox.innerHTML = `<strong>Possible Duplicates Found:</strong><br><br>`;
            data.matches.forEach(({issue, similarity}) => {
                const issueHtml = `
    <div style="margin-bottom: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
      <p><strong>ID:</strong> ${issue.id || "N/A"}</p>
      <p><strong>Summary:</strong> ${issue.summary || "N/A"}</p>
      <p><strong>Description:</strong><br>${issue.description?.trim().replace(/\n/g, "<br>") || "N/A"}</p>
      <p><strong>Similarity:</strong> ${similarity || "N/A"}</p>
    </div>
    `;
                responseBox.innerHTML += issueHtml;
            });
        }
    } catch (err) {
        console.error(err);
        responseBox.innerHTML = "Error while searching.";
    }
});

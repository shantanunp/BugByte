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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ summary, description }),
        });

        if (!res.ok) {
            responseBox.innerHTML = "❌ Failed to connect to backend.";
            return;
        }

        const data = await res.json();

        if (!data.matches || data.matches.length === 0) {
            responseBox.innerHTML = "✅ No similar bug found.";
        } else {
            responseBox.innerHTML = `<strong>⚠️ Possible duplicates:</strong><br><br>`;
            data.matches.forEach(({ issue, score }) => {
                const issueHtml = `
    <div style="margin-bottom: 10px;">
      <strong>🪲 ID:</strong> ${issue.id || "N/A"}<br>
      <strong>📌 Summary:</strong> ${issue.summary || "N/A"}<br>
      <strong>📝 Description:</strong> ${issue.description || "N/A"}<br>
      <strong>📊 Similarity Score:</strong> ${score !== undefined ? score.toFixed(2) : "N/A"}
    </div>
    <hr>
  `;
                responseBox.innerHTML += issueHtml;
            });
        }
    } catch (err) {
        console.error(err);
        responseBox.innerHTML = "❌ Error while searching.";
    }
});

// Helper: parse lap time string "m:ss.SSS" into milliseconds
function parseLapTimeToMillis(timeStr) {
    const parts = timeStr.split(':');
    if (parts.length !== 2) return Number.MAX_SAFE_INTEGER;
    const minutes = parseInt(parts[0], 10);
    const secParts = parts[1].split('.');
    const seconds = parseInt(secParts[0], 10);
    const millis = secParts[1] ? parseInt(secParts[1].padEnd(3, '0'), 10) : 0;
    return minutes * 60000 + seconds * 1000 + millis;
}

// Load CSV data as text (adjust path if needed)
async function loadCSV(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to load CSV');
    return await response.text();
}

// Parse CSV text to array of objects
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines.shift().split(',');
    return lines.map(line => {
        const values = line.split(',');
        const obj = {};
        headers.forEach((h, i) => obj[h.trim()] = values[i].trim());
        return obj;
    });
}

// Main function to load, sort, and render leaderboard
async function buildLeaderboard() {
    try {
        const csvText = await loadCSV('leaderboard.csv'); // Path to your CSV
        let data = parseCSV(csvText);

        // Sort by "Final Lap Time (Penalty if any)" ascending
        data.sort((a, b) => {
            return parseLapTimeToMillis(a['Final Lap Time (Penalty if any)']) -
                   parseLapTimeToMillis(b['Final Lap Time (Penalty if any)']);
        });

        const tbody = document.querySelector('#leaderboard-table tbody');
        tbody.innerHTML = ''; // Clear existing rows

        data.forEach((row, index) => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${row['Driver Name']}</td>
                <td>${row['Lap time']}</td>
                <td>${row['Final Lap Time (Penalty if any)']}</td>
                <td>${row['Car']}</td>
                <td>${row['Track']}</td>
            `;

            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error('Error building leaderboard:', err);
    }
}

// Run after page loads
window.addEventListener('DOMContentLoaded', buildLeaderboard);

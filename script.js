import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    const entryForm = document.getElementById('entryForm');
    const leaderboard = document.getElementById('leaderboard');
    const database = getDatabase(); // Initialize the database

    const renderLeaderboard = () => {
        leaderboard.innerHTML = ''; // Clear current leaderboard
        const leaderboardRef = ref(database, 'leaderboard'); // Reference to the leaderboard

        get(leaderboardRef).then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const entries = Object.values(data).sort((a, b) => b.count - a.count); // Sort by count

                // Append entries to leaderboard
                entries.forEach(user => {
                    const row = document.createElement('tr');
                    const nameCell = document.createElement('td');
                    nameCell.textContent = user.name;
                    const countCell = document.createElement('td');
                    countCell.textContent = user.count;
                    row.appendChild(nameCell);
                    row.appendChild(countCell);
                    leaderboard.appendChild(row);
                });
            } else {
                console.log('No data available');
            }
        }).catch((error) => {
            console.error(error);
        });
    };

    entryForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = entryForm.name.value.trim();
        const count = parseInt(entryForm.count.value.trim());

        if (name && count) {
            const userRef = ref(database, 'leaderboard/' + name);
            get(userRef).then((snapshot) => {
                if (snapshot.exists()) {
                    // Update existing user count
                    const existingCount = snapshot.val().count;
                    set(userRef, {
                        name: name,
                        count: existingCount + count
                    }).then(() => {
                        renderLeaderboard();
                        entryForm.reset();
                    }).catch((error) => {
                        console.error('Error updating to database', error);
                    });
                } else {
                    // Create new user entry
                    set(userRef, {
                        name: name,
                        count: count
                    }).then(() => {
                        renderLeaderboard();
                        entryForm.reset();
                    }).catch((error) => {
                        console.error('Error writing to database', error);
                    });
                }
            }).catch((error) => {
                console.error('Error fetching user data', error);
            });
        }
    });

    renderLeaderboard(); // Initial render
});

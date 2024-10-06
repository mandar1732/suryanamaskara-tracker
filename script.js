document.addEventListener('DOMContentLoaded', () => {
    const entryForm = document.getElementById('entryForm');
    const leaderboard = document.getElementById('leaderboard');

    // Reference to the leaderboard in the Firebase database
    const dbRef = firebase.database().ref('leaderboard');

    // Function to render the leaderboard
    const renderLeaderboard = (data) => {
        leaderboard.innerHTML = '';
        const sortedData = Object.values(data).sort((a, b) => b.count - a.count); // Sort by count descending
        sortedData.forEach(user => {
            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            nameCell.textContent = user.name;
            const countCell = document.createElement('td');
            countCell.textContent = user.count;
            row.appendChild(nameCell);
            row.appendChild(countCell);
            leaderboard.appendChild(row);
        });
    };

    // Fetch the leaderboard data from Firebase
    dbRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            renderLeaderboard(data);
        }
    });

    // Handle form submission
    entryForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = entryForm.name.value.trim();
        const count = parseInt(entryForm.count.value.trim());

        if (name && count) {
            dbRef.child(name).once('value', (snapshot) => {
                const existingUser = snapshot.val();
                const updatedCount = existingUser ? existingUser.count + count : count;
                dbRef.child(name).set({
                    name,
                    count: updatedCount
                });
            });
            entryForm.reset();
        }
    });
});

import { getDatabase, ref, set, get, child, update } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    const entryForm = document.getElementById('entryForm');
    const leaderboard = document.getElementById('leaderboard');
    const database = getDatabase(); // Initialize the database

    const renderLeaderboard = () => {
        leaderboard.innerHTML = '';
        // Fetch data from Firebase and render it here
        // Assuming your data structure is set up correctly in Firebase
        const leaderboardRef = ref(database, 'leaderboard'); // Adjust this based on your data structure
        get(leaderboardRef).then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                // Sort and render data...
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
    });

    renderLeaderboard();
});

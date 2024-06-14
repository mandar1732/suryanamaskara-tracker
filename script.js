document.addEventListener('DOMContentLoaded', () => {
    const entryForm = document.getElementById('entryForm');
    const leaderboard = document.getElementById('leaderboard');
    let data = JSON.parse(localStorage.getItem('suryanamaskaraData')) || [];

    const renderLeaderboard = () => {
        leaderboard.innerHTML = '';
        data.sort((a, b) => b.count - a.count);
        data.forEach(user => {
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

    entryForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = entryForm.name.value.trim();
        const count = parseInt(entryForm.count.value.trim());

        if (name && count) {
            const existingUser = data.find(user => user.name === name);
            if (existingUser) {
                existingUser.count += count;
            } else {
                data.push({ name, count });
            }
            localStorage.setItem('suryanamaskaraData', JSON.stringify(data));
            renderLeaderboard();
            entryForm.reset();
        }
    });

    renderLeaderboard();
});

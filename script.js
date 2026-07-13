document.addEventListener('DOMContentLoaded', () => {
    const teamsCountInput = document.getElementById('teams-count');
    const teamsInputContainer = document.getElementById('teams-input-container');
    const startLotteryBtn = document.getElementById('start-lottery');
    const drawPickBtn = document.getElementById('draw-pick');
    const draftOrderList = document.getElementById('draft-order-list');
    const setupContainer = document.getElementById('setup-container');
    const lotteryContainer = document.getElementById('lottery-container');
    const winnerDisplay = document.getElementById('winner-display');
    const remainingTeamsList = document.getElementById('remaining-teams-list');

    let teams = [];
    let draftOrder = [];

    teamsCountInput.addEventListener('input', () => {
        const count = parseInt(teamsCountInput.value, 10);
        if (count > 0) {
            generateTeamInputs(count);
            startLotteryBtn.style.display = 'block';
        } else {
            teamsInputContainer.innerHTML = '';
            startLotteryBtn.style.display = 'none';
        }
    });

    function generateTeamInputs(count) {
        teamsInputContainer.innerHTML = '';
        // Create grid container
        const grid = document.createElement('div');
        grid.className = 'teams-grid';
        // Add header row
        grid.innerHTML = `
            <div class="teams-grid-header">Team Name</div>
            <div class="teams-grid-header">Lottery Balls</div>
        `;
        // Add input rows
        for (let i = 0; i < count; i++) {
            grid.innerHTML += `
                <input type="text" class="team-name" placeholder="Team Name" value="Team ${i + 1}">
                <input type="number" class="team-balls" min="1" value="1">
            `;
        }
        teamsInputContainer.appendChild(grid);
    }

    startLotteryBtn.addEventListener('click', () => {
        teams = [];
        // Select all pairs of team-name and team-balls inputs in the grid
        const teamNameInputs = document.querySelectorAll('.teams-grid .team-name');
        const teamBallsInputs = document.querySelectorAll('.teams-grid .team-balls');
        for (let i = 0; i < teamNameInputs.length; i++) {
            const name = teamNameInputs[i].value || `Team ${i + 1}`;
            const balls = parseInt(teamBallsInputs[i].value, 10);
            if (!isNaN(balls) && balls >= 0) {
                teams.push({ name, balls });
            }
        }
        if (teams.length > 0) {
            setupContainer.style.display = 'none';
            lotteryContainer.style.display = 'block';
            updateRemainingTeamsDisplay();
        } else {
            alert('Please add at least one team.');
        }
    });

    drawPickBtn.addEventListener('click', () => {
        if (teams.length === 0) {
            winnerDisplay.textContent = 'All teams have been drafted!';
            drawPickBtn.disabled = true;
            return;
        }

        const lotteryPool = [];
        teams.forEach(team => {
            for (let i = 0; i < team.balls; i++) {
                lotteryPool.push(team.name);
            }
        });

        if (lotteryPool.length === 0) {
            const remainingUndrafted = teams.filter(t => !draftOrder.includes(t.name));
            if(remainingUndrafted.length > 0){
                winnerDisplay.textContent = 'No lottery balls remaining. All further picks will be random.';
                const winnerName = remainingUndrafted[Math.floor(Math.random() * remainingUndrafted.length)].name;
                draftOrder.push(winnerName);
                teams = teams.filter(team => team.name !== winnerName);
            } else {
                 winnerDisplay.textContent = 'All teams have been drafted!';
                 drawPickBtn.disabled = true;
            }
            updateDraftOrderList();
            updateRemainingTeamsDisplay();
            return;
        }

        const winnerIndex = Math.floor(Math.random() * lotteryPool.length);
        const winnerName = lotteryPool[winnerIndex];

        draftOrder.push(winnerName);
        winnerDisplay.textContent = `Pick #${draftOrder.length} goes to: ${winnerName}!`;

        teams = teams.filter(team => team.name !== winnerName);

        updateDraftOrderList();
        updateRemainingTeamsDisplay();

        if (teams.filter(t => !draftOrder.includes(t.name)).length === 0) {
            drawPickBtn.disabled = true;
            winnerDisplay.textContent = 'The draft order is set!';
        }
    });

    function updateDraftOrderList() {
        draftOrderList.innerHTML = '';
        draftOrder.forEach((teamName, index) => {
            const li = document.createElement('li');
            li.textContent = teamName;
            draftOrderList.appendChild(li);
        });
    }

    function updateRemainingTeamsDisplay() {
        const remainingUndraftedTeams = teams.filter(t => !draftOrder.includes(t.name));
        remainingTeamsList.innerHTML = '';
        const totalBalls = remainingUndraftedTeams.reduce((sum, team) => sum + team.balls, 0);

        if (remainingUndraftedTeams.length === 0) {
            return;
        }

        remainingUndraftedTeams.forEach(team => {
            const percentage = totalBalls > 0 ? ((team.balls / totalBalls) * 100).toFixed(2) : 0;
            const li = document.createElement('li');
            li.textContent = `${team.name}: ${team.balls} balls (${percentage}%)`;
            remainingTeamsList.appendChild(li);
        });
    }

    const initialCount = parseInt(teamsCountInput.value, 10);
    if (initialCount > 0) {
        generateTeamInputs(initialCount);
        startLotteryBtn.style.display = 'block';
    }
});

// Initialize scores from localStorage
document.addEventListener('DOMContentLoaded', function() {
    loadScores();
});

const teamNames = {
    1: 'boy basement',
    2: 'third floor',
    3: 'fourth floor'
};

function loadScores() {
    for (let i = 1; i <= 3; i++) {
        const score = localStorage.getItem(`team${i}-score`);
        if (score) {
            document.getElementById(`team${i}-score`).textContent = score;
        }
    }
}

function addPoints(teamNumber, points) {
    const scoreElement = document.getElementById(`team${teamNumber}-score`);
    let currentScore = parseInt(scoreElement.textContent);
    let newScore = currentScore + points;
    scoreElement.textContent = newScore;
    localStorage.setItem(`team${teamNumber}-score`, newScore);
}

function resetScore(teamNumber) {
    document.getElementById(`team${teamNumber}-score`).textContent = '0';
    localStorage.setItem(`team${teamNumber}-score`, '0');
}

function resetAllScores() {
    if (confirm('Are you sure you want to reset all scores?')) {
        for (let i = 1; i <= 3; i++) {
            resetScore(i);
        }
    }
}

function endGame() {
    const scores = [1, 2, 3].map(function(teamNumber) {
        const scoreElement = document.getElementById(`team${teamNumber}-score`);
        return {
            teamNumber: teamNumber,
            score: parseInt(scoreElement.textContent, 10) || 0
        };
    });

    const highestScore = Math.max.apply(null, scores.map(function(team) {
        return team.score;
    }));

    const winners = scores.filter(function(team) {
        return team.score === highestScore;
    });

    const title = document.getElementById('winnerTitle');
    const photos = document.getElementById('winnerPhotos');
    const message = document.getElementById('winnerMessage');

    photos.innerHTML = '';

    if (winners.length === 1) {
        const winningTeam = winners[0];
        title.textContent = `${teamNames[winningTeam.teamNumber]} wins!`;
        message.textContent = 'they each win $10 gift cards from coffee exchange, hazel origin, or amyn\'s!';
        photos.appendChild(cloneTeamPhotos(winningTeam.teamNumber));
    } else {
        title.textContent = 'It\'s a tie!';
        message.textContent = 'All tied teams win $10 gift cards.';

        winners.forEach(function(team) {
            const teamBlock = document.createElement('div');
            teamBlock.className = 'winner-tie-block';

            const heading = document.createElement('h3');
            heading.textContent = teamNames[team.teamNumber];
            teamBlock.appendChild(heading);
            teamBlock.appendChild(cloneTeamPhotos(team.teamNumber));

            photos.appendChild(teamBlock);
        });
    }

    openWinnerPopup();
}

function cloneTeamPhotos(teamNumber) {
    const teamCard = Array.from(document.querySelectorAll('.team-score')).find(function(card) {
        const name = card.querySelector('.team-name');
        return name && name.textContent.trim() === teamNames[teamNumber];
    });

    const photos = teamCard ? teamCard.querySelector('.team-photos') : null;
    return photos ? photos.cloneNode(true) : document.createElement('div');
}

function closeWinnerPopup() {
    const popup = document.getElementById('winnerPopup');
    popup.classList.remove('show');
    popup.style.display = 'none';
}

function openWinnerPopup() {
    const popup = document.getElementById('winnerPopup');
    popup.style.display = 'flex';
    popup.classList.add('show');
}

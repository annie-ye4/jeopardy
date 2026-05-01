// Set random double jeopardy tile on page load
document.addEventListener('DOMContentLoaded', function() {
    setRandomDoubleJeopardy();
    loadAnsweredTiles();
    addTileClickListeners();
});

let doubleJeopardyTileId = null;

function setRandomDoubleJeopardy() {
    const tiles = document.querySelectorAll('.tile');
    const randomIndex = Math.floor(Math.random() * tiles.length);
    const randomTile = tiles[randomIndex];
    doubleJeopardyTileId = randomTile.id;
    // Mark the tile with a data attribute (visible in IDE, not in UI)
    randomTile.setAttribute('data-double-jeopardy', 'true');
}

function addTileClickListeners() {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        tile.addEventListener('click', function() {
            if (!this.classList.contains('answered')) {
                openQuestion(this.id);
            }
        });
    });
}

function openQuestion(tileId) {
    const tile = document.getElementById(tileId);
    const value = tile.getAttribute('data-value');
    const column = tile.getAttribute('data-column');
    const question = tile.getAttribute('data-question');
    const answer = tile.getAttribute('data-answer');
    
    // Set modal title
    document.getElementById('modalTitle').textContent = `Category ${column} - $${value}`;
    
    // Set current tile being edited
    window.currentTileId = tileId;
    
    // Display the question
    const questionText = document.getElementById('questionText');
    questionText.textContent = question || 'No question entered';
    
    // Display the answer (hidden by default)
    const answerDisplay = document.getElementById('answerDisplay');
    const answerText = document.getElementById('answerText');
    answerText.textContent = answer || 'No answer entered';
    answerDisplay.classList.add('hidden');
    
    // Reset reveal button text
    const revealBtn = document.querySelector('.btn-reveal');
    revealBtn.textContent = 'Reveal Answer';
    
    // Check if this is a Double Jeopardy tile
    if (tileId === doubleJeopardyTileId) {
        showDoubleJeopardyPopup();
        startDoubleJeopardyTimer();
        // Delay opening the modal so the popup shows first
        setTimeout(() => {
            document.getElementById('questionModal').style.display = 'block';
        }, 1500);
    } else {
        // Show modal immediately for regular tiles
        document.getElementById('questionModal').style.display = 'block';
    }
}

function toggleAnswer() {
    const answerDisplay = document.getElementById('answerDisplay');
    const revealBtn = document.querySelector('.btn-reveal');
    
    if (answerDisplay.classList.contains('hidden')) {
        answerDisplay.classList.remove('hidden');
        revealBtn.textContent = 'Hide Answer';
    } else {
        answerDisplay.classList.add('hidden');
        revealBtn.textContent = 'Reveal Answer';
    }
}

function showDoubleJeopardyPopup() {
    const popup = document.getElementById('doubleJeopardyPopup');
    popup.classList.add('show');
    
    // Close popup when clicking on the dark overlay (outside the content)
    popup.addEventListener('click', function closePopup(e) {
        e.preventDefault();
        e.stopPropagation();
        // Only close if clicking on the popup background, not the content
        if (e.target === popup) {
            popup.classList.remove('show');
            popup.removeEventListener('click', closePopup);
        }
    });
}

function markAnswered() {
    const tile = document.getElementById(window.currentTileId);
    if (tile) {
        tile.classList.add('answered');
        saveAnsweredTiles();
    }
    closeModal();
}

function closeModal() {
    document.getElementById('questionModal').style.display = 'none';
    stopDoubleJeopardyTimer();
    // Mark the tile as answered
    if (window.currentTileId) {
        const tile = document.getElementById(window.currentTileId);
        if (tile) {
            tile.classList.add('answered');
            saveAnsweredTiles();
        }
    }
}

// Close modal when clicking outside of it
window.addEventListener('click', function(event) {
    const modal = document.getElementById('questionModal');
    if (event.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Reset board (optional)
function resetBoard() {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        tile.classList.remove('answered');
    });
    // Clear persisted state
    saveAnsweredTiles();
    setRandomDoubleJeopardy();
}

// Persist answered tiles to localStorage so state survives page navigation
function saveAnsweredTiles() {
    const answered = Array.from(document.querySelectorAll('.tile.answered')).map(t => t.id);
    try {
        localStorage.setItem('answeredTiles', JSON.stringify(answered));
    } catch (e) {
        console.warn('Could not save answered tiles:', e);
    }
}

function loadAnsweredTiles() {
    try {
        const raw = localStorage.getItem('answeredTiles');
        if (!raw) return;
        const answered = JSON.parse(raw);
        if (!Array.isArray(answered)) return;
        answered.forEach(id => {
            const tile = document.getElementById(id);
            if (tile) tile.classList.add('answered');
        });
    } catch (e) {
        console.warn('Could not load answered tiles:', e);
    }
}

// Double Jeopardy Timer
let doubleJeopardyTimer = null;

function startDoubleJeopardyTimer() {
    const timerDisplay = document.getElementById('timerDisplay');
    if (!timerDisplay) return;
    
    // Clear any existing timer
    if (doubleJeopardyTimer) {
        clearInterval(doubleJeopardyTimer);
    }
    
    let timeRemaining = 60; // 60 seconds
    timerDisplay.classList.remove('hidden');
    timerDisplay.textContent = '1:00';
    
    doubleJeopardyTimer = setInterval(() => {
        timeRemaining--;
        
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        timerDisplay.textContent = display;
        
        if (timeRemaining <= 0) {
            clearInterval(doubleJeopardyTimer);
            timerDisplay.classList.add('hidden');
        }
    }, 1000);
}

function stopDoubleJeopardyTimer() {
    if (doubleJeopardyTimer) {
        clearInterval(doubleJeopardyTimer);
        doubleJeopardyTimer = null;
    }
    
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) {
        timerDisplay.classList.add('hidden');
    }
}

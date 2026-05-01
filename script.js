// Set random double jeopardy tile on page load
document.addEventListener('DOMContentLoaded', function() {
    setRandomDoubleJeopardy();
    addTileClickListeners();
});

let doubleJeopardyTileId = null;

function setRandomDoubleJeopardy() {
    const tiles = document.querySelectorAll('.tile');
    const randomIndex = Math.floor(Math.random() * tiles.length);
    const randomTile = tiles[randomIndex];
    doubleJeopardyTileId = randomTile.id;
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
    
    // Auto-hide the popup after 2 seconds
    setTimeout(() => {
        popup.classList.remove('show');
    }, 2000);
}

function markAnswered() {
    const tile = document.getElementById(window.currentTileId);
    if (tile) {
        tile.classList.add('answered');
    }
    closeModal();
}

function closeModal() {
    document.getElementById('questionModal').style.display = 'none';
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
    setRandomDoubleJeopardy();
}

document.addEventListener('DOMContentLoaded', function () {
    var startButton = document.getElementById('startButton');
    startButton.addEventListener('click', startGame);

    var homeButton = document.getElementById('homeButton');
    homeButton.addEventListener('click', function () {
        var gameWrapper = document.getElementById('game');
        gameWrapper.style.display = 'none';

        var homeWrapper = document.getElementById('home');
        homeWrapper.style.display = 'block';
    });
});

function startGame() {
    var homeWrapper = document.getElementById('home');
    var gameWrapper = document.getElementById('game');

    homeWrapper.style.display = 'none';
    gameWrapper.style.display = 'block';

    startTimer();
    resetGame();
    generateTaupiqueurs();
}

function resetGame() {
    var scoreElement = document.getElementById('score');
    scoreElement.textContent = '0';

    var holes = document.querySelectorAll('.hole');
    holes.forEach(function (hole) {
        hole.innerHTML = '<img src="./assets/Hole.png" class="hole_image" alt="Trou" draggable="false"> ';
        hole.classList.remove('has-taupiqueur');
    });
}

function generateTaupiqueurs() {
    var holes = document.querySelectorAll('.hole');
    var difficulty = document.getElementById('difficulty').value;
    var interval;
    var taupiqueurTimeout;

    switch (difficulty) {
        case 'Roucool':
            interval = 3000;
            taupiqueurScore = 10;
            taupiqueurTimeout = 2000;
            break;
        case 'Roucoups':
            interval = 2000;
            taupiqueurScore = 15;
            taupiqueurTimeout = 1500;
            break;
        case 'Roucarnage':
            interval = 1000;
            taupiqueurScore = 20;
            taupiqueurTimeout = 1000;
            break;
        default:
            interval = 3000;
            taupiqueurScore = 10;
            taupiqueurTimeout = 2000;
    }

    var taupiqueurInterval = setInterval(function () {
        var randomHoleIndex = Math.floor(Math.random() * holes.length);
        var randomHole = holes[randomHoleIndex];

        if (!randomHole.classList.contains('has-taupiqueur')) {
            var isTriopikeur = Math.random() < 0.2; // 20% de chance d'apparition de Triopikeur

            var taupiqueurHTML;
            if (isTriopikeur && difficulty === 'Roucarnage') {
                taupiqueurHTML = '<img src="./assets/Triopikeur.png" class="taupiqueur_image" alt="Triopikeur" draggable="false">';
            } else {
                taupiqueurHTML = '<img src="./assets/Taupiqueur.png" class="taupiqueur_image" alt="Taupiqueur" draggable="false">';
            }

            randomHole.innerHTML = taupiqueurHTML;
            randomHole.classList.add('has-taupiqueur');
            randomHole.addEventListener('click', function () {
                if (randomHole.classList.contains('has-taupiqueur')) {
                    var scoreElement = document.getElementById('score');
                    var currentScore = parseInt(scoreElement.textContent);
                    scoreElement.textContent = currentScore + (isTriopikeur ? 20 : 10);
                    randomHole.innerHTML = '';
                    randomHole.classList.remove('has-taupiqueur');
                    setTimeout(function () {
                        randomHole.innerHTML = '<img src="./assets/Hole.png" class="hole_image" alt="Trou" draggable="false">';
                    }, 100);
                }
            });

            setTimeout(function () {
                randomHole.innerHTML = '<img src="./assets/Hole.png" class="hole_image" alt="Trou" draggable="false">';
                randomHole.classList.remove('has-taupiqueur');
            }, taupiqueurTimeout);
        }
    }, interval);
}


function startTimer() {
    var timer = 0;
    var timerElement = document.getElementById('timer');
    var timerInterval = setInterval(function () {
        timer++;
        timerElement.textContent = timer;
        if (timer >= 30) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

function endGame() {
    var gameWrapper = document.getElementById('game');
    gameWrapper.style.display = 'none';

    var homeWrapper = document.getElementById('home');
    homeWrapper.style.display = 'block';

    var playerName = document.getElementById('name').value;
    var difficulty = document.getElementById('difficulty').value;
    var score = document.getElementById('score').textContent;

    alert("Votre score est de : " + score);

    saveGameData(playerName, difficulty, score);

    location.reload();
}

function saveGameData(name, difficulty, score) {
    var existingData = localStorage.getItem('gameData');
    var gameDataArray = existingData ? JSON.parse(existingData) : [];

    var newGameData = {
        name: name,
        difficulty: difficulty,
        score: score
    };
    gameDataArray.push(newGameData);

    localStorage.setItem('gameData', JSON.stringify(gameDataArray));
}

document.addEventListener('DOMContentLoaded', function() {
    var leaderboardLink = document.getElementById('leaderboardLink');
    leaderboardLink.addEventListener('click', ShowLeaderboard);
});

document.addEventListener('DOMContentLoaded', function() {
    var leaderboardLink = document.getElementById('leaderboardLink');
    leaderboardLink.addEventListener('click', function(event) {
        event.preventDefault(); // Empêche le lien de naviguer vers une autre page

        ShowLeaderboard();
    });

    var closeLeaderboard = document.getElementById('closeLeaderboard');
    closeLeaderboard.addEventListener('click', function() {
        var leaderboardPopup = document.getElementById('leaderboardPopup');
        leaderboardPopup.style.display = 'none';
    });
});

function ShowLeaderboard() {
    var leaderboardPopup = document.getElementById('leaderboardPopup');
    var leaderboardList = document.getElementById('leaderboard-list');
    var selectedDifficulty = document.getElementById('difficultySelectPopup').value;

    var gameData = localStorage.getItem('gameData');
    var gameDataArray = gameData ? JSON.parse(gameData) : [];

    var filteredGameDataArray = gameDataArray.filter(function(data) {
        return data.difficulty === selectedDifficulty || selectedDifficulty === "all";
    });

    filteredGameDataArray.sort(function(a, b) {
        return b.score - a.score;
    });

    leaderboardList.innerHTML = '';
    filteredGameDataArray.forEach(function(data) {
        var listItem = document.createElement('li');
        listItem.textContent = `${data.name} - Score: ${data.score}`;
        leaderboardList.appendChild(listItem);
    });

    leaderboardPopup.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function() {
    // Sélection de l'élément select de la difficulté dans la pop-up
    var difficultySelectPopup = document.getElementById('difficultySelectPopup');
    
    // Ajout d'un événement "change" à l'élément select
    difficultySelectPopup.addEventListener('change', function() {
        // Appel de la fonction ShowLeaderboard pour mettre à jour le classement
        ShowLeaderboard();
    });
});

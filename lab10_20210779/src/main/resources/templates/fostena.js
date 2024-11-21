let gameMap = [];
let robotPosition = { x: 0, y: 0 };
let robotDirection = "right";
let obstaclesVisible = false;

const colors = {
    I: "yellow",
    F: "green",
    A: "black",
    O: "lightblue",
    S: "red",
    C: "orange",
    P: "purple",
};

function startGame() {
    const textarea = document.getElementById("gameMap");
    const mapInput = textarea.value.trim().split("\n");

    if (mapInput.length === 0) {
        alert("Por favor, ingrese el mapa del juego.");
        return;
    }

    gameMap = mapInput.map(row => row.split(""));
    initializeRobot();
    renderGameBoard();

    textarea.style.display = "none";
    document.getElementById("startGame").style.display = "none";
    document.getElementById("toggleObstacles").style.display = "block";

    document.addEventListener("keydown", handleMovement);
}

function initializeRobot() {
    for (let i = 0; i < gameMap.length; i++) {
        for (let j = 0; j < gameMap[i].length; j++) {
            if (gameMap[i][j] === "I") {
                robotPosition = { x: j, y: i };
                return;
            }
        }
    }
}

function renderGameBoard() {
    const gameBoard = document.getElementById("gameBoard");
    gameBoard.innerHTML = "";
    gameBoard.style.gridTemplateRows = `repeat(${gameMap.length}, 1fr)`;
    gameBoard.style.gridTemplateColumns = `repeat(${gameMap[0].length}, 1fr)`;

    for (let i = 0; i < gameMap.length; i++) {
        for (let j = 0; j < gameMap[i].length; j++) {
            const cell = document.createElement("div");
            cell.className = "grid-cell hidden";
            cell.dataset.row = i;
            cell.dataset.col = j;

            const cellType = gameMap[i][j];
            if (colors[cellType]) {
                cell.style.backgroundColor = colors[cellType];
                if (cellType === "I" || cellType === "F") {
                    cell.classList.remove("hidden");
                    cell.classList.add("visible");
                }
            }
            gameBoard.appendChild(cell);
        }
    }

    updateRobotPosition();
}

function updateRobotPosition() {
    const cells = document.querySelectorAll(".grid-cell");
    cells.forEach(cell => cell.textContent = "");

    const robotCell = document.querySelector(
        `.grid-cell[data-row="${robotPosition.y}"][data-col="${robotPosition.x}"]`
    );
    robotCell.textContent = "🤖";
    robotCell.classList.add("visible");
}

function handleMovement(event) {
    const directionMap = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
    };

    if (!directionMap[event.key]) return;

    const newX = robotPosition.x + directionMap[event.key].x;
    const newY = robotPosition.y + directionMap[event.key].y;

    if (newX < 0 || newY < 0 || newY >= gameMap.length || newX >= gameMap[0].length) {
        alert("El robot no puede salir del tablero.");
        return;
    }

    robotPosition = { x: newX, y: newY };
    updateRobotPosition();
}

function toggleObstacles() {
    const cells = document.querySelectorAll(".grid-cell");
    obstaclesVisible = !obstaclesVisible;

    cells.forEach(cell => {
        if (!cell.classList.contains("visible")) {
            cell.classList.toggle("hidden", !obstaclesVisible);
        }
    });

    const button = document.getElementById("toggleObstacles");
    button.textContent = obstaclesVisible ? "Ocultar obstáculos" : "Mostrar obstáculos";
}

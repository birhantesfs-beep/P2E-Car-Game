const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreDisplay = document.getElementById("score");
const tokensDisplay = document.getElementById("tokens");

// የጌም ተለዋዋጮች
let score = 0;
let tokens = 0.00;
let isGameOver = false;

// መንገዱን በ 3 መስመሮች (Lanes) እንከፍለዋለን
const lanes = [60, 160, 260]; // የግራ፣ መሃል እና የቀኝ መስመር X መቁረጫዎች
let currentLaneIndex = 1; // መኪናው መጀመሪያ መሃል ላይ ይቆማል

let car = {
    x: lanes[currentLaneIndex],
    y: canvas.height - 90,
    width: 40,
    height: 70,
    color: "#00ffcc"
};

let obstacles = [];
let obstacleTimer = 0;
let coinList = [];

// የ Swipe እንቅስቃሴን መለየት
let touchStartX = 0;
let touchEndX = 0;

canvas.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
});

canvas.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].clientX;
    handleSwipe();
});

function handleSwipe() {
    let diffX = touchEndX - touchStartX;

    if (Math.abs(diffX) > 30) { // አነስተኛ የርቀት ገደብ
        if (diffX > 0) {
            // ወደ ቀኝ ስዋይፕ
            if (currentLaneIndex < lanes.length - 1) {
                currentLaneIndex++;
            }
        } else {
            // ወደ ግራ ስዋይፕ
            if (currentLaneIndex > 0) {
                currentLaneIndex--;
            }
        }
        car.x = lanes[currentLaneIndex]; // መኪናውን ወዲያው ወደ አዲሱ መስመር ማዘዋወር
    }
}

// ለኮምፒዩተር የኪቦርድ አማራጭ ( ቀስት ቁልፎች)
window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" && currentLaneIndex > 0) {
        currentLaneIndex--;
        car.x = lanes[currentLaneIndex];
    }
    if (e.key === "ArrowRight" && currentLaneIndex < lanes.length - 1) {
        currentLaneIndex++;
        car.x = lanes[currentLaneIndex];
    }
});

function spawnItems() {
    obstacleTimer++;
    if (obstacleTimer > 50) {
        obstacleTimer = 0;
        
        // እንቅፋት በዘፈቀደ ከ 3ቱ መስመሮች በአንዱ ላይ ይወጣል
        let randomLane = lanes[Math.floor(Math.random() * lanes.length)];
        obstacles.push({ x: randomLane, y: -80, width: 40, height: 70, speed: 4 });

        if (Math.random() > 0.4) {
            let coinLane = lanes[Math.floor(Math.random() * lanes.length)];
            coinList.push({ x: coinLane + 10, y: -40, radius: 12, speed: 4 });
        }
    }
}

function update() {
    if (isGameOver) return;

    spawnItems();

    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].y += obstacles[i].speed;

        if (
            car.x < obstacles[i].x + obstacles[i].width &&
            car.x + car.width > obstacles[i].x &&
            car.y < obstacles[i].y + obstacles[i].height &&
            car.y + car.height > obstacles[i].y
        ) {
            isGameOver = true;
            alert("ጌሙ አልቋል! (Game Over) ነጥብዎ: " + score);
            location.reload();
        }

        if (obstacles[i].y > canvas.height) {
            obstacles.splice(i, 1);
            score += 10;
            scoreDisplay.innerText = score;
        }
    }

    for (let i = coinList.length - 1; i >= 0; i--) {
        coinList[i].y += coinList[i].speed;

        let distanceX = (car.x + car.width / 2) - coinList[i].x;
        let distanceY = (car.y + car.height / 2) - coinList[i].y;
        let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        if (distance < car.width / 2 + coinList[i].radius) {
            tokens += 0.50;
            tokensDisplay.innerText = tokens.toFixed(2);
            coinList.splice(i, 1);
        } else if (coinList[i].y > canvas.height) {
            coinList.splice(i, 1);
        }
    }
}

function draw() {
    ctx.fillStyle = "#2c3e50";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // የመንገድ መስመሮች (3  lanes እንዲታዩ 2 መስመሮች እናስገባለን)
    ctx.strokeStyle = "#fff";
    ctx.setLineDash([20, 20]);
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    ctx.moveTo(120, 0); ctx.lineTo(120, canvas.height);
    ctx.moveTo(240, 0); ctx.lineTo(240, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // የተጫዋች መኪና
    ctx.fillStyle = car.color;
    ctx.fillRect(car.x, car.y, car.width, car.height);
    ctx.fillStyle = "#111";
    ctx.fillRect(car.x + 5, car.y + 15, car.width - 10, 15);

    // እንቅፋቶች
    ctx.fillStyle = "#e74c3c";
    for (let obs of obstacles) {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    }

    // 🪙 ቶከኖች
    ctx.fillStyle = "#f1c40f";
    for (let coin of coinList) {
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#d4ac0d";
        ctx.stroke();
    }
}

function loop() {
    update();
    draw();
    if (!isGameOver) {
        requestAnimationFrame(loop);
    }
}

loop();
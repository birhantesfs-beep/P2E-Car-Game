const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreDisplay = document.getElementById("score");
const tokensDisplay = document.getElementById("tokens");

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

// የጌም ተለዋዋጮች (Game Variables)
let score = 0;
let tokens = 0.00;
let isGameOver = false;

// የተጫዋች መኪና (Player Car)
let car = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 90,
    width: 40,
    height: 70,
    speed: 5,
    color: "#00ffcc"
};

// የመንገድ ላይ እንቅፋቶች ወይም ሌሎች መኪናዎች (Obstacles)
let obstacles = [];
let obstacleTimer = 0;

// የቶከን/ኮይን ዝርዝር (Tokens to collect)
let coinList = [];

// ቁልፎችን ሲጫኑ የሚፈጠር እንቅስቃሴ
let movingLeft = false;
let movingRight = false;

leftBtn.addEventListener("touchstart", () => movingLeft = true);
leftBtn.addEventListener("touchend", () => movingLeft = false);
rightBtn.addEventListener("touchstart", () => movingRight = true);
rightBtn.addEventListener("touchend", () => movingRight = false);

// ለኮምፒዩተር ወይም ማሻሻያ ያህል የኪቦርድ ቁልፎችም (Arrow keys)
window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") movingLeft = true;
    if (e.key === "ArrowRight") movingRight = true;
});
window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") movingLeft = false;
    if (e.key === "ArrowRight") movingRight = false;
});

// እንቅፋቶችን እና ኮይኖችን መፍጠር
function spawnItems() {
    obstacleTimer++;
    if (obstacleTimer > 60) { // በየጊዜው ይታያሉ
        obstacleTimer = 0;
        
        // እንቅፋት መኪና
        let obsX = Math.random() * (canvas.width - 40);
        obstacles.push({ x: obsX, y: -80, width: 40, height: 70, speed: 4 });

        // የብርሃን 🪙 ቶከን
        if (Math.random() > 0.4) {
            let coinX = Math.random() * (canvas.width - 25);
            coinList.push({ x: coinX, y: -40, radius: 12, speed: 4 });
        }
    }
}

// ጌሙን ማዘመን (Update Game Logic)
function update() {
    if (isGameOver) return;

    // የመኪና እንቅስቃሴ መቆጣጠር
    if (movingLeft && car.x > 0) {
        car.x -= car.speed;
    }
    if (movingRight && car.x < canvas.width - car.width) {
        car.x += car.speed;
    }

    spawnItems();

    // እንቅፋቶችን ማያንቀሳቀስ
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].y += obstacles[i].speed;

        // ከ ተጫዋች መኪና ጋር መጋጨቱን ማረጋገጥ (Collision Detection)
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

        // ከስክሪኑ ውጭ ከወጡ ማስወገድ
        if (obstacles[i].y > canvas.height) {
            obstacles.splice(i, 1);
            score += 10;
            scoreDisplay.innerText = score;
        }
    }

    // 🪙 ቶከኖችን ማያንቀሳቀስ እና መሰብሰብ
    for (let i = coinList.length - 1; i >= 0; i--) {
        coinList[i].y += coinList[i].speed;

        // መኪናው ኮይኑን ሲነካው
        let distanceX = (car.x + car.width / 2) - coinList[i].x;
        let distanceY = (car.y + car.height / 2) - coinList[i].y;
        let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        if (distance < car.width / 2 + coinList[i].radius) {
            tokens += 0.50; // የብርሃን ቶከን ይጨምራል (PlayToEarn aspect)
            tokensDisplay.innerText = tokens.toFixed(2);
            coinList.splice(i, 1);
        } else if (coinList[i].y > canvas.height) {
            coinList.splice(i, 1);
        }
    }
}

// ምስሎችን በካንቫስ ላይ መሳል (Render Graphics)
function draw() {
    // ማስተካከያ ዳራ (Background Road)
    ctx.fillStyle = "#2c3e50";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // የመንገድ መሃል መስመሮች (Road dashed lines)
    ctx.strokeStyle = "#fff";
    ctx.setLineDash([20, 20]);
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // የተጫዋቹን መኪና መሳል (BirhanCar)
    ctx.fillStyle = car.color;
    ctx.fillRect(car.x, car.y, car.width, car.height);
    // የመኪና መስኮቶች ማስጌጫ
    ctx.fillStyle = "#111";
    ctx.fillRect(car.x + 5, car.y + 15, car.width - 10, 15);

    // እንቅፋት መኪናዎችን መሳል
    ctx.fillStyle = "#e74c3c";
    for (let obs of obstacles) {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    }

    // 🪙 ቶከኖችን (Coins) መሳል
    ctx.fillStyle = "#f1c40f";
    for (let coin of coinList) {
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#d4ac0d";
        ctx.stroke();
    }
}

// የጌም ሎፕ (Game Loop)
function loop() {
    update();
    draw();
    if (!isGameOver) {
        requestAnimationFrame(loop);
    }
}

// ጌሙን ማስጀመር
loop();
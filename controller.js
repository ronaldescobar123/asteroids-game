const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const menu = document.getElementById("menu");
const startButton = document.getElementById("start");
const scoreButton = document.getElementById('score');           
const scoreModal = document.getElementById('score-modal');
const gamesPlayedSpan = document.getElementById('games-played');
const totalPointsSpan = document.getElementById('total-points');
const closeScoreButton = document.getElementById('close-score');
let asteroids = [];

let balas = [];

let db = new PouchDB('asteroids_db');

let stats = {
    _id: 'playerStats',
    gamesPlayed: 0,
    totalPoints: 0
};

db.get('playerStats').then(doc => {
    stats = doc;
}).catch(err => {
    if (err.status === 404) {
        db.put(stats);
    }
});

function crearAsteroide() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: 18 + Math.random() * 28,
    vx: (Math.random() - 0.5) * 3,
    vy: (Math.random() - 0.5) * 3,
    angle: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.08,
  };
}
for (let i = 0; i < 8; i++) {
  asteroids.push(crearAsteroide());
}
function dibujarAsteroide(ast) {
  ctx.save();
  ctx.translate(ast.x, ast.y);
  ctx.rotate(ast.angle);

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 3;
  ctx.beginPath();

  const lados = 8;
  const paso = (Math.PI * 2) / lados;

  for (let i = 0; i < lados; i++) {
    const radio = ast.size * (0.75 + Math.sin(i * 2.3) * 0.35);
    const ang = i * paso;

    if (i === 0) {
      ctx.moveTo(Math.cos(ang) * radio, Math.sin(ang) * radio);
    } else {
      ctx.lineTo(Math.cos(ang) * radio, Math.sin(ang) * radio);
    }
  }

  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}
let juegoIniciado = false;

function gameLoop() {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  asteroids.forEach((ast) => {
    ast.x += ast.vx;
    ast.y += ast.vy;
    ast.angle += ast.rotationSpeed;

    if (ast.x < 0) ast.x = canvas.width;
    if (ast.x > canvas.width) ast.x = 0;
    if (ast.y < 0) ast.y = canvas.height;
    if (ast.y > canvas.height) ast.y = 0;

    dibujarAsteroide(ast);
  });
  if (juegoIniciado) {
    
    nave.angle += nave.rotation;

    nave.x += Math.cos(nave.angle) * nave.speed;
    nave.y += Math.sin(nave.angle) * nave.speed;

    if (nave.x < 0) nave.x = canvas.width;
    if (nave.x > canvas.width) nave.x = 0;
    if (nave.y < 0) nave.y = canvas.height;
    if (nave.y > canvas.height) nave.y = 0;

    dibujarNave();

    balas.forEach((bala) => {
      bala.x += Math.cos(bala.angle) * bala.speed;
      bala.y += Math.sin(bala.angle) * bala.speed;

      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(bala.x, bala.y, 2, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  requestAnimationFrame(gameLoop);
}

function dibujarNave() {
  ctx.save();
  ctx.translate(nave.x, nave.y);
  ctx.rotate(nave.angle);

  ctx.strokeStyle = "#00ffff";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(15, 0);
  ctx.lineTo(-10, -10);
  ctx.lineTo(-5, 0);
  ctx.lineTo(-10, 10);
  ctx.closePath();

  ctx.stroke();
  ctx.restore();
}

let nave = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  angle: 0,
  speed: 0,
  rotation: 0
};

gameLoop();
startButton.addEventListener("click", () => {
  menu.style.display = "none";
  juegoIniciado = true;
});

scoreButton.addEventListener('click', () => {
    db.get('playerStats').then(doc => {
        gamesPlayedSpan.textContent = doc.gamesPlayed;
        totalPointsSpan.textContent = doc.totalPoints;
        scoreModal.style.display = 'flex';
    }).catch(() => {
        gamesPlayedSpan.textContent = '0';
        totalPointsSpan.textContent = '0';
        scoreModal.style.display = 'flex';
    });
});
closeScoreButton.addEventListener('click', () => {
    scoreModal.style.display = 'none';
});


document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    nave.rotation = -0.05;
  }
  if (e.key === "ArrowRight") {
    nave.rotation = 0.05;
  }
  if (e.key === "ArrowUp") {
    nave.speed = 2;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
    nave.rotation = 0;
  }
  if (e.key === "ArrowUp") {
    nave.speed = 0;
  }
});

function disparar() {
  balas.push({
    x: nave.x,
    y: nave.y,
    angle: nave.angle,
    speed: 5
  });
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    disparar();
  }
});
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
    ctx.fillStyle = "#00ffff";
    ctx.font = "30px Courier New";
    ctx.textAlign = "center";
    ctx.fillText("JUEGO INICIADO", canvas.width / 2, canvas.height / 2);
  }
  requestAnimationFrame(gameLoop);
}
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

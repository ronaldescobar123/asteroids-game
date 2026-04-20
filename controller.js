import { asteroids, balas, nave, inicializarAsteroides, disparar, db, hayColision, detectarColision, puntosActuales } from "./model.js";
import { limpiarCanvas, dibujarAsteroide, dibujarNave, dibujarBalas } from "./view.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const menu = document.getElementById("menu");
const startButton = document.getElementById("start");
const scoreButton = document.getElementById('score');           
const scoreModal = document.getElementById('score-modal');
const gamesPlayedSpan = document.getElementById('games-played');
const totalPointsSpan = document.getElementById('total-points');
const closeScoreButton = document.getElementById('close-score');

inicializarAsteroides(canvas);

let juegoIniciado = false;

function gameLoop() {
  limpiarCanvas(ctx, canvas);

  asteroids.forEach((ast) => {
    ast.x += ast.vx;
    ast.y += ast.vy;
    ast.angle += ast.rotationSpeed;

    if (ast.x < 0) ast.x = canvas.width;
    if (ast.x > canvas.width) ast.x = 0;
    if (ast.y < 0) ast.y = canvas.height;
    if (ast.y > canvas.height) ast.y = 0;

    dibujarAsteroide(ctx, ast);
  });

  if (juegoIniciado) {
    nave.angle += nave.rotation;

    nave.x += Math.cos(nave.angle) * nave.speed;
    nave.y += Math.sin(nave.angle) * nave.speed;

    if (nave.x < 0) nave.x = canvas.width;
    if (nave.x > canvas.width) nave.x = 0;
    if (nave.y < 0) nave.y = canvas.height;
    if (nave.y > canvas.height) nave.y = 0;

  asteroids.forEach((ast) => {
    const colision = detectarColision(nave, ast, ast.size);

    if (colision) {
      console.log("La nave chocó con un asteroide");
      juegoIniciado = false;
      menu.style.display = "block";
    }
  });

    dibujarNave(ctx, nave);

    balas.forEach((bala, i) => {
      bala.x += Math.cos(bala.angle) * bala.speed;
      bala.y += Math.sin(bala.angle) * bala.speed;

      asteroids.forEach((ast, j) => {
        if (hayColision(bala, ast)){
          asteroids.splice(j, 1); // elimina asteroide
          balas.splice(i, 1);     // elimina bala
          puntosActuales++;
        }
      });
    });

    dibujarBalas(ctx, balas);
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


document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    disparar();
  }
});
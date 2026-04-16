export let asteroids = [];
export let balas = [];

export let nave = {
  x: 400,
  y: 300,
  angle: 0,
  speed: 0,
  rotation: 0
};

export let db = new PouchDB('asteroids_db');

export let stats = {
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

export function crearAsteroide(canvas) {
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

export function inicializarAsteroides(canvas) {
  for (let i = 0; i < 8; i++) {
    asteroids.push(crearAsteroide(canvas));
  }
}

export function disparar() {
  balas.push({
    x: nave.x,
    y: nave.y,
    angle: nave.angle,
    speed: 5
  });
}
export let asteroids = [];
export let balas = [];
export let puntosActuales = 0;
export let nivelDificultad = 1;

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
    totalPoints: 0,
    maxScore: 0,
    lastScore: 0
};

db.get('playerStats').then(doc => {
    // asegurar que existan los campos nuevos
    if (doc.maxScore === undefined) doc.maxScore = 0;
    if (doc.lastScore === undefined) doc.lastScore = 0;

    stats = doc;
    return db.put(doc); // guarda los cambios
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
    vx: (Math.random() - 0.5) * 3 * nivelDificultad,
    vy: (Math.random() - 0.5) * 3 * nivelDificultad,
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

export function hayColision(bala, asteroide) {
  const dx = bala.x - asteroide.x;
  const dy = bala.y - asteroide.y;
  const distancia = Math.sqrt(dx * dx + dy * dy);

  return distancia < asteroide.size;
}

export function detectarColision(obj1, obj2, radio) {
  const dx = obj1.x - obj2.x;
  const dy = obj1.y - obj2.y;

  const distancia = Math.sqrt(dx * dx + dy * dy);

  return distancia < radio;
}

export function sumarPunto() {
  puntosActuales++;
}

export function aumentarDificultad() {
  nivelDificultad += 0.1;
}

export function agregarAsteroide(canvas) {
  asteroids.push(crearAsteroide(canvas));
}
export async function initStats() {
  try {
    const doc = await db.get('playerStats');
    if (doc.maxScore === undefined) doc.maxScore = 0;
    if (doc.lastScore === undefined) doc.lastScore = 0;
    await db.put(doc).catch(() => {});
    return doc;
  } catch (err) {
    if (err.status === 404) {
      const newStats = {
        _id: 'playerStats',
        gamesPlayed: 0,
        totalPoints: 0,
        maxScore: 0,
        lastScore: 0
      };
      await db.put(newStats);
      return newStats;
    }
    throw err;
  }
}
export async function updateStats(score) {
  try {
    const doc = await db.get('playerStats');
    doc.gamesPlayed = (doc.gamesPlayed || 0) + 1;
    doc.totalPoints = (doc.totalPoints || 0) + (score || 0);
    doc.lastScore = score || 0;
    if (!doc.maxScore || (score || 0) > doc.maxScore) doc.maxScore = score || 0;
    await db.put(doc);
    return doc;
  } catch (err) {
    if (err.status === 404) {
      const newStats = {
        _id: 'playerStats',
        gamesPlayed: 1,
        totalPoints: score || 0,
        maxScore: score || 0,
        lastScore: score || 0
      };
      await db.put(newStats);
      return newStats;
    }
    throw err;
  }
}
export async function getStats() {
  try {
    const doc = await db.get('playerStats');
    return doc;
  } catch {
    return { gamesPlayed: 0, totalPoints: 0, maxScore: 0, lastScore: 0 };
  }
}

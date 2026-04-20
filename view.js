export function limpiarCanvas(ctx, canvas) {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

export function dibujarAsteroide(ctx, ast) {
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

export function dibujarNave(ctx, nave) {
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

export function dibujarBalas(ctx, balas) {
  balas.forEach((bala) => {
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(bala.x, bala.y, 2, 0, Math.PI * 2);
    ctx.fill();
  });
}

export function dibujarPuntaje(ctx, puntos) {
  ctx.fillStyle = "#fff";
  ctx.font = "20px Courier New";
  ctx.fillText("PUNTOS: " + puntos, 20, 30);
}
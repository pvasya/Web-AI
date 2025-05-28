export const saveCanvasAsPNG = (canvas) => {
  const tempCanvas = document.createElement("canvas");
  const ctx = tempCanvas.getContext("2d");

  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

  ctx.drawImage(canvas, 0, 0);

  const link = document.createElement("a");
  link.download = "handDrawing.png";
  link.href = tempCanvas.toDataURL("image/png", 1.0);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getCanvasWithWhiteBackground = (canvas) => {
  const tempCanvas = document.createElement("canvas");
  const ctx = tempCanvas.getContext("2d");

  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

  ctx.drawImage(canvas, 0, 0);

  return tempCanvas;
};

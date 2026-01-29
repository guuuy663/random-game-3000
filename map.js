function generateMap() {
  const objects = [];

  // Floor
  objects.push({
    type: "floor",
    x: 0, y: 0, z: 0,
    w: 100, d: 100
  });

  // Walls / cover
  for (let i = 0; i < 25; i++) {
    objects.push({
      type: "box",
      x: Math.random() * 80 - 40,
      y: 1,
      z: Math.random() * 80 - 40,
      w: 2 + Math.random() * 4,
      h: 2 + Math.random() * 3,
      d: 2 + Math.random() * 4
    });
  }

  // Platforms
  for (let i = 0; i < 10; i++) {
    objects.push({
      type: "platform",
      x: Math.random() * 60 - 30,
      y: 3 + Math.random() * 4,
      z: Math.random() * 60 - 30,
      w: 6,
      h: 0.5,
      d: 6
    });
  }

  return objects;
}

module.exports = generateMap;

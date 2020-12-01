/**
 * Desplaza el agua hacia arriba
 * @param {list} l
 * @return {list}
 */
function waterUp(l) {
  const waterObject = first(l);
  return cons({ x: waterObject.x, y: (waterObject.y - 0.003) }, []);
};

/**
 * Desplaza el agua hacia abajo
 * @param {list} l
 * @return {list}
 */
function waterDown(l) {
  const waterObject = first(l);
  return cons({ x: waterObject.x, y: (waterObject.y + 0.003) }, []);
};
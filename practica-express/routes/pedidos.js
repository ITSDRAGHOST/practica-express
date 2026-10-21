import { Router } from 'express';

const router = Router();

// Ejemplo ya resuelto
router.get('/total/:cantidad/:precio', (req, res) => {
  const cantidad = Number(req.params.cantidad);
  const precio = Number(req.params.precio);

  if (isNaN(cantidad) || isNaN(precio)) {
    return res.status(400).json({ error: 'Cantidad y precio deben ser números' });
  }

  const subtotal = cantidad * precio;
  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  res.json({ subtotal, iva, total });
});

// Ejercicio 1: descuento
const DESCUENTOS = { VERANO10: 0.10, MITAD: 0.50 };

router.get('/descuento/:compra/:codigo', (req, res) => {
  const compra = Number(req.params.compra);
  const codigo = req.params.codigo;

  if (isNaN(compra)) {
    return res.status(400).json({ error: 'La compra debe ser un número' });
  }
  if (!Object.hasOwn(DESCUENTOS, codigo)) {
    return res.status(400).json({ error: 'Código inválido' });
  }

  let montoFinal = compra - compra * DESCUENTOS[codigo];
  if (montoFinal > 1000) {
    montoFinal = montoFinal * 0.95; // 5% adicional
  }
  const descuentoAplicado = compra - montoFinal;

  const resultado = { codigo, descuentoAplicado, montoFinal };
  res.json({
    ...resultado,
    resultadoCodificado: btoa(JSON.stringify(resultado))
  });
});

// Ejercicio 2: promedio con Promesa
function calcularPromedio(calificaciones) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(calificaciones) || calificaciones.length < 3) {
      return reject(new Error('calificaciones debe ser un arreglo con al menos 3 elementos'));
    }
    if (!calificaciones.every((c) => typeof c === 'number' && !isNaN(c))) {
      return reject(new Error('Todas las calificaciones deben ser números'));
    }

    const promedio = calificaciones.reduce((a, c) => a + c, 0) / calificaciones.length;

    let nivel;
    if (promedio >= 8) nivel = 'excelente';
    else if (promedio >= 6) nivel = 'aceptable';
    else nivel = 'reprobado';

    resolve({ promedio: Math.round(promedio * 100) / 100, nivel });
  });
}

router.post('/promedio', (req, res) => {
  calcularPromedio(req.body?.calificaciones)
    .then((resultado) => res.json(resultado))
    .catch((err) => res.status(400).json({ error: err.message }));
});

export default router;
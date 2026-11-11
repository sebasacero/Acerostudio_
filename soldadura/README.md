# Simulador de soldadura

Página estática (`/soldadura/`), sin dependencias: canvas 2D, Pointer Events y Web Audio.

- `js/motor.js`: juntas (tope 1G, filete 2F, traslape, tubo sobre placa), procesos (E6013, E7018, MIG), modelo del cordón y evaluación. Sin DOM: `node soldadura/test.mjs`.
- `js/dibujo.js`: placas y cordón realistas (ondas, revenido, salpicadura, escoria), arco, chispas, humo, corte transversal y gráfica de ritmo.
- `js/app.js`: entrada, careta, lente del charco, piqueta, sonido, informe e historial (localStorage).

## Entrada

| | Dedo (hoy) | Apple Pencil |
|---|---|---|
| Recorrido y desvío | sí | sí |
| Velocidad de avance | sí | sí |
| Largo de arco / distancia de boquilla | fijo en el ideal | presión (≈0,4 es lo ideal; apretar pega el electrodo) |
| Ángulo de avance y de trabajo | no se califica | `tiltX/tiltY` o `altitudeAngle/azimuthAngle` |
| Mano apoyada | — | se ignora cuando hay lápiz (rechazo de palma) |
| Puntería sin tocar | — | hover del lápiz (iPad con M2 o posterior) |

Con el dedo, el punto de arco va 46 px arriba de la yema para que se vea el charco (se puede apagar).
El modelo es de práctica: sigue criterios de inspección visual, no certifica.

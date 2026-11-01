---
sourceHash: 1173114afcad
title: "Trillium"
description: Qué es Trillium, en qué se diferencia de otros lenguajes de contratos inteligentes, dónde está su código fuente y el Trillium Web IDE (tIDE).
sidebar:
  order: 1
---

## ¿Qué es Trillium?

Trillium es un lenguaje Turing completo y orientado a objetos para desplegar y ejecutar los contratos inteligentes de la red VFX. Los contratos inteligentes de Trillium se ejecutan en SEN (Self-Executing Nodes) y son los programas que se escriben para crear y administrar NFTs en la red VFX.

Trillium es un lenguaje de llaves, pero también puede ejecutarse como función de scripting y está diseñado para no necesitar ninguna máquina virtual ni clúster para ejecutarse. Está influenciado por C#, JavaScript y Minsk.

Con Trillium, un desarrollador puede crear contratos inteligentes basados en NFTs para usos como la aplicación de regalías, necesidades de evolución, colecciones multiarchivo, artículos soulbound y muchos otros usos prácticos, ya que es totalmente agnóstico respecto al caso de uso. 

### Ejemplo de sintaxis de Trillium
```js
function helloWorld(name : string) : string
{
    var result = "Hello " + name
    return result
}

helloWorld("Trillium")
```
> Salida: `Hello Trillium`

:::note[Bucles y recursión en la cadena]
El lenguaje tiene bucles `while`, `for` y `do-while`, y el IDE los ejecuta. El cuerpo de un contrato que ejecuta un nodo no puede usarlos: VerifiedX Core analiza cada contrato con los bucles y la recursión prohibidos, así que un cuerpo con un bucle `while` o `for` o con un ciclo de llamadas nunca se ejecuta, y los cuerpos nuevos con `do-while` se rechazan.
:::

## ¿En qué se diferencia Trillium de otros lenguajes de contratos inteligentes?

La primera diferencia es que es un lenguaje que no se tomó de ninguna estructura de blockchain existente. Trillium se creó a partir de múltiples recursos y pensando específicamente en los NFTs. Se diseñó para ser liviano y fácil de ejecutar en una variedad de plataformas y aplicaciones.

La segunda gran diferencia es que los contratos inteligentes de VFX no requieren ninguna máquina virtual. Se ejecutan en Self-Executing Nodes (SEN). Estos contratos pueden funcionar de forma dinámica cuando se les llama y pueden modificar el estado que devuelven sin necesidad de hacer llamadas externas ni crear una transacción costosa.

Otra diferencia clave es que, con este lenguaje, un NFT de VFX es el contrato inteligente, y no un producto generado por un contrato inteligente.

Trillium no tiene gas ni medición de la ejecución. Cada transacción de contrato inteligente (despliegue, emisión, transferencia, quema, evolución, venta) sigue pagando la comisión normal de la red VFX según su tamaño, que se quema.

## ¿Trillium es de código abierto?

¡Por supuesto! Trillium, al igual que la red VFX, está escrito en C# sobre .NET 6, y su código fuente está en el GitHub de VerifiedX. Los nodos ejecutan el runtime de Trillium integrado en VerifiedX Core.
> <a href="https://github.com/VerifiedXBlockchain/VerifiedX-Trillium">Visita Trillium en GitHub</a>.

Trillium también tiene un IDE de escritorio y uno web que cualquiera puede usar para probar y desplegar contratos con el lenguaje. 

## tIDE

El Trillium Web IDE (tIDE) es una aplicación web de código abierto para que la comunidad de VerifiedX interactúe y desarrolle. Trillium ofrece compilación y ejecución de código en tiempo de ejecución rápidas, con una interfaz gráfica sencilla e intuitiva. El tIDE sirve para todo el proceso de desarrollo de contratos y también como un entorno intuitivo para aprender Trillium.

Trillium se diseñó pensando específicamente en los NFTs y es un lenguaje Turing completo. Trillium es el lenguaje de contratos inteligentes que impulsa el proyecto VerifiedX. Abarca muchos otros proyectos, como VFX Core, VFX GUI, Trillium, VFX Explorer y, por supuesto, el Trillium IDE. 

> <a href="https://trillium.verifiedx.io">Abre Trillium IDE</a>.

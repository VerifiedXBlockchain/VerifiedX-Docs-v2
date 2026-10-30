---
sourceHash: 69a817cd95ce
title: "Trillium"
description: Qué es Trillium, en qué se diferencia de otros lenguajes de contratos inteligentes, dónde está su código fuente y el Trillium Web IDE (tIDE).
sidebar:
  order: 1
---

## ¿Qué es Trillium?

Trillium es un lenguaje Turing completo y orientado a objetos para desplegar y ejecutar los contratos inteligentes de la red VFX. Los contratos inteligentes de Trillium, también llamados SEN (Self-Executing NFTs), son los programas que se escriben para crear y administrar NFTs en la red VFX.

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

## ¿En qué se diferencia Trillium de otros lenguajes de contratos inteligentes?

La primera diferencia es que es un lenguaje que no se tomó de ninguna estructura de blockchain existente. Trillium se creó a partir de múltiples recursos y pensando específicamente en los NFTs. Se diseñó para ser liviano y fácil de ejecutar en una variedad de plataformas y aplicaciones.

La segunda gran diferencia es que los contratos inteligentes de VFX no requieren ninguna máquina virtual. Se llaman Self-Executing NFTs (SEN). Estos contratos pueden funcionar de forma dinámica cuando se les llama y pueden modificar el estado que devuelven sin necesidad de hacer llamadas externas ni crear una transacción costosa.

Otra diferencia clave es que, con este lenguaje, los NFTs de VFX SON el contrato inteligente, y no un producto generado por un contrato inteligente. 

## ¿Trillium es de código abierto?

¡Por supuesto! Trillium, al igual que la red VFX, se escribió en C#, .net 6, y está en el GitHub de VFX. 
> <a href="https://github.com/ReserveBlockIO/Trillium">Visita Trillium en GitHub</a>.

Trillium también tiene un IDE de escritorio y uno web que cualquiera puede usar para probar y desplegar contratos con el lenguaje. 

## tIDE

El Trillium Web IDE (tIDE) es una aplicación web de código abierto para que la comunidad de VerifiedX interactúe y desarrolle. Trillium ofrece compilación y ejecución de código en tiempo de ejecución rápidas, con una interfaz gráfica sencilla e intuitiva. El tIDE sirve para todo el proceso de desarrollo de contratos y también como un entorno intuitivo para aprender Trillium.

Trillium se diseñó pensando específicamente en los NFTs y es un lenguaje Turing completo. Trillium IDE es la fuerza impulsora del lenguaje de contratos inteligentes del proyecto VerifiedX. Abarca muchos otros proyectos, como VFX Core, VFX GUI, Trillium, VFX Explorer y, por supuesto, Trillium-IDE. 

> <a href="https://trillium.VFX.network">Abre Trillium IDE</a>.

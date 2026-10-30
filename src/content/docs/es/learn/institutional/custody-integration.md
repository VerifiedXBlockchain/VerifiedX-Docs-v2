---
sourceHash: 0fc8b3b6d8d5
title: "Integración con custodios"
description: Cómo los custodios institucionales, los bancos de activos digitales y los proveedores de infraestructura se integran con VerifiedX para admitir vBTC.
sidebar:
  order: 2
---

**Infraestructura de Bitcoin segura y verificable para socios institucionales**

VerifiedX ofrece un marco de integración con custodios que permite a las instituciones admitir de forma segura Bitcoin nativo y no sintético (vBTC), manteniendo el control total, la auditabilidad y el cumplimiento.

El sistema está diseñado para integrarse con proveedores de custodia institucional, bancos de activos digitales y plataformas de infraestructura, lo que permite que Bitcoin se vuelva totalmente programable sin introducir riesgo sintético ni comprometer la propiedad.

Esto no es un envoltorio.
Esto es infraestructura de Bitcoin verificable.

---

## Modelo de integración

La integración con custodios de VerifiedX funciona mediante un sistema coordinado de:

- Firma por umbral FROST, en la que la clave de cada bóveda (vault) se guarda solo en partes
- Consenso que conoce Bitcoin y verifica cada depósito y gasto de las bóvedas
- Flujos de depósito y redención deterministas, con retiros fijados por consenso
- Mecánicas de emisión y quema de vBTC 1:1

Los custodios mantienen el control del Bitcoin subyacente, mientras que VerifiedX habilita la utilidad programable on-chain.

---

## Capacidades principales

### Soporte nativo de Bitcoin

- Integración directa con los sistemas de custodia de Bitcoin
- Sin envolver en activos sintéticos ni pagarés
- Respaldo estricto 1:1 de los activos en todo momento
- Seguimiento transparente y verificable de las reservas

### Emisión y redención deterministas

- Depósito de Bitcoin → verificado por consenso y enterrado 6 bloques → vBTC acreditado
- Solicitud de retiro de vBTC → transacción de Bitcoin fijada por consenso → liberación del Bitcoin
- Ciclo de vida totalmente auditable para cada movimiento de activos
- Sin procesos discrecionales ni opacos

### Prueba de reservas y de movimientos

- Cada depósito y gasto de las bóvedas registrado por el consenso a partir de la propia prueba de trabajo de Bitcoin y de las pruebas Merkle
- Verificación independiente de las reservas y los flujos
- Visibilidad en tiempo real de la integridad del sistema
- Garantías criptográficas en todas las transacciones

### Preservación de la autocustodia

- Los usuarios finales y las instituciones conservan la propiedad de los activos
- Los custodios actúan como proveedores de infraestructura segura, no como intermediarios de los activos
- No se introduce riesgo de rehipotecación ni de balance

### Arquitectura lista para el cumplimiento

- Integración con sistemas de AML y de monitoreo de transacciones
- Capacidades de revisión de direcciones y de aplicación de políticas
- Soporte para los requisitos de cumplimiento de cada jurisdicción
- Registro de auditoría completo de toda la actividad de custodia y liquidación

---

## Vías de integración

VerifiedX admite varios modelos de integración institucional:

### Integración con custodios

- Conexión directa con la infraestructura de custodia
- Participación en los flujos de depósito y redención
- Soporte para cuentas de clientes institucionales

### Bancos de activos digitales

- Gestión de tesorería y servicios sobre los activos
- Habilitación de vBTC de cara a los clientes
- Participación en programas de rendimiento y liquidez

### Proveedores de infraestructura

- Integración basada en API para la orquestación de la custodia
- Participación como validador (validator) o proveedor de servicios
- Soporte integrado dentro de las plataformas institucionales

### Firma operada por la institución

- Opera tres o más validadores propios y restringe a ellos la ceremonia de claves y la firma de una bóveda (S3C)
- El conjunto público de validadores nunca tiene una parte de las claves de esas bóvedas
- Consulta [Firma institucional (S3C)](/es/learn/institutional/s3c-signing/)

---

## Modelo de seguridad

- Firma por umbral FROST con generación distribuida de claves; opcionalmente restringida a validadores operados por la institución (S3C)
- Depósitos y gastos de Bitcoin verificados en la capa de consenso
- Cobertura de auditoría en varias capas, tanto de custodia como de protocolo
- Validación y ejecución deterministas de las transacciones
- Umbrales de consenso de los validadores para las operaciones críticas

---

## Beneficios institucionales

- Habilita la programabilidad de Bitcoin sin exposición sintética
- Mantén el control total de la custodia y la supervisión operativa
- Ofrece nuevas fuentes de ingresos mediante servicios de rendimiento y liquidez
- Brinda a tus clientes capacidades financieras transparentes y on-chain
- Intégrate sin fricciones en los marcos de custodia y cumplimiento existentes

---

La integración con custodios de VerifiedX permite a las instituciones llevar Bitcoin del almacenamiento pasivo a la infraestructura financiera activa, de forma segura, transparente y sin concesiones.

La custodia ya no es solo almacenamiento. Con VerifiedX, se convierte en la base de las finanzas programables con Bitcoin.

---
sourceHash: 1882a3e08353
title: "Web API: Master Node"
description: "Endpoints de la API del explorador para validadores (nodos maestros): detalles, búsqueda por nombre y datos del mapa."
sidebar:
  label: "Master Node"
  order: 10
---

Los validadores (validators), o nodos maestros (master nodes), tal como los registra el explorador: dirección, nombre, indicador de actividad, hora de conexión, geolocalización y bloques producidos.

## URL base
```
/api/masternodes/
```

## Endpoints

### Listar nodos maestros
```http
GET /api/masternodes/
```

Devuelve una lista paginada de todas las direcciones de validador que el explorador ha registrado. Filtra con `is_active=true` para obtener el conjunto actual de validadores.

**Parámetros de consulta:**
- `is_active`: `true` o `false`
- `search`: coincidencia por dirección o nombre; en ese caso los resultados usan la forma completa del registro (consulta los detalles más abajo)
- `ordering`: un campo de la respuesta, con el prefijo `-` para orden descendente (por ejemplo `-date_connected`)
- `compact`: cualquier valor; en ese caso cada resultado solo tiene `address`, `name`, `is_active` y `location_name` (ciudad, región y país unidos con comas, o `-`)
- `page`, `limit`: número de página y tamaño de página; el tamaño de página predeterminado y máximo es 15000

**Respuesta:**
```json
{
  "count": 19673,
  "page": 1,
  "num_pages": 2,
  "results": [
    {
      "address": "RNLsAwj8pn6EXbHv1LYokuFGHXTVnxcwfr",
      "name": "Merkle Science 1",
      "is_active": true,
      "date_connected": "2026-08-31T11:01:23.701409Z",
      "city": "Boardman",
      "country": "United States",
      "latitude": 45.8401,
      "longitude": -119.705
    }
  ]
}
```

### Obtener los detalles de un nodo maestro
```http
GET /api/masternodes/{address}/
```

**Parámetros:**
- `address` (string): la dirección de VFX del validador

**Respuesta:**
```json
{
  "address": "RNLsAwj8pn6EXbHv1LYokuFGHXTVnxcwfr",
  "name": "Merkle Science 1",
  "is_active": true,
  "date_connected": "2026-08-31T11:01:23.701409Z",
  "city": "Boardman",
  "country": "United States",
  "latitude": 45.8401,
  "longitude": -119.705,
  "block_count": 24250,
  "unique_name": "Merkle Science 1",
  "connect_date": "2026-08-31T11:01:23.701409Z"
}
```

### Obtener un nodo maestro por nombre
```http
GET /api/masternodes/name/{name}/
```

La respuesta tiene la misma forma que la del endpoint de detalles. Codifica en la URL los nombres que contengan espacios.

### Datos del mapa
```http
GET /api/masternodes/map/
```

Se pagina como la lista, con los mismos parámetros de consulta. Cada resultado incluye solo las coordenadas y la dirección:

```json
{
  "count": 19673,
  "page": 1,
  "num_pages": 2,
  "results": [
    {
      "latitude": 45.8401,
      "longitude": -119.705,
      "address": "RNLsAwj8pn6EXbHv1LYokuFGHXTVnxcwfr"
    }
  ]
}
```

## Descripción de los campos

- `address`: la dirección de VFX del validador
- `name`, `unique_name`: el nombre del validador elegido al activarlo (único en la red); `unique_name` repite `name`
- `is_active`: si el nodo forma parte del conjunto actual de validadores activos
- `date_connected`, `connect_date`: la última vez que se registró la conexión del nodo; `connect_date` repite `date_connected`
- `city`, `country`, `latitude`, `longitude`: geolocalización obtenida a partir de la dirección IP del nodo; puede ser null o `0.0` cuando se desconoce
- `block_count`: bloques que ha producido este validador (solo en las consultas de detalles y por nombre)

## Notas

- `count` en la lista sin filtrar incluye todas las direcciones de validador registradas alguna vez; `is_active=true` da el conjunto actual.
- No hay campos de tiempo en línea, versión, rendimiento, recompensas ni puerto, y las direcciones IP no se exponen. La Prueba de Garantía (Proof of Assurance) no paga recompensas de bloque.
- `POST /api/masternodes/send/` es un endpoint interno de ingesta que usa la propia infraestructura de nodos del explorador; no forma parte de la API pública y no aparece en Swagger.

---
sourceHash: 9d35a4c7bb04
title: "Web API: Media"
description: Endpoints de la API del explorador para subir recursos multimedia y asociarlos con NFTs y contratos inteligentes.
sidebar:
  label: "Media"
  order: 11
---

La API de Media ofrece endpoints para subir y gestionar recursos multimedia asociados a NFTs y contratos inteligentes en la blockchain de VFX.

## URL base
```
/api/media/
```

## Endpoints

### Subir un recurso multimedia
```http
POST /api/media/
```

Sube un archivo multimedia y devuelve los metadatos y las URL asociados.

**Solicitud (multipart/form-data):**
- `file`: el archivo multimedia que se sube (imagen, video, audio, etc.)
- `title` (opcional): título del recurso multimedia
- `description` (opcional): descripción del recurso multimedia
- `tags` (opcional): etiquetas separadas por comas para categorizarlo

**Respuesta:**
```json
{
  "success": true,
  "asset_id": "asset_123...",
  "file_name": "artwork.png",
  "file_size": 1048576,
  "content_type": "image/png",
  "urls": {
    "original": "https://media.vfx.io/assets/original/asset_123.png",
    "thumbnail": "https://media.vfx.io/assets/thumb/asset_123_thumb.png",
    "preview": "https://media.vfx.io/assets/preview/asset_123_preview.png"
  },
  "metadata": {
    "width": 1920,
    "height": 1080,
    "format": "PNG",
    "color_space": "sRGB"
  },
  "upload_date": "2024-01-01T12:00:00Z",
  "ipfs_hash": "QmX5Y8Z9...",
  "checksum": "sha256:abc123..."
}
```

### Asociar multimedia con un contrato inteligente
```http
POST /api/media/associate-media/{sc_id}/
```

Asocia los recursos multimedia subidos con un contrato inteligente específico (normalmente NFTs).

**Parámetros:**
- `sc_id` (string): identificador del contrato inteligente

**Solicitud:**
```json
{
  "asset_ids": ["asset_123...", "asset_456..."],
  "primary_asset": "asset_123...",
  "metadata": {
    "title": "Digital Artwork Collection",
    "description": "A beautiful collection of digital art pieces",
    "attributes": [
      {
        "trait_type": "Background",
        "value": "Blue"
      },
      {
        "trait_type": "Style",
        "value": "Abstract"
      }
    ]
  }
}
```

**Respuesta:**
```json
{
  "success": true,
  "smart_contract_id": "SC123...",
  "associated_assets": [
    {
      "asset_id": "asset_123...",
      "type": "primary",
      "url": "https://media.vfx.io/assets/original/asset_123.png",
      "thumbnail": "https://media.vfx.io/assets/thumb/asset_123_thumb.png"
    },
    {
      "asset_id": "asset_456...",
      "type": "additional",
      "url": "https://media.vfx.io/assets/original/asset_456.png",
      "thumbnail": "https://media.vfx.io/assets/thumb/asset_456_thumb.png"
    }
  ],
  "metadata_updated": true,
  "ipfs_metadata_hash": "QmMetadata123..."
}
```

## Tipos de archivo compatibles

### Imágenes
- **PNG**: recomendado para obras con transparencia
- **JPEG/JPG**: adecuado para fotografías e imágenes complejas
- **GIF**: admite animación
- **WEBP**: formato moderno con buena compresión
- **SVG**: gráficos vectoriales (con restricciones)

### Videos
- **MP4**: se recomienda el códec H.264/H.265
- **WEBM**: códec VP8/VP9
- **MOV**: formato QuickTime

### Audio
- **MP3**: formato de audio estándar
- **WAV**: audio sin comprimir
- **OGG**: formato de audio de código abierto

### Documentos
- **PDF**: formato de documento para whitepapers, etc.

## Descripción de los campos

### Respuesta de la subida
- `asset_id`: identificador único del recurso subido
- `file_name`: nombre original del archivo
- `file_size`: tamaño del archivo en bytes
- `content_type`: tipo MIME del archivo
- `urls`: versiones del recurso en distintos tamaños
- `metadata`: metadatos técnicos extraídos del archivo
- `ipfs_hash`: hash de IPFS para el almacenamiento descentralizado
- `checksum`: hash SHA-256 para verificar la integridad

### Respuesta de la asociación
- `smart_contract_id`: el identificador del contrato inteligente asociado
- `associated_assets`: lista de los recursos ahora vinculados al contrato inteligente
- `type`: tipo de recurso (primary, additional, thumbnail, etc.)
- `metadata_updated`: si se actualizaron los metadatos del NFT
- `ipfs_metadata_hash`: hash de IPFS de los metadatos completos

## Límites de tamaño de archivo

- **Imágenes**: máximo 50 MB
- **Videos**: máximo 500 MB
- **Audio**: máximo 100 MB
- **Documentos**: máximo 25 MB

## Funciones de procesamiento

### Generación automática
- **Miniaturas**: miniaturas cuadradas de 150x150 px
- **Vistas previas**: vistas previas de 800x600 px como máximo
- **Subida a IPFS**: almacenamiento descentralizado automático

### Extracción de metadatos
- Dimensiones de la imagen y perfiles de color
- Duración del video e información del códec
- Tasa de bits y duración del audio
- Datos EXIF (con filtrado por privacidad)

## Notas

- Todos los archivos subidos se respaldan automáticamente en IPFS
- Los recursos multimedia son inmutables una vez asociados a contratos inteligentes
- Las miniaturas y vistas previas se generan automáticamente para los formatos compatibles
- Los recursos subidos pueden estar sujetos a moderación de contenido
- Los archivos grandes pueden tardar en procesarse y en generar vistas previas
- Los hashes de IPFS garantizan un acceso permanente y descentralizado a los archivos multimedia

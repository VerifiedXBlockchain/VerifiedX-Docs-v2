---
sourceHash: fd469eeb26ff
title: "Web API: Media"
description: Endpoints de la API del explorador para subir recursos multimedia y asociarlos con NFTs y contratos inteligentes.
sidebar:
  label: "Media"
  order: 11
---

La API de Media sube archivos multimedia para NFTs y contratos inteligentes y registra qué archivos pertenecen a un contrato inteligente. Los archivos se guardan en el bucket público de recursos del explorador: `https://rbx-nft-web-assets.s3.amazonaws.com/` en mainnet y `https://rbx-nft-web-assets-testnet.s3.amazonaws.com/` en testnet.

## URL base
```
/api/media/
```

## Endpoints

### Subir un recurso multimedia
```http
POST /api/media/
```

Sube un archivo y devuelve su URL pública. El archivo se guarda en una carpeta aleatoria de 32 caracteres con su nombre de archivo original.

**Solicitud (multipart/form-data):**
- `file`: el archivo multimedia que se sube (máximo 150 MiB)

**Ejemplo:**
```bash
curl -X POST https://data-testnet.verifiedx.io/api/media/ -F "file=@artwork.png"
```

**Respuesta:**
```json
{
  "url": "https://rbx-nft-web-assets.s3.amazonaws.com/jFhps372uEHEFHHSuYhWCI4c5LNUSxmf/artwork.png"
}
```

Una solicitud sin archivo responde `400` con `{"detail": "No file in request."}`; un archivo más grande responde `400` con `File exceeds max size: …`.

### Asociar multimedia con un contrato inteligente
```http
POST /api/media/associate-media/{sc_id}/
```

Establece las URL de los recursos de un contrato inteligente de NFT. El mapa reemplaza los `asset_urls` existentes del contrato.

**Parámetros:**
- `sc_id` (string): identificador del contrato inteligente

**Solicitud:**
```json
{
  "media_map": {
    "artwork.png": "https://rbx-nft-web-assets.s3.amazonaws.com/jFhps372uEHEFHHSuYhWCI4c5LNUSxmf/artwork.png"
  }
}
```

**Respuesta:** el NFT actualizado, en el formato descrito en la página [NFT](/es/build/web-api/nft/). Un `sc_id` desconocido responde `400` con `{"detail": "Smart contract with identifier of … not found"}`.

## Descripción de los campos

- `url`: URL pública del archivo subido
- `media_map`: mapa de nombre de archivo a URL del archivo; se convierte en los `asset_urls` del NFT

## Notas

- El explorador guarda cualquier tipo de archivo; no convierte archivos, no genera miniaturas ni vistas previas, no extrae metadatos ni fija archivos en IPFS
- Los archivos subidos son de lectura pública
- Los archivos de recursos que un NFT lleva on-chain los define su contrato inteligente; `asset_urls` es la copia del explorador para mostrarlos

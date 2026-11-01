---
title: "Web API: Media"
description: Explorer API endpoints for uploading media assets and associating them with NFTs and smart contracts.
sidebar:
  label: "Media"
  order: 11
---

The Media API uploads media files for NFTs and smart contracts and records which files belong to a smart contract. Files are stored in the explorer's public asset bucket: `https://rbx-nft-web-assets.s3.amazonaws.com/` on mainnet and `https://rbx-nft-web-assets-testnet.s3.amazonaws.com/` on testnet.

## Base URL
```
/api/media/
```

## Endpoints

### Upload Media Asset
```http
POST /api/media/
```

Uploads one file and returns its public URL. The file is stored under a random 32-character folder with its original file name.

**Request (multipart/form-data):**
- `file`: The media file to upload (maximum 150 MiB)

**Example:**
```bash
curl -X POST https://data-testnet.verifiedx.io/api/media/ -F "file=@artwork.png"
```

**Response:**
```json
{
  "url": "https://rbx-nft-web-assets.s3.amazonaws.com/jFhps372uEHEFHHSuYhWCI4c5LNUSxmf/artwork.png"
}
```

A request without a file answers `400` with `{"detail": "No file in request."}`; a larger file answers `400` with `File exceeds max size: …`.

### Associate Media with Smart Contract
```http
POST /api/media/associate-media/{sc_id}/
```

Sets the asset URLs of an NFT smart contract. The map replaces the contract's existing `asset_urls`.

**Parameters:**
- `sc_id` (string): Smart contract identifier

**Request:**
```json
{
  "media_map": {
    "artwork.png": "https://rbx-nft-web-assets.s3.amazonaws.com/jFhps372uEHEFHHSuYhWCI4c5LNUSxmf/artwork.png"
  }
}
```

**Response:** the updated NFT, in the format described on the [NFT](/build/web-api/nft/) page. An unknown `sc_id` answers `400` with `{"detail": "Smart contract with identifier of … not found"}`.

## Field Descriptions

- `url`: Public URL of the uploaded file
- `media_map`: Map of file name to file URL; it becomes the NFT's `asset_urls`

## Notes

- The explorer stores any file type; it does not convert files, generate thumbnails or previews, extract metadata, or pin files to IPFS
- Uploaded files are publicly readable
- The asset files an NFT carries on chain are defined by its smart contract; `asset_urls` is the explorer's copy for display

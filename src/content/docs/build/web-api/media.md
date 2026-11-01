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

A request without a file answers `400` with `{"detail": "No file in request."}`; a larger file answers `400` with `File exceeds max size: …`. A server without upload storage configured answers `503` with `{"message": "Asset uploads are not configured on this server."}`.

### Associate Media with Smart Contract
```http
POST /api/media/associate-media/{sc_id}/
```

Sets the asset URLs of an NFT smart contract. The map replaces the contract's existing `asset_urls`.

An NFT that has no asset URLs yet takes its first set without a token. Once it has asset URLs, only its owner can replace them: the request needs a token from `POST /api/auth/sign-token/` for the NFT's owner address (see [Shop authentication](/build/web-api/shop/#authentication)), sent as `Authorization: basic <token>`. The explorer records when the URLs were last set and, for an authenticated request, by which address.

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

**Response:** the updated NFT, in the format described on the [NFT](/build/web-api/nft/) page.

**Status Codes:**
- `200 OK`: Asset URLs set
- `400 Bad Request`: An unknown `sc_id` (`{"detail": "Smart contract with identifier of … not found"}`), an empty `media_map`, or a URL that does not start with the asset bucket origin above (`{"message": "Asset URLs must start with …", "assets": [<file names>]}`)
- `401 Unauthorized`: The NFT already has asset URLs and the request has no valid token for its owner; `{"message": "Not authenticated"}`
- `503 Service Unavailable`: The server has no asset bucket configured

## Field Descriptions

- `url`: Public URL of the uploaded file
- `media_map`: Map of file name to file URL; it becomes the NFT's `asset_urls`. Every URL must start with the network's asset bucket origin, as returned by Upload Media Asset.

## Notes

- The explorer stores any file type; it does not convert files, generate thumbnails or previews, extract metadata, or pin files to IPFS
- Uploaded files are publicly readable
- The asset files an NFT carries on chain are defined by its smart contract; `asset_urls` is the explorer's copy for display

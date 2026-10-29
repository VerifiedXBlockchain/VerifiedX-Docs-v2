---
title: "Web API: Media"
description: Explorer API endpoints for uploading media assets and associating them with NFTs and smart contracts.
sidebar:
  label: "Media"
  order: 11
---

The Media API provides endpoints for uploading and managing media assets associated with NFTs and smart contracts on the VFX blockchain.

## Base URL
```
/api/media/
```

## Endpoints

### Upload Media Asset
```http
POST /api/media/
```

Uploads a media file and returns the associated metadata and URLs.

**Request (multipart/form-data):**
- `file`: The media file to upload (image, video, audio, etc.)
- `title` (optional): Title for the media asset
- `description` (optional): Description of the media asset
- `tags` (optional): Comma-separated tags for categorization

**Response:**
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

### Associate Media with Smart Contract
```http
POST /api/media/associate-media/{sc_id}/
```

Associates uploaded media assets with a specific smart contract (typically NFTs).

**Parameters:**
- `sc_id` (string): Smart contract identifier

**Request:**
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

**Response:**
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

## Supported File Types

### Images
- **PNG**: Recommended for artwork with transparency
- **JPEG/JPG**: Good for photographs and complex images
- **GIF**: Supports animation
- **WEBP**: Modern format with good compression
- **SVG**: Vector graphics (with restrictions)

### Videos
- **MP4**: H.264/H.265 codec recommended
- **WEBM**: VP8/VP9 codec
- **MOV**: QuickTime format

### Audio
- **MP3**: Standard audio format
- **WAV**: Uncompressed audio
- **OGG**: Open source audio format

### Documents
- **PDF**: Document format for whitepapers, etc.

## Field Descriptions

### Upload Response
- `asset_id`: Unique identifier for the uploaded asset
- `file_name`: Original filename
- `file_size`: File size in bytes
- `content_type`: MIME type of the file
- `urls`: Various sized versions of the asset
- `metadata`: Technical metadata extracted from the file
- `ipfs_hash`: IPFS hash for decentralized storage
- `checksum`: SHA-256 hash for integrity verification

### Association Response
- `smart_contract_id`: The associated smart contract identifier
- `associated_assets`: List of assets now linked to the smart contract
- `type`: Asset type (primary, additional, thumbnail, etc.)
- `metadata_updated`: Whether NFT metadata was updated
- `ipfs_metadata_hash`: IPFS hash of the complete metadata

## File Size Limits

- **Images**: Maximum 50 MB
- **Videos**: Maximum 500 MB
- **Audio**: Maximum 100 MB
- **Documents**: Maximum 25 MB

## Processing Features

### Automatic Generation
- **Thumbnails**: 150x150px square thumbnails
- **Previews**: 800x600px maximum previews
- **IPFS Upload**: Automatic decentralized storage

### Metadata Extraction
- Image dimensions and color profiles
- Video duration and codec information
- Audio bitrate and duration
- EXIF data (with privacy filtering)

## Notes

- All uploaded files are automatically backed up to IPFS
- Media assets are immutable once associated with smart contracts
- Thumbnails and previews are generated automatically for supported formats
- Content moderation may apply to uploaded assets
- Large files may take time to process and generate previews
- IPFS hashes ensure permanent, decentralized access to media

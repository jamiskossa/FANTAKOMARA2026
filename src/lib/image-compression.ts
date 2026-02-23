/**
 * Compression automatique d'image pour upload ordonnance
 * Réduit taille : 5-8MB → ~500KB
 * Améliore vitesse et réduit coût stockage
 */

export async function compressImage(
  file: File,
  options?: {
    maxSizeMB?: number;
    maxWidthOrHeight?: number;
  }
): Promise<File> {
  const { maxSizeMB = 1, maxWidthOrHeight = 1600 } = options || {};

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Redimensionner si trop grand
        if (width > height) {
          if (width > maxWidthOrHeight) {
            height = Math.round((height * maxWidthOrHeight) / width);
            width = maxWidthOrHeight;
          }
        } else {
          if (height > maxWidthOrHeight) {
            width = Math.round((width * maxWidthOrHeight) / height);
            height = maxWidthOrHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context error'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Compression progressive JPEG
        let quality = 0.9;
        let compressedBlob: Blob | null = null;

        const tryCompress = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Blob creation failed'));
                return;
              }

              const sizeMB = blob.size / (1024 * 1024);

              if (sizeMB > maxSizeMB && quality > 0.1) {
                quality -= 0.1;
                tryCompress();
              } else {
                compressedBlob = blob;
                const compressedFile = new File(
                  [compressedBlob],
                  file.name,
                  { type: 'image/jpeg' }
                );
                resolve(compressedFile);
              }
            },
            'image/jpeg',
            quality
          );
        };

        tryCompress();
      };

      img.onerror = () => reject(new Error('Image load error'));
      img.src = event.target?.result as string;
    };

    reader.onerror = () => reject(new Error('File read error'));
    reader.readAsDataURL(file);
  });
}

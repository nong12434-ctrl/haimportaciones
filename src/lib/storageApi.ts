import { supabase, supabaseConfigured } from './supabase';

export const IMAGE_BUCKET = 'imagenes';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB antes de redimensionar
const MAX_SIDE = 1600; // px del lado mayor tras redimensionar
const JPEG_QUALITY = 0.85;

/** Devuelve un mensaje de error si el archivo no sirve, o `null` si es válido. */
export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Formato no admitido. Usa JPG, PNG o WEBP.';
  }
  if (file.size > MAX_BYTES) {
    return 'La imagen pesa más de 10 MB. Usa una más ligera.';
  }
  return null;
}

/** Redimensiona en el navegador con <canvas> si el lado mayor supera MAX_SIDE. */
export async function resizeImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const { width, height } = bitmap;
  const ratio = Math.min(1, MAX_SIDE / Math.max(width, height));

  if (ratio === 1 && file.type === 'image/jpeg') {
    bitmap.close();
    return file;
  }

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close();
    return file;
  }

  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY),
  );

  return blob ?? file;
}

/**
 * Valida, redimensiona y sube la imagen. Devuelve la URL pública definitiva.
 * Lanza un Error con mensaje legible si algo falla.
 */
export async function uploadImage(file: File, slug: string, campo: string): Promise<string> {
  if (!supabaseConfigured) {
    throw new Error('Supabase no está configurado: no se pueden subir imágenes.');
  }

  const invalid = validateImageFile(file);
  if (invalid) throw new Error(invalid);

  const blob = await resizeImage(file);
  const id = crypto.randomUUID().slice(0, 8);
  const safeCampo = campo.replace(/[^a-zA-Z0-9]+/g, '-');
  const path = `paginas/${slug}/${safeCampo}-${id}.jpg`;

  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, blob, { contentType: 'image/jpeg', upsert: false });

  if (error) throw new Error(error.message);

  return getPublicUrl(path);
}

export function getPublicUrl(path: string): string {
  return supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}

import { supabase, supabaseConfigured } from './supabase';

export const IMAGE_BUCKET = 'imagenes';

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

/** Lo que acepta el selector de archivos del editor. */
export const ACCEPT_MEDIA = [...IMAGE_TYPES, ...VIDEO_TYPES].join(',');

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB antes de redimensionar
const MAX_VIDEO_BYTES = 50 * 1024 * 1024; // 50 MB: límite por archivo de Supabase Storage
const MAX_SIDE = 1600; // px del lado mayor tras redimensionar
const JPEG_QUALITY = 0.85;

const VIDEO_EXT: Record<string, string> = {
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
};

export function isVideoFile(file: File): boolean {
  return VIDEO_TYPES.includes(file.type);
}

/** Deduce si una URL guardada apunta a un vídeo, por su extensión. */
export function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm|mov)(\?|#|$)/i.test(url);
}

/** Devuelve un mensaje de error si el archivo no sirve, o `null` si es válido. */
export function validateMediaFile(file: File): string | null {
  if (isVideoFile(file)) {
    if (file.size > MAX_VIDEO_BYTES) {
      return 'El vídeo pesa más de 50 MB. Compáctalo o recórtalo antes de subirlo.';
    }
    return null;
  }

  if (!IMAGE_TYPES.includes(file.type)) {
    return 'Formato no admitido. Usa JPG, PNG o WEBP para fotos, y MP4 o WEBM para vídeos.';
  }
  if (file.size > MAX_IMAGE_BYTES) {
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
 * Valida y sube una foto o un vídeo. Las fotos se redimensionan en el
 * navegador; los vídeos se suben tal cual (no se pueden recomprimir en
 * cliente sin herramientas pesadas). Devuelve la URL pública definitiva.
 */
export async function uploadMedia(file: File, slug: string, campo: string): Promise<string> {
  if (!supabaseConfigured) {
    throw new Error('Supabase no está configurado: no se pueden subir archivos.');
  }

  const invalid = validateMediaFile(file);
  if (invalid) throw new Error(invalid);

  const video = isVideoFile(file);
  const body: Blob = video ? file : await resizeImage(file);
  const ext = video ? VIDEO_EXT[file.type] : 'jpg';
  const contentType = video ? file.type : 'image/jpeg';

  const id = crypto.randomUUID().slice(0, 8);
  const safeCampo = campo.replace(/[^a-zA-Z0-9]+/g, '-');
  const path = `paginas/${slug}/${safeCampo}-${id}.${ext}`;

  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, body, { contentType, upsert: false });

  if (error) throw new Error(error.message);

  return getPublicUrl(path);
}

export function getPublicUrl(path: string): string {
  return supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}

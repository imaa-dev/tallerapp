import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import imageCompression from 'browser-image-compression';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const handleImageUploadSingle = async (file: File) => {
    const getProperMimeType = (fileName: string): string => {
        const ext = fileName.split('.').pop()?.toLowerCase() || '';
        const mimeTypes: Record<string, string> = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'heic': 'image/heic'
        };
        return mimeTypes[ext] || 'image/jpeg';
    };

    try {
        const buffer = await file.arrayBuffer();

        const properMimeType = getProperMimeType(file.name);

        const properFile = new File([buffer], file.name, {
            type: properMimeType
        });

        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1000,
            useWebWorker: true,
            initialQuality: 0.7,
            fileType: properMimeType,
            alwaysKeepResolution: false,
            preserveExif: false,
            maxIteration: 10
        };

        let compressedImage = await imageCompression(properFile, options);

        if (compressedImage.size > 2 * 1024 * 1024) {
            const secondOptions = {
                ...options,
                maxSizeMB: 1,
                maxWidthOrHeight: 1000,
                initialQuality: 0.7
            };
            compressedImage = await imageCompression(compressedImage, secondOptions);
        }

        const timestamp = Date.now();
        const safeFileName = file.name
            .toLowerCase()
            .replace(/[^a-z0-9.]/g, '_')
            .replace(/_{2,}/g, '_');
        const finalFileName = `${safeFileName.split('.')[0]}_${timestamp}.${properMimeType.split('/')[1]}`;

        const finalFile = new File([compressedImage], finalFileName, {
            type: properMimeType,
            lastModified: Date.now()
        });

        if (finalFile.size === 0) {
            throw new Error('El archivo procesado está vacío');
        }

        return finalFile;
    } catch (error) {
        console.error('Error procesando imagen:', error);
        throw new Error('Error al procesar la imagen. Por favor, intenta con otra imagen o reduce su tamaño.');
    }
};
export const handleImageUploadMultiple = async (files: FileList): Promise<File[]> => {
    try {
        const filesArray = Array.from(files);

        const processedFiles = await Promise.all(
            filesArray.map(async (file) => {
                try {
                    return await handleImageUploadSingle(file);
                } catch (error) {
                    console.error(`Error procesando el archivo ${file.name}:`, error);
                    throw error;
                }
            })
        );

        const emptyFiles = processedFiles.filter(file => file.size === 0);
        if (emptyFiles.length > 0) {
            throw new Error('Algunos archivos procesados están vacíos');
        }

        return processedFiles;
    } catch (error) {
        console.error('Error procesando múltiples imágenes:', error);
        throw new Error('Error al procesar las imágenes. Por favor, verifica los archivos e intenta nuevamente.');
    }
};


export default handleImageUploadSingle;


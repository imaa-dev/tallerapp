import {ImagePickerAsset} from "expo-image-picker";

export function appendImagesToFormData(
    formData: FormData,
    images: ImagePickerAsset[],
    fieldName: string = "file[]"
): FormData {
    images.forEach((image) => {
        formData.append(
            fieldName,
            {
                uri: image.uri,
                name: image.fileName ?? `image-${Date.now()}.jpg`,
                type: image.mimeType ?? "image/jpeg",
            } as any
        );
    });

    return formData;
}
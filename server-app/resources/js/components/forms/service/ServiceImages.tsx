import { useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card } from '@/components/ui/card';
import { SidebarGroupLabel } from '@/components/ui/sidebar';
import { uploadImages, deleteImage } from '@/api/services/filesUpload';
import { useLoading } from '@/context/LoadingContext';
import { handleImageUploadMultiple } from '@/lib/utils';
import { FileMeta } from '@/types';
import { useConfirmDialog } from '@/context/ModalContext';

const appUrl = import.meta.env.VITE_APP_URL;
interface ServiceImagesProps {
  initialFiles: FileMeta[];
  serviceId: number;
}

export default function ServiceImages({ initialFiles, serviceId }: ServiceImagesProps) {
  const { showLoading, hideLoading } = useLoading();
  const [files, setFiles] = useState<FileMeta[]>(initialFiles);

  const { showConfirm } = useConfirmDialog();
  const removeImage = async (id: number) => {
      showLoading()
    const response = await deleteImage(id);
    if (response.code === 200) {
      toast.success(response.message);
      setFiles((prev) => prev.filter((file) => file.id !== id));
    } else {
      toast.error('Error en el servidor');
    }
    hideLoading();
  };
    const handleDelete = (fileId: number) => {
        showConfirm({
          title: "¿Deseas eliminar esta imagen?",
          onConfirm: () => removeImage(fileId),
        });
      };
  const uploadImage = async (fileList: FileList) => {
    showLoading();
    try {
      const compressedFiles = await handleImageUploadMultiple(fileList)
      const response = await uploadImages(compressedFiles, serviceId);

      if (response.code === 200) {
        toast.success(response.message);
        setFiles(response.files);
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error('Error al subir imagen');
      console.error(err);
    }
    hideLoading();
  };

  return (
    <Card className="m-5 mt-5 max-w-xl p-6">
      <SidebarGroupLabel>Fotos y registros del servicio</SidebarGroupLabel>
      {files.length > 0 ? (
        <div className="mt-4 grid grid-cols-3 gap-3">
          {files.map((item) => (
            <div key={item.id} className="relative">
              <img
                src={`${appUrl}/storage/${item.path}`}
                alt={`preview-${item.id}`}
                className="w-full h-28 object-cover rounded border"
              />
              <button
                type="button"
                onClick={() => {
                  handleDelete(item.id)
                }}
                className="absolute top-1 right-1 p-1 m-1 rounded-full bg-red-600 text-white text-xs opacity-80 hover:opacity-100"
                title="Eliminar imagen"
              >
                <X width={13} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="group relative flex justify-center items-center">
          <img className="w-50 rounded border" src={`${appUrl}/images/max-img.png`} alt="Upload Image" />
        </div>
      )}
      <div className="group relative z-0 mb-5 w-full">
        <input
          type="file"
          name="file_servi[]"
          id="file_servi"
          className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-0 focus:outline-none dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
          multiple
          tabIndex={5}
          autoComplete="file"
          onChange={(e) => {
            const files = e.target.files;
            if (files) uploadImage(files);
          }}
        />
        <label
          htmlFor="file_servi"
          className="absolute top-3 -z-10 leorigin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
        >
          Fotos
        </label>
      </div>
    </Card>
  );
}

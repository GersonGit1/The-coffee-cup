"use client"

import { deleteImage } from '@/actions/delete-image-action';
import { getImagePath } from '@/src/utils/currency';
import { CldUploadWidget, CloudinaryUploadWidgetResults } from 'next-cloudinary'
import Image from 'next/image';
import { useRef, useState } from 'react';
import { TbPhotoPlus } from 'react-icons/tb'

type ImageUploadProps = {
  image?: string; 
  imagePublicId?: string; 
};

export default function ImageUpload({ image, imagePublicId }: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [publicId, setPublicId] = useState<string>("");
  const previousPublicIdRef = useRef<string | null>(null);

  const handleUpload = async (result : CloudinaryUploadWidgetResults, widget : any) => {
    if (result.event === "success") {
      // @ts-ignore
      const newPublicId = result.info.public_id;
      // @ts-ignore
      const newUrl = result.info.secure_url;

      if(previousPublicIdRef.current && previousPublicIdRef.current !== newPublicId)//si había subido una imágen en este mismo formulario antes de guardar el registro
      {        
        await deleteImage(previousPublicIdRef.current); //borrar la imagen que probablemente subió por error
      }

      setImageUrl(newUrl);
      setPublicId(newPublicId);
      // actualizar ref
      previousPublicIdRef.current = newPublicId;
      widget.close();
    }
  }
  return (
    <CldUploadWidget
      onSuccess={async (result, { widget }) => {  
        await handleUpload(result, widget)
      }}
      uploadPreset="preset"
      options={{
        maxFiles: 1,
        folder: "products",
      }}
    >
      {({ open }) => (
        <>
          <div className="space-y-2">
            <label className="text-slate-800">Imagen de producto</label>
            <div
              className="relative cursor-pointer hover:opacity-70 transition p-10 border-neutral-300 flex flex-col justify-center text-center gap-4 text-neutral-600 bg-slate-100"
              onClick={() => open?.()}
            >
              <TbPhotoPlus size={50} />
              <p className="text-lg font-semibold">Agregar imagen</p>

              {imageUrl && (
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    fill
                    sizes="256px"
                    style={{ objectFit: "contain" }}
                    src={getImagePath(imageUrl)}
                    alt="Product Image"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Mostrar imagen actual si no se ha subido una nueva */}
          {image && !imageUrl && (
            <div className="space-y-2">
              <label>Imagen actual</label>
              <div className="relative w-64 h-64">
                <Image
                  fill
                  sizes="256px"
                  style={{ objectFit: "contain" }}
                  src={getImagePath(image)}
                  alt="Product Image"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Inputs ocultos para enviar al server */}
          <input
            type="hidden"
            name="image"
            defaultValue={imageUrl ? imageUrl : image}
          />
          <input
            type="hidden"
            name="imagePublicId"
            defaultValue={publicId ? publicId : imagePublicId}
          />
        </>
      )}
    </CldUploadWidget>
  );
}

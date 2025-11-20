"use server"

import cloudinary from "@/src/lib/cloudinary";

export async function deleteImage(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.log("Error deleting image:", err);
  }
}
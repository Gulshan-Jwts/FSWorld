import { createUploadthing } from "uploadthing/next";

export const f = createUploadthing();

export const ourFileRouter = {
  mediaUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 }, // multiple images
    video: { maxFileSize: "20MB", maxFileCount: 1 }, // multiple videos
  }).onUploadComplete(async ({ metadata, file }) => {
    return {
      uploadedBy: metadata?.userId || "anonymous",
      url: file.ufsUrl,
      type: file.type, // "image" or "video"
    };
  }),
};

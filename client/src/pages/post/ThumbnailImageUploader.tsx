import { ChangeEvent } from "react";

interface Props {
  imageUploadHandler: (e: ChangeEvent<HTMLInputElement>) => void;
  imagePreviewInfo?: string[];
}

export default function ThumbnailImageUploader({
  imageUploadHandler,
  imagePreviewInfo,
}: Props) {
  return (
    <div className="flex flex-col border-2 rounded-lg border-dashed border-black border-opacity-50 h-52 mt-2">
      <label
        htmlFor="thumbnailUploader"
        className="bg-gray-200 w-full h-full text-center flex items-center justify-center cursor-pointer"
      >
        {imagePreviewInfo ? (
          <span className=" flex items-center gap-3">
            <img src={imagePreviewInfo[1]} alt="upload preview" width={45} />
            <span className="opacity-50">{imagePreviewInfo[0]}</span>
          </span>
        ) : (
          <span className="opacity-50">
            <span className="fa-regular fa-image mr-2"></span>
            Upload your photo here
          </span>
        )}
      </label>
      <input
        type="file"
        id="thumbnailUploader"
        className="hidden"
        onChange={imageUploadHandler}
      />
    </div>
  );
}

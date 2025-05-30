import { motion } from "framer-motion";
import { Image, Play, ChevronRight, Upload, X, Info } from "lucide-react";
import { BaseStepProps } from "@/types/camapaignmodal";

const AdTypeSelection = ({
  formData,
  setFormData,
  uploadedFile,
  handleFileUpload,
  removeFile,
}: BaseStepProps) => {
  const adTypes = [
    {
      id: "display_ads",
      icon: <Image className="w-6 h-6" />,
      title: "Display Ads",
      description: "Static images or animated banners",
      specs: {
        formats: "PNG, JPG, GIF",
        dimensions: "1200x628px",
        maxSize: "5MB",
      },
    },
    {
      id: "video_ads",
      icon: <Play className="w-6 h-6" />,
      title: "Video Ads",
      description: "Short-form video content",
      specs: {
        formats: "MP4, MOV",
        duration: "30 seconds",
        maxSize: "50MB",
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Choose Ad Type</h3>
        <div className="text-sm text-gray-500">Step 4 of 8</div>
      </div>

      <div className="space-y-4">
        {adTypes.map((type) => (
          <div
            key={type.id}
            className={`p-4 rounded-xl border transition-all ${
              formData.adType === type.id
                ? "border-side bg-side/5"
                : "border-gray-200"
            }`}
          >
            <button
              type="button"
              onClick={() => setFormData({ ...formData, adType: type.id })}
              className="flex items-start gap-4 w-full text-left"
            >
              <div
                className={`p-2 rounded-lg ${
                  formData.adType === type.id
                    ? "bg-side text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {type.icon}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{type.title}</div>
                <div className="text-sm text-gray-500">{type.description}</div>
              </div>
              <motion.div
                initial={false}
                animate={{ rotate: formData.adType === type.id ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight
                  className={`w-5 h-5 ${
                    formData.adType === type.id ? "text-side" : "text-gray-400"
                  }`}
                />
              </motion.div>
            </button>

            {formData.adType === type.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 pl-14"
              >
                {!uploadedFile ? (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Specifications:
                      </div>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {Object.entries(type.specs).map(([key, value]) => (
                          <li key={key} className="flex items-center">
                            <span className="w-24 text-gray-500">{key}:</span>
                            <span>{value}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-side/50 transition-colors">
                      <input
                        type="file"
                        accept={
                          type.id === "display_ads" ? "image/*" : "video/*"
                        }
                        onChange={(e) =>
                          handleFileUpload && handleFileUpload(e, type.id)
                        }
                        className="hidden"
                        id={`${type.id}-upload`}
                      />
                      <label
                        htmlFor={`${type.id}-upload`}
                        className="cursor-pointer block"
                      >
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <div className="text-sm text-gray-600">
                          {type.id === "display_ads" ? (
                            <>
                              Drag and drop or click to upload images
                              <div className="text-xs text-gray-400 mt-1">
                                Accepted formats: PNG, JPG, GIF (max 5MB)
                              </div>
                            </>
                          ) : (
                            <>
                              Upload your video advertisement
                              <div className="text-xs text-gray-400 mt-1">
                                Max duration: 30 seconds, Max size: 50MB
                              </div>
                            </>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {type.id === "display_ads" &&
                    uploadedFile &&
                    (uploadedFile instanceof File
                      ? uploadedFile.type?.startsWith("image/")
                      : uploadedFile[0] &&
                        uploadedFile[0].type?.startsWith("image/")) ? (
                      <div className="grid grid-cols-1 gap-4">
                        <div className="relative group">
                          <img
                            src={URL.createObjectURL(
                              uploadedFile instanceof File
                                ? uploadedFile
                                : uploadedFile[0]
                            )}
                            alt="Ad Preview"
                            className="rounded-lg w-full h-48 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <button
                              type="button"
                              onClick={removeFile}
                              className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50"
                            >
                              <X className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : type.id === "video_ads" &&
                      uploadedFile &&
                      (uploadedFile instanceof File
                        ? uploadedFile.type?.startsWith("video/")
                        : uploadedFile[0] &&
                          uploadedFile[0].type?.startsWith("video/")) ? (
                      <div className="relative group">
                        <video
                          controls
                          className="rounded-lg w-full"
                          src={URL.createObjectURL(
                            uploadedFile instanceof File
                              ? uploadedFile
                              : uploadedFile[0]
                          )}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <button
                            type="button"
                            onClick={removeFile}
                            className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50"
                          >
                            <X className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-300">
                        <div className="flex items-center">
                          <Info className="w-5 h-5 text-yellow-500 mr-2" />
                          <p className="text-sm text-yellow-700">
                            The uploaded file format doesn't match the selected
                            ad type. Please upload a
                            {type.id === "display_ads" ? "n image" : " video"}{" "}
                            file.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="mt-2 px-3 py-1 bg-white text-yellow-600 text-sm rounded border border-yellow-300 hover:bg-yellow-50"
                        >
                          Remove file and try again
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdTypeSelection;

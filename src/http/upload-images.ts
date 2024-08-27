import { api } from "../providers/axios";

interface UploadImagesBody {
  files: FormData;
}

interface UploadImagesResponse {
  attachments: {
    id: string;
    url: string;
  }[];
}

export async function uploadImages({
  files,
}: UploadImagesBody): Promise<UploadImagesResponse> {
  const attachments = await api.post<UploadImagesResponse>(
    "/attachments",
    files
  );

  return attachments.data;
}

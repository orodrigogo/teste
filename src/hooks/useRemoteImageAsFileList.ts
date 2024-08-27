import { useEffect, useState } from "react";

interface Props {
  id?: string;
  url?: string;
}

export function useRemoteImageAsFileList({ id, url }: Props) {
  const [fileList, setFileList] = useState<FileList>(() => {
    const dataTransfer = new DataTransfer();
    return dataTransfer.files;
  });

  useEffect(() => {
    if (id && url) {
      downloadImageAsFileList({
        filename: id,
        url: url,
      })
        .then((response) => {
          if (response) {
            setFileList(response);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [id, url]);

  return fileList;
}

export async function downloadImageAsFileList({
  url,
  filename,
}: {
  url: string;
  filename: string;
}) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Erro ao baixar a imagem.");
    }

    const blob = await response.blob();

    const file = new File([blob], filename, { type: "image/default" });

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    const fileList = dataTransfer.files;

    return fileList;
  } catch (error) {
    console.error("Erro:", error);
  }
}

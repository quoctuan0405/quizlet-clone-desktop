import { readfile } from "../model/readfile";
import { SetWithTermWithId } from "../type";

interface Props {
  fileUploadHandler?: (sets: SetWithTermWithId[]) => any;
  fileDropHandler?: (event: React.DragEvent<HTMLDivElement>) => any;
  fileOverHandler?: (event: React.DragEvent<HTMLDivElement>) => any;
  fileLeaveHandler?: (event: React.DragEvent<HTMLDivElement>) => any;
}

export const useFileUpload = ({
  fileUploadHandler,
  fileDropHandler,
  fileOverHandler,
  fileLeaveHandler,
}: Props) => {
  const inputFileHandler: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    const sets: SetWithTermWithId[] = [];

    const filesLength = event.currentTarget.files?.length || 0;
    for (let i = 0; i < filesLength; i++) {
      const file = event.currentTarget.files?.item(i);
      sets.push(...(await readfile(file, { addUniqueId: true })));
    }

    fileUploadHandler && fileUploadHandler(sets);
  };

  const dropHandler: React.DragEventHandler<HTMLDivElement> = async (event) => {
    // Prevent default behavior (Prevent file from being opened)
    event.preventDefault();

    // Read data from files
    const sets: SetWithTermWithId[] = [];

    if (event.dataTransfer) {
      if (event.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        await Promise.all(
          [...event.dataTransfer.items].map(async (item, i) => {
            // If dropped items aren't files, reject them
            if (item.kind === "file") {
              const file = item.getAsFile();
              sets.push(...(await readfile(file, { addUniqueId: true })));
            }
          })
        );
      } else {
        // Use DataTransfer interface to access the file(s)
        await Promise.all(
          [...event.dataTransfer.files].map(async (file, i) => {
            sets.push(...(await readfile(file, { addUniqueId: true })));
          })
        );
      }
    }

    fileUploadHandler && fileUploadHandler(sets);
    fileDropHandler && fileDropHandler(event);
  };

  const dragOverHandler: React.DragEventHandler<HTMLDivElement> = (event) => {
    // Prevent default behavior (Prevent file from being opened)
    event.preventDefault();

    fileOverHandler && fileOverHandler(event);
  };

  const dragLeaveHandler: React.DragEventHandler<HTMLDivElement> = (event) => {
    // Prevent default behavior (Prevent file from being opened)
    event.preventDefault();

    fileLeaveHandler && fileLeaveHandler(event);
  };

  return { inputFileHandler, dropHandler, dragOverHandler, dragLeaveHandler };
};

import fs from 'fs';

interface IWriteFile {
  dirPath: string;
  fileName: number | string;
  content: Buffer;
}

export async function writeFile({ dirPath, fileName, content }: IWriteFile) {
  try {
    await fs.promises.mkdir(dirPath, { recursive: true });
    await fs.promises.writeFile(dirPath + `\\${fileName}`, content);
  } catch (error) {
    console.log(error);
  }
}

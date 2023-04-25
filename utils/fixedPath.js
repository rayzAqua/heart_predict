import path from "path";

export const fixedPath = (fileLocation) => {

    const rootDirectoryPath = path.dirname(path.dirname(new URL(import.meta.url).pathname));
    const filePath = path.join(rootDirectoryPath, fileLocation[0], fileLocation[1]);
    const pathArray = filePath.split("\\");
    const slicePathArray = pathArray.slice(1, pathArray.length);
    const modelPath = slicePathArray.join("\\");

    return modelPath;
}
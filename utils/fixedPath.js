export const fixedPath = (filePath) => {

    const pathArray = filePath.split("\\");
    const slicePathArray = pathArray.slice(1, pathArray.length);
    const modelPath = slicePathArray.join("\\");

    return modelPath;
}
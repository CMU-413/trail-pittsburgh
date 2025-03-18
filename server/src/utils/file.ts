function expressFileToFile(file: Express.Multer.File): File {
    return new File([file.buffer], file.originalname, { type: file.mimetype });
}

async function imageUrlToFile(filename: string, photoUrl: string) {
    const response = await fetch(photoUrl);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
}

export { expressFileToFile, imageUrlToFile };

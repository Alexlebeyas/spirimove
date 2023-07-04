class FileService {
  getImagePreview(file: File) {
    return URL.createObjectURL(file);
  }
}

export default new FileService();

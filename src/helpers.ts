export function downloadFile(file: string, fileName: string) {
  let link = document.createElement('a');
  link.href = file;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

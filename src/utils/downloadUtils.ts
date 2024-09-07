export const downloadFile = async (urlOrBase64Data: string, fileName: string): Promise<void> => {
    let blob: Blob;
  
    if (urlOrBase64Data.startsWith('data:')) {
      // If base64 encoded data is provided
      const base64Response = await fetch(urlOrBase64Data);
      blob = await base64Response.blob();
    } else {
      // If a URL is provided, fetch the file from the URL
      const fileResponse = await fetch(urlOrBase64Data);
      blob = await fileResponse.blob();
    }
  
    // Create a link and trigger the download
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.setAttribute('download', fileName);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  

export const printPDFBase64 = (base64: string): void => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const pdfBlob = new Blob([byteArray], {type: 'application/pdf'});
    const pdfUrl = URL.createObjectURL(pdfBlob);

    // Create an iframe but position it off-screen
    const iframe = document.createElement('iframe');
    iframe.style.position = "absolute";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    iframe.src = pdfUrl;
    document.body.appendChild(iframe);

    iframe.onload = () => {
        setTimeout(() => {
            // Execute print command
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();

            // Use the afterprint event to remove the iframe
            window.addEventListener('afterprint', () => {
                document.body.removeChild(iframe);
                URL.revokeObjectURL(pdfUrl);
            }, { once: true })
        }, 500); // Increase delay if necessary
    };
};


  
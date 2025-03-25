// imageHandler.js
async function imageHandler() {
    // Create an input element for file selection
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
  
    // When a file is selected:
    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('image', file); // The field name should match what your backend expects
  
        try {
          // Call your backend endpoint for image upload
          const res = await fetch('http://localhost:5000/api/upload-image', {
            method: 'POST',
            body: formData,
          });
          if (!res.ok) {
            throw new Error('Image upload failed');
          }
          const data = await res.json();
          const imageURL = data.url; // Cloudinary returns the image URL
  
          // Insert the image URL into the editor at the current cursor position
          const range = this.quill.getSelection();
          this.quill.insertEmbed(range.index, 'image', imageURL);
        } catch (err) {
          console.error('Error uploading image:', err);
        }
      }
    };
  }
  
  export default imageHandler;
  
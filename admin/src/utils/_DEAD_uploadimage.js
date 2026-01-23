const uploadimage = async (file) => {
  const cloudName = "YOUR_CLOUD_NAME";
  const uploadPreset = "YOUR_UPLOAD_PRESET";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData
    }
  );

  const data = await response.json();

  return {
    url: data.secure_url
  };
};

export default uploadimage;

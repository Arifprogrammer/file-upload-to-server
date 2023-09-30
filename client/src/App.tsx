/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";

//* Typescript

const App: React.FC = () => {
  const [image, setImage] = useState<string>(""); //! handle image URL
  const [file, setFile] = useState<File | undefined>();
  const [pictures, setPictures] = useState([]);

  const loadData = async () => {
    const res = await fetch("http://localhost:5000/getimage");
    const data = await res.json();
    setPictures(data);
  };

  //* Upload Picture and Change again
  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const selectedFile = event.target.files?.[0];
    setFile(selectedFile);
    if (selectedFile) {
      const objectURL = URL.createObjectURL(selectedFile);
    }
    setImage(URL.createObjectURL(selectedFile!)); //! convert the image name into URL to display and put in image:src
    event.target.value = ""; //! reset the input field
  };

  //* Confirm the Picture
  const handleConfirmPic = () => {
    const formData = new FormData();
    formData.set("file", file!);
    const sendFile = async () => {
      try {
        const res = await fetch("http://localhost:5000/profile", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        console.log(data);
        loadData();
        setImage("");
        if (res.ok) alert("File uploaded successfully");
        else console.error("Some error occured");
      } catch (e) {
        console.log(e);
      }
    };
    sendFile();
  };

  //* Confirm the Picture
  const handleCancelPic = () => {
    setImage("");
  };

  useEffect(() => {
    loadData();
  }, []);
  return (
    <>
      <div className="min-h-[500px] flex flex-col justify-center items-center px-4 mb-12">
        {/* //!picture upload section - start */}
        <label
          htmlFor="uplodPic"
          className={`border-2 border-blue border-dashed rounded-xl w-full max-w-[542px] h-80 flex flex-col items-center justify-between py-5 px-4 mb-6 ${
            image ? "" : "cursor-pointer"
          }`}
        >
          {image ? null : (
            <p className="text-xl font-semibold text-center">Choose an image</p>
          )}
          {image ? (
            <div className="h-full w-full bg-black rounded-full relative">
              <img
                src={image}
                alt="image"
                loading="lazy"
                style={{ borderRadius: "2%" }}
                className="bg-black object-contain w-full h-full"
              />
            </div>
          ) : (
            <img src={"/upload-image-icon.png"} alt="" height={64} width={64} />
          )}
          <input
            type="file"
            name="uplodPic"
            id="uplodPic"
            className="hidden"
            onChange={handleImageChange}
          />
          {image ? null : (
            <div className="px-5 py-2 rounded-md bg-white text-black">
              Upload
            </div>
          )}
          {/* //!picture upload section - end */}
        </label>
        {image ? (
          <div>
            <button
              className="px-5 py-2 rounded-md bg-red-600 text-white mr-6"
              onClick={handleCancelPic}
            >
              Cancel
            </button>
            <button
              className="px-5 py-2 rounded-md bg-green-600 text-white"
              onClick={handleConfirmPic}
            >
              Confirm
            </button>
          </div>
        ) : null}
      </div>
      <div className="grid grid-cols-3 gap-8 container mx-auto mb-16">
        {pictures.map(({ name }) => (
          <img
            src={`http://localhost:5000/${name}`}
            alt=""
            className="w-full h-full rounded-2xl"
          />
        ))}
      </div>
    </>
  );
};

export default App;

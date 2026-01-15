import { CgClose } from "react-icons/cg";

const DisplayImage = ({ imgUrl, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
      <div className="relative">
        <img
          src={imgUrl}
          alt="full-view"
          className="max-w-[90vw] max-h-[90vh] rounded"
        />

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-2xl"
        >
          <CgClose />
        </button>
      </div>
    </div>
  );
};

export default DisplayImage;

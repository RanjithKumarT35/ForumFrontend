import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function Editor({ value, onChange }) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };
  return (
    <div className="content">
      <ReactQuill
        value={value}
        theme={"snow"}
        onChange={onChange}
        modules={modules}
      />
    </div>
  );
}

// import React, { useRef } from "react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// const MAX_IMAGE_SIZE_MB = 2;

// const Editor = ({ value, onChange }) => {
//   const quillRef = useRef(null);

//   const handleQuillChange = (content, delta, source, editor) => {
//     // Check if the change is due to inserting an image
//     const lastOperation = delta[delta.length - 1];
//     if (lastOperation && lastOperation.insert && lastOperation.insert.image) {
//       const imageUrl = lastOperation.insert.image;

//       // Load the image to get its size
//       const img = new Image();
//       img.src = imageUrl;
//       img.onload = function () {
//         const imageSizeMB = (img.size || img.length) / (1024 * 1024);

//         // Check if the image size exceeds the allowed limit
//         if (imageSizeMB > MAX_IMAGE_SIZE_MB) {
//           alert(
//             `Image size exceeds ${MAX_IMAGE_SIZE_MB} MB. Please choose a smaller image.`
//           );
//           // Remove the last operation to prevent the image from being inserted
//           editor.updateContents({ ops: delta.slice(0, -1) });
//         }
//       };
//     }

//     // Invoke the provided onChange callback
//     onChange(content, delta, source, editor);
//   };

//   return (
//     <div className="content">
//       <ReactQuill
//         ref={quillRef}
//         value={value}
//         theme="snow"
//         onChange={handleQuillChange}
//         modules={{
//           toolbar: [
//             [{ header: [1, 2, false] }],
//             ["bold", "italic", "underline", "strike", "blockquote"],
//             [
//               { list: "ordered" },
//               { list: "bullet" },
//               { indent: "-1" },
//               { indent: "+1" },
//             ],
//             ["link", "image"],
//             ["clean"],
//           ],
//         }}
//       />
//     </div>
//   );
// };

// export default Editor;

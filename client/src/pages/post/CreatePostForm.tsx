import { ChangeEvent, FormEvent, useState } from "react";
import Swal from "sweetalert2";
import axios, { AxiosError } from "axios";
import Button from "../../components/Button";
import FormControl from "../../components/FormControl";
import ThumbnailImageUploader from "./ThumbnailImageUploader";
import LocalLoader from "../../components/LocalLoader";
import { useNavigate } from "react-router-dom";

export default function CreatePostForm() {
  const [postTitle, setPostTitle] = useState<string>();
  const [webLink, setWebLink] = useState<string>();
  const [repositoryLink, setRepoLink] = useState<string>();
  const [thumbnailImage, setThumbnailImage] = useState<File>();
  const [imagePreviewInfo, setImagePreviewInfo] = useState<string[]>();
  const [inputsDisabled, setInputsDisabled] = useState(false);
  const [description, setDescription] = useState<string>();

  const navigate = useNavigate();

  const missingAlert = (name: string) => {
    Swal.fire({
      icon: "warning",
      title: `<span><span class="font-bold capitalize text-red-500">${name}</span> is missing</span>`,
      text: "Please provide a valid value.",
      confirmButtonColor: "#ef4444",
    });
  };

  const imageUploadHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    const validMimes = ["image/jpg", "image/jpeg", "image/png", "image/webp"];
    if (!validMimes.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: `<span class="text-red-500">Invalid file type<span/>`,
        text: "The file is not an image, please provide an image '(jpg, jpeg, png, webp)'",
        confirmButtonColor: "#ef4444",
      });
      return;
    }
    const localUrlImage = URL.createObjectURL(file);
    setImagePreviewInfo([file.name, localUrlImage]);
    setThumbnailImage(file);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const apiUri = import.meta.env.VITE_API_URI;
    if (!postTitle) return missingAlert("Post title");
    if (!webLink) return missingAlert("Web Link");
    if (!repositoryLink) return missingAlert("Repository Link");
    if (!description) return missingAlert("Description");
    if (!thumbnailImage) return missingAlert("thumbnail image");

    const formData = new FormData();
    formData.append("thumbnail", thumbnailImage);
    formData.append("webLink", webLink);
    formData.append("repositoryLink", repositoryLink);
    formData.append("postName", postTitle);
    formData.append("description", description);
    try {
      setInputsDisabled(true);
      const response = await axios.post(apiUri + "/post", formData);
      const swalResult = await Swal.fire({
        icon: "success",
        title: "Post created!",
        text: "Your post has been created, go and take a look!",
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonColor: "#ef4444",
      });
      if (swalResult.isConfirmed) {
        return navigate(`/post/${response.data.postId}`);
      }
    } catch (e) {
      if (e instanceof AxiosError) {
        Swal.fire({
          icon: "error",
          title: `<span class="text-red-500">${e.message}<span/>`,
          text: e.response?.data.message || "Error while creating the post",
          confirmButtonColor: "#ef4444",
        });
      } else {
        console.error(e);
      }
    }
    setInputsDisabled(false);
  };

  return (
    <div className="self-center">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <FormControl
          disabled={inputsDisabled}
          name="post-title"
          id="postTitle"
          label="Post Title"
          placeholder="Eg. 'My web dev Portfolio' "
          maxLength={50}
          stateHandler={setPostTitle}
        />
        <div className="flex flex-col md:flex-row justify-between md:gap-5 gap-4">
          <FormControl
            disabled={inputsDisabled}
            name="web-link"
            id="webLink"
            label="Web Link"
            placeholder="Eg. 'https://idevportfolio.dev'"
            stateHandler={setWebLink}
          />
          <FormControl
            disabled={inputsDisabled}
            name="repo-link"
            id="repoLink"
            label="Repository Link"
            placeholder="Eg. 'https://github.com/user/repo'"
            stateHandler={setRepoLink}
          />
        </div>

        <div className="flex flex-col text-lg gap-1">
          <label htmlFor="description">Post Description</label>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            className="bg-gray-200 rounded-lg px-3 py-1 resize-none focus:outline-red-500 outline-none"
            rows={3}
            id="description"
            placeholder="Eg. Hi i'm a junior software developer, i'm new to the industry and i made this portfolio using React and AstroJS"
          ></textarea>
        </div>

        <ThumbnailImageUploader
          imageUploadHandler={imageUploadHandler}
          imagePreviewInfo={imagePreviewInfo}
        />
        <div className="self-center w-1/2 mt-4">
          <Button
            type="secondary"
            isSubmit={true}
            className="w-full"
            disabled={inputsDisabled}
          >
            {!inputsDisabled ? "Upload" : <LocalLoader />}
          </Button>
        </div>
      </form>
    </div>
  );
}

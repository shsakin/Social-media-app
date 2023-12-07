import { useContext, useState } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteStory from "./StoryDelete";


const Stories = () => {
  const { currentUser } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const { isLoading, error, data } = useQuery(["stories"], () =>
    makeRequest.get("/stories").then((res) => {
    return res.data;
    })
  );



  
  
  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (newStory) => {
      return makeRequest.post("/stories", newStory);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["stories"]);
      },
    }
  );
  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (file) imgUrl = await upload();
    mutation.mutate({ img: imgUrl });
    setFile(null);
  };


  //TODO Add story using react-query mutations and use upload function.

  return (
    <div className="stories">

      <div className="story">
        <img src={"/upload/" + currentUser.profilePic} alt="" />
        <span >{currentUser.name}</span>
        <input
          type="file"
          id="story"
          style={{ display: "none" }}
          onChange={(e) => setFile(e.target.files[0])}
        />
        <label htmlFor="story">
          <div>
            <span className="button" >+</span>
          </div>
        </label>
        <div>
          <span className="upload" onClick={handleClick}>&#10003;</span>
        </div>

      </div>
      {error
        ? "Something went wrong"
        : isLoading
        ? "loading"
        : data.map((data) => (
            <div className="story" key={data.id}>
              <img src={"/upload/"+data.img} alt="" />
              <span>{data.name}</span>
              <MoreHorizIcon className="more" onClick={() => setMenuOpen(!menuOpen)} />
              {menuOpen && data.userId === currentUser.id && (
              < DeleteStory storyId={data.id} />
              )}
            </div>
          ))}
    </div>
  );
};

export default Stories;
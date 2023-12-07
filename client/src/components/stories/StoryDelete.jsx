import { makeRequest } from "../../axios";
import {  useMutation, useQueryClient } from "@tanstack/react-query";
import "./stories.scss";


const DeleteStory  = ({ storyId }) => {

    const queryClient = useQueryClient();

    const deleteMutation = useMutation(
        (commentId) => {
            return makeRequest.delete("/stories/" + commentId);
        },
        {
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries(["stories"]);
        },
        }
    );

    const handleDelete = () => {
        deleteMutation.mutate(storyId);
    };








    return (
        <button onClick={handleDelete} className="del">delete</button>
    )

};


export default DeleteStory;
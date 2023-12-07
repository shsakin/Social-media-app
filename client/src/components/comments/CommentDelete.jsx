import "./comments.scss";
import { makeRequest } from "../../axios";
import {  useMutation, useQueryClient } from "@tanstack/react-query";


const DeleteComment  = ({ commentId }) => {

    const queryClient = useQueryClient();

    const deleteMutation = useMutation(
        (commentId) => {
            return makeRequest.delete("/comments/" + commentId);
        },
        {
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries(["comments"]);
        },
        }
    );

    const handleDelete = () => {
        deleteMutation.mutate(commentId);
    };








    return (
        <button onClick={handleDelete} className="delt">delete</button>
    )

};


export default DeleteComment;
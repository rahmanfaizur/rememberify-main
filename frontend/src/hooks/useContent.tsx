import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import axios from "axios";

export function useContent() {
    const [contents, setContents] = useState([]);

    //prolly try using a library like react query or tanstack query!
    function refresh() {
    axios.get(`${BACKEND_URL}/api/v1/content`, {
        headers: {
            "Authorization": localStorage.getItem("token")
        }
    })
        .then((response) => {
            setContents(response.data.content);
        })
    }

    useEffect(() => {
        let interval = setInterval(() => {
            refresh();
        }, 10 * 1000)

        return () => { //cleanup!
            clearInterval(interval);
        }
    }, [])

    return {contents, refresh};
}
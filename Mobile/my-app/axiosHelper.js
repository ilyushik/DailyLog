import axios from "axios";

const axiosHelper = async (url, token, setSomething) => {
    try {
        const response =
            await axios.get(`http://localhost:8080/${url}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
        // console.log(response.data)
        setSomething(response.data);
    } catch (e) {
        console.log(e.response.data);
    }
}

export { axiosHelper };
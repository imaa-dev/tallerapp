import axios from "axios"
const appUrl = import.meta.env.VITE_APP_URL;

const getSpareParts = async () => {
    const response = await axios.post(`${appUrl}/get-spareparts`)
    return response.data
} 

export { getSpareParts }
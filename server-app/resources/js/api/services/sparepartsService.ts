import axios from "axios"
const appUrl = import.meta.env.VITE_APP_URL;

const getSpareParts = async () => {
    try {
        const response = await axios.post(`${appUrl}/get-spareparts`)
        return response.data
    } catch (error) {
        console.log(error)
    }
} 

export { getSpareParts }
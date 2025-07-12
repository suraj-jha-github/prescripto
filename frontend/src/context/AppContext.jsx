import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currencySymbol = '₹'
    const backendUrl = 'https://prescripto-backend-wgqr.onrender.com'

    const [doctors, setDoctors] = useState([])
    const [token, setToken] = useState(() => {
        const storedToken = localStorage.getItem('token')
        return storedToken && storedToken !== 'false' ? storedToken : ''
    })
    const [userData, setUserData] = useState(false)

    // Getting Doctors using API
    const getDoctosData = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/doctor/list', {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: false
            })
            if (data.success) {
                setDoctors(data.doctors)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log('Error fetching doctors:', error)
            if (error.response) {
                console.log('Response data:', error.response.data)
                console.log('Response status:', error.response.status)
                console.log('Response headers:', error.response.headers)
            }
            toast.error('Failed to load doctors. Please try again.')
        }

    }

    // Getting User Profile using API
    const loadUserProfileData = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token } })

            if (data.success) {
                setUserData(data.userData)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    useEffect(() => {
        getDoctosData()
    }, [])

    useEffect(() => {
        if (token) {
            loadUserProfileData()
        }
    }, [token])

    const value = {
        doctors, getDoctosData,
        currencySymbol,
        backendUrl,
        token, setToken,
        userData, setUserData, loadUserProfileData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider

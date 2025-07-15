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
    const [isLoading, setIsLoading] = useState(false)

    // Retry function for API calls
    const retryApiCall = async (apiCall, maxRetries = 3, delay = 1000) => {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await apiCall();
            } catch (error) {
                console.log(`Attempt ${attempt} failed:`, error.message);
                
                if (attempt === maxRetries) {
                    throw error;
                }
                
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, delay * attempt));
            }
        }
    };

    // Getting Doctors using API with retry logic
    const getDoctosData = async () => {
        setIsLoading(true);
        
        try {
            const { data } = await retryApiCall(async () => {
                return await axios.get(backendUrl + '/api/doctor/list', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: false,
                    timeout: 10000 // 10 second timeout
                });
            });

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
            
            // Show different messages based on error type
            if (error.code === 'ERR_NETWORK') {
                toast.error('Network error. Please check your connection and try again.');
            } else if (error.code === 'ECONNABORTED') {
                toast.error('Request timeout. Server might be starting up. Please try again.');
            } else {
                toast.error('Failed to load doctors. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    }

    // Getting User Profile using API with retry logic
    const loadUserProfileData = async () => {
        if (!token) return;

        try {
            const { data } = await retryApiCall(async () => {
                return await axios.get(backendUrl + '/api/user/get-profile', { 
                    headers: { token },
                    timeout: 10000
                });
            });

            if (data.success) {
                setUserData(data.userData)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log('Error loading user profile:', error)
            
            if (error.code === 'ERR_NETWORK') {
                toast.error('Network error. Please check your connection.');
            } else if (error.code === 'ECONNABORTED') {
                toast.error('Request timeout. Please try again.');
            } else {
                toast.error('Failed to load profile. Please try again.');
            }
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
        userData, setUserData, loadUserProfileData,
        isLoading
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider

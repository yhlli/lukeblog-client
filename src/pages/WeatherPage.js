import { useEffect, useState } from "react"
import { address } from "../Header"
import Loading from "../Loading";

export default function WeatherPage(){
    const [weatherData, setWeatherData] = useState('');
    const [city, setCity] = useState('');
    const [region, setRegion] = useState('');
    const [country, setCountry] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [temp, setTemp] = useState('');
    const [feelsTemp, setFeelsTemp] = useState('');
    const [templow, setTemplow] = useState('');
    const [temphigh, setTemphigh] = useState('');
    const [iconUrl, setIconUrl] = useState('');
    const [altUrl, setAltUrl] = useState('');
    const [wind, setWind] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    useEffect(()=>{
        const fetchData = async () => {
            try {
                await fetchLocations();
                if (latitude && longitude){
                    const response = await fetch(`${address}/weather?lat=${latitude}&lon=${longitude}`);
                    const weatherData = await response.json();
                    setWeatherData(weatherData);
                    setTemp(weatherData.main.temp);
                    setFeelsTemp(weatherData.main.feels_like);
                    setTemplow(weatherData.main.temp_min);
                    setTemphigh(weatherData.main.temp_max);
                    setIconUrl(`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`);
                    setAltUrl(weatherData.weather[0].description);
                    setWind(weatherData.wind.speed);
                } else{
                    console.log('Location data unavailable');
                }
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
        
        
    },[isLoading]);

    const fetchLocations = async ()=>{
        try {
          const response = await fetch(address+'/location-from-ip');
          if (!response.ok){
            throw new Error('Error fetching location');
          }
          const loc = await response.json();
          setCity(loc.city);
          setRegion(loc.region_code);
          setCountry(loc.country_code);
          setLatitude(loc.latitude);
          setLongitude(loc.longitude);
        } catch (error) {
          console.log(error);
        }
    }

    return(
        <>
            {isLoading ? <Loading /> : (
                <>
                    <h1>The temperature in {city}, {region} {country} is</h1>
                    <img src={iconUrl} alt={altUrl} />
                    <h1>{temp}° F</h1>
                    <h3>feels like {feelsTemp}° F</h3>
                    <h5>High: {temphigh}° F Low: {templow}° F</h5>
                    <h5>Wind speed: {wind} mph</h5>
                </>
            )}
            
        </>
    )
}
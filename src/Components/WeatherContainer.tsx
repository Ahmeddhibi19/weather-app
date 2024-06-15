import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import WeatherCard from './WeatherCard';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import axios from 'axios';
import { fetchWeatherApi } from 'openmeteo';

interface WeatherData {
    current: {
        time: Date;
        temperature2m: number;
        relativeHumidity2m: number;
        apparentTemperature: number;
        isDay: number;
        precipitation: number;
        rain: number;
        showers: number;
        snowfall: number;
        weatherCode: number;
        cloudCover: number;
        pressureMsl: number;
        surfacePressure: number;
        windSpeed10m: number;
        windDirection10m: number;
        windGusts10m: number;
    };
    daily: {
        time: Date[];
        weatherCode: number[];
        temperature2mMax: number[];
        temperature2mMin: number[];
        apparentTemperatureMax: number[];
        apparentTemperatureMin: number[];
        sunrise: number[];
        sunset: number[];
        daylightDuration: number[];
        sunshineDuration: number[];
        uvIndexMax: number[];
        uvIndexClearSkyMax: number[];
        precipitationSum: number[];
        rainSum: number[];
        showersSum: number[];
        snowfallSum: number[];
        precipitationHours: number[];
        precipitationProbabilityMax: number[];
        windSpeed10mMax: number[];
        windGusts10mMax: number[];
        windDirection10mDominant: number[];
        shortwaveRadiationSum: number[];
        et0FaoEvapotranspiration: number[];
    };
}


const WeatherContainer: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('tunis');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [unit, setUnit] = useState('celsius');
    const [city, setCity] = useState({ lat: '', lon: '' });
    const [cityname, setCityname] = useState('');
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const options = ['fahrenheit', 'celsius'];
    const [unitSymbole,setUnitSymbole]=useState('°C')
    const [weatherType,setWeatherType]=useState("")

    const handleSearch = async () => {
        console.log('Searching for:', searchTerm);
        await latlon(searchTerm);
        setCityname(searchTerm);
    };

    const getCurrentDate = (daysToAdd = 0): string => {
        const today = new Date();
        today.setDate(today.getDate() + daysToAdd);
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const today = getCurrentDate();
        const futureDate = getCurrentDate(10);
        setStartDate(today);
        setEndDate(futureDate);
        (async () => {
            await latlon("tunis");
        })().then(()=>{
            fetchWeatherData(city.lat, city.lon, unit, startDate, endDate);
        });
    }, []);

    useEffect(() => {
        if (city.lat && city.lon) {
            fetchWeatherData(city.lat, city.lon, unit, startDate, endDate);
        }
    }, [city, unit, startDate, endDate]);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setUnit(e.target.value);
        if(e.target.value==="celsius"){
            setUnitSymbole('°C')
        }else{
            setUnitSymbole('°F')
        }
        console.log(unit);
    };
    const latlon = async (name: string) => {
        try {
            const response = await axios.get(`https://geocode.maps.co/search?q=${name}&api_key=666c3f3e992ec864121708kxq991cc3`);
            const data = response.data[0];
            setCity({ lat: data.lat, lon: data.lon });
            console.log(city);
        } catch (error) {
            console.log(error);
        }
    };


    const fetchWeatherData = async (lat: string, lon: string, unit: string, startDate: string, endDate: string) => {
        const params: any = {
            "latitude": parseFloat(lat),
            "longitude": parseFloat(lon),
          "current": ["temperature_2m", "relative_humidity_2m", "apparent_temperature", "is_day", "precipitation", "rain", "showers", "snowfall", "weather_code", "cloud_cover", "pressure_msl", "surface_pressure", "wind_speed_10m", "wind_direction_10m", "wind_gusts_10m"],
	"daily": ["weather_code", "temperature_2m_max", "temperature_2m_min", "apparent_temperature_max", "apparent_temperature_min", "sunrise", "sunset", "daylight_duration", "sunshine_duration", "uv_index_max", "uv_index_clear_sky_max", "precipitation_sum", "rain_sum", "showers_sum", "snowfall_sum", "precipitation_hours", "precipitation_probability_max", "wind_speed_10m_max", "wind_gusts_10m_max", "wind_direction_10m_dominant", "shortwave_radiation_sum", "et0_fao_evapotranspiration"],
	"timezone": "auto",
            "start_date":startDate,
            "end_date": endDate,
        };

        if (unit === "fahrenheit") {
            params.temperature_unit = "fahrenheit";
        }
 
        const url = "https://api.open-meteo.com/v1/forecast";
        const responses = await fetchWeatherApi(url, params);
        
        // Helper function to form time ranges
        const range = (start: number, stop: number, step: number) =>
            Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
        
        // Process first location. Add a for-loop for multiple locations or weather models
        const response = responses[0];
        
        // Attributes for timezone and location
        const utcOffsetSeconds = response.utcOffsetSeconds();
        const timezone = response.timezone();
        const timezoneAbbreviation = response.timezoneAbbreviation();
        const latitude = response.latitude();
        const longitude = response.longitude();
        
        const current = response.current()!;
        const daily = response.daily()!;
        
        // Note: The order of weather variables in the URL query and the indices below need to match!
        const weatherData = {
            current: {
                time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
                temperature2m: current.variables(0)!.value(),
                relativeHumidity2m: current.variables(1)!.value(),
                apparentTemperature: current.variables(2)!.value(),
                isDay: current.variables(3)!.value(),
                precipitation: current.variables(4)!.value(),
                rain: current.variables(5)!.value(),
                showers: current.variables(6)!.value(),
                snowfall: current.variables(7)!.value(),
                weatherCode: current.variables(8)!.value(),
                cloudCover: current.variables(9)!.value(),
                pressureMsl: current.variables(10)!.value(),
                surfacePressure: current.variables(11)!.value(),
                windSpeed10m: current.variables(12)!.value(),
                windDirection10m: current.variables(13)!.value(),
                windGusts10m: current.variables(14)!.value(),
            },
            daily: {
                time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
                    (t) => new Date((t + utcOffsetSeconds) * 1000)
                ),
                weatherCode: Array.from(daily.variables(0)!.valuesArray() ??[] ),
                temperature2mMax: Array.from(daily.variables(1)!.valuesArray()??[]),
                temperature2mMin: Array.from(daily.variables(2)!.valuesArray()??[]),
                apparentTemperatureMax: Array.from(daily.variables(3)!.valuesArray()??[]),
                apparentTemperatureMin: Array.from(daily.variables(4)!.valuesArray()??[]),
                sunrise: Array.from(daily.variables(5)!.valuesArray()??[]),
                sunset: Array.from(daily.variables(6)!.valuesArray()??[]),
                daylightDuration: Array.from(daily.variables(7)!.valuesArray() ??[]),
                sunshineDuration: Array.from(daily.variables(8)!.valuesArray()??[]),
                uvIndexMax: Array.from(daily.variables(9)!.valuesArray() ??[]),
                uvIndexClearSkyMax: Array.from(daily.variables(10)!.valuesArray() ??[]),
                precipitationSum: Array.from(daily.variables(11)!.valuesArray() ??[]),
                rainSum: Array.from(daily.variables(12)!.valuesArray() ??[] ??[]),
                showersSum: Array.from(daily.variables(13)!.valuesArray()??[]),
                snowfallSum: Array.from(daily.variables(14)!.valuesArray()??[]),
                precipitationHours: Array.from(daily.variables(15)!.valuesArray()??[]),
                precipitationProbabilityMax: Array.from(daily.variables(16)!.valuesArray()??[]),
                windSpeed10mMax: Array.from(daily.variables(17)!.valuesArray()??[]),
                windGusts10mMax: Array.from(daily.variables(18)!.valuesArray()??[]),
                windDirection10mDominant: Array.from(daily.variables(19)!.valuesArray()??[]),
                shortwaveRadiationSum: Array.from(daily.variables(20)!.valuesArray()??[]),
                et0FaoEvapotranspiration: Array.from(daily.variables(21)!.valuesArray()??[]),
            },
        
        };
        setWeatherData(weatherData);
        
        // `weatherData` now contains a simple structure with arrays for datetime and weather data
       /* for (let i = 0; i < weatherData.daily.time.length; i++) {
            console.log(
                weatherData.daily.time[i].toISOString(),
                weatherData.daily.weatherCode[i],
                weatherData.daily.temperature2mMax[i],
                weatherData.daily.temperature2mMin[i],
                weatherData.daily.apparentTemperatureMax[i],
                weatherData.daily.apparentTemperatureMin[i],
                weatherData.daily.sunrise[i],
                weatherData.daily.sunset[i],
                weatherData.daily.daylightDuration[i],
                weatherData.daily.sunshineDuration[i],
                weatherData.daily.uvIndexMax[i],
                weatherData.daily.uvIndexClearSkyMax[i],
                weatherData.daily.precipitationSum[i],
                weatherData.daily.rainSum[i],
                weatherData.daily.showersSum[i],
                weatherData.daily.snowfallSum[i],
                weatherData.daily.precipitationHours[i],
                weatherData.daily.precipitationProbabilityMax[i],
                weatherData.daily.windSpeed10mMax[i],
                weatherData.daily.windGusts10mMax[i],
                weatherData.daily.windDirection10mDominant[i],
                weatherData.daily.shortwaveRadiationSum[i],
                weatherData.daily.et0FaoEvapotranspiration[i]
            );
        }*/
       
       console.log(weatherData)

    };

    useEffect(()=>{fetchWeatherData(eval(city.lat),eval(city.lon),unit,startDate,endDate)},[city,unit,startDate,endDate])
    

    return (
        <div className='h-screen lg:h-[500px] flex flex-col justify-start items-start shadow-xl rounded-md bg-[#EEEEEE] bg-opacity-70 px-3'>
            <div className='w-full h-auto flex flex-col justify-start items-start lg:flex-row lg:justify-around lg:items-start mb-4'>
                <div className="p-d-flex p-ai-center p-jc-center" style={{ gap: '3rem', padding: '1rem' }}>
                    <span className="p-input-icon-left px-2 w-[150px]">
                        <i className="pi pi-search text-gray-400" />
                        <InputText
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search city"
                            className='pl-5'
                        />
                    </span>
                    <Button
                        label="Search"
                        icon="pi pi-search"
                        onClick={handleSearch}
                        className='ml-16 text-gray-600 hover:text-white hover:bg-gray-600 px-2 '
                    />
                </div>
                <div className='w-[300px] lg:w-[500px] flex flex-row justify-between lg:py-4 ml-4'>
                    <div>
                        <span className='text-gray-600 font-bold'>start date :</span>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <span className='text-gray-600 font-bold'>end date :</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="selection" className='text-gray-600 font-bold ml-6'>Unit:</label>
                    <select
                        id="selection"
                        value={unit}
                        onChange={handleSelectChange}
                        className="px-2 border border-gray-300 rounded-md mt-4"
                    >
                        <option value="">Select an option</option>
                        {options.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className='w-full flex justify-center items-center'>
                <div className='w-auto lg:w-[500px] h-[400px]'>
                    <Splide
                        options={{
                            perPage: 1,
                            gap: "0.2rem",
                            drag: true, // Disable dragging for a smoother experience
                        }}
                        className='flex items-center justify-center'
                    >
                        {weatherData !=null?(
                             weatherData.daily.time.map((_, index) =>{
                                
                                return (
                                    (
                                        <SplideSlide key={index}>
                                            <div className='w-full flex justify-center items-center'>
                                                <WeatherCard 
                                                date={weatherData.daily.time[index].toLocaleDateString('en-US', {
                                                    weekday: 'short', // Short weekday name (e.g., "Sat")
                                                    month: 'short',   // Short month name (e.g., "Jun")
                                                    day: 'numeric',   // Day of the month (e.g., "15")
                                                    year: 'numeric'   // Full year (e.g., "2024")
                                                  })}
                                                cityName={cityname}
                                                degree={Math.round(weatherData.daily.temperature2mMax[index]+weatherData.daily.temperature2mMin[index])/2}
                                                uvIndex={weatherData.daily.uvIndexMax[index]}
                                                windSpeed={weatherData.daily.windSpeed10mMax[index]}
                                                percipitation={weatherData.daily.precipitationSum[index]}
                                                iconName={
                                                    weatherData.daily.precipitationSum[index] !== 0 ? 'Rain':(
                                                        weatherData.daily.precipitationProbabilityMax[index] !== 0 ?'Clouds':(
                                                            weatherData.daily.windSpeed10mMax[index]>=20? 'Windy':'Clear'

                                                        )
                                                    )
                                                }
                                                unitSymbole={unitSymbole}
                                                />
                                            </div>
                                        </SplideSlide>
                                    )

                                )
                            } )
                        ):(
                            <p>Loading..</p>
                        )
                       }
                    </Splide>
                </div>
            </div>
        </div>
    );
};

export default WeatherContainer;

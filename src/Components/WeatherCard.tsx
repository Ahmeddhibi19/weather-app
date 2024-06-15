import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloud, faWind, faCloudRain, faSun, faCloudSun } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-common-types'; // Import this for TypeScript definitions
import { SizeProp } from '@fortawesome/fontawesome-svg-core'; // Import this for FontAwesome size prop

import axios from "axios";
interface Props {
    icon: IconDefinition;
    size?: SizeProp;
}
interface Weather {
    date: string;
    cityName: string;
    iconName: string;
    degree: number;
    uvIndex: number;
    windSpeed: number;
    percipitation: number;
    unitSymbole: string;

}
const WeatherIcon: React.FC<Props> = ({ icon, size = '1x' }) => {
    return (
        <div>
            <FontAwesomeIcon icon={icon} size={size} />
        </div>
    );
};
const WeatherCard: React.FC<Weather> = ({ date, cityName, iconName, degree, uvIndex, windSpeed, percipitation, unitSymbole }) => {

    const iconChanger = (weather: string) => {
        let iconElement: React.ReactNode;
        let iconColor: string;

        switch (weather) {
            case "Rain":
                iconElement = <WeatherIcon icon={faCloudRain} size="6x" />;
                iconColor = "#272829";
                break;

            case "Clear":
                iconElement = <WeatherIcon icon={faSun} size="6x" />;
                iconColor = "#FFC436";
                break;
            case "Clouds":
                iconElement = <WeatherIcon icon={faCloud} size="6x" />;
                iconColor = "#102C57";
                break;

            case "Windy":
                iconElement = <WeatherIcon icon={faWind} size="6x" />;
                iconColor = "#279EFF";
                break;
            default:
                iconElement = <WeatherIcon icon={faCloudSun} size="6x" />;
                iconColor = "#7B2869";
        }

        return (
            <span className="icon" style={{ color: iconColor }}>
                {iconElement}
            </span>
        );
    };

    return (
        <div className="w-full lg:w-[300px] h-[400px] lg:h-[400px] bg-slate-50 bg-opacity-40 rounded-md  ml-2 shadow-lg flex flex-col justify-start items-center mt-2">
            <span className="mt-4 text-[20px]">{date}</span>
            <span className="mt-4 text-[30px] font-bold txt">{cityName}</span>
            {
                iconChanger(iconName)
            }
            <span className="mt-4 text-[40px] font-bold txt">{degree.toString()}<span>{unitSymbole}</span></span >
            <div className="w-full h-[40px] flex flex-row justify-between px-2 mt-5 ">
                <div className="w-[30%] flex flex-col items-center">
                    <span className="text-[15px] font-bold">uvIndex</span>
                    <span className="text-[20px] font-bold">{Math.round(uvIndex).toString()} index</span>
                </div>
                <div className="w-[40%] flex flex-col items-center">
                    <span className="text-[15px] font-bold">wind speed</span>
                    <span className="text-[20px] font-bold">{Math.round(windSpeed).toString()} km/h</span>
                </div>
                <div className="w-[30%] flex flex-col items-center">
                    <span className="text-[15px] font-bold">percipitation</span>
                    <span className="text-[20px] font-bold">{percipitation.toFixed(2).toString()} mm</span>                </div>
            </div>
        </div>
    );
}


export default WeatherCard
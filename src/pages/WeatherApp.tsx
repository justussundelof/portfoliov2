// WeatherApp.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, MapPin, ArrowLeft, Cloud, Sun, CloudRain } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

const API_KEY = '92fb1c9b29f94275bf1111206251809'; // Replace with your WeatherAPI key

interface WeatherData {
    city: string;
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    icon: string;
}

interface ForecastData {
    date: string;
    temperature: number;
    condition: string;
}

const WeatherApp = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [forecast, setForecast] = useState<ForecastData[]>([]);
    const [loading, setLoading] = useState(false);

    const getWeatherIcon = (condition: string) => {
        switch (condition.toLowerCase()) {
            case 'clear':
                return <Sun className="w-16 h-16 text-yellow-500" />;
            case 'rain':
            case 'drizzle':
                return <CloudRain className="w-16 h-16 text-blue-500" />;
            case 'clouds':
                return <Cloud className="w-16 h-16 text-gray-500" />;
            default:
                return <Cloud className="w-16 h-16 text-gray-500" />;
        }
    };

    const getBackground = (condition?: string) => {
        if (!condition) return 'bg-white/50';
        switch (condition.toLowerCase()) {
            case 'clear': return 'bg-yellow-100';
            case 'rain': return 'bg-blue-200';
            case 'clouds': return 'bg-gray-200';
            default: return 'bg-white/50';
        }
    };

    const getWeather = async () => {
        if (!city) return;
        setLoading(true);
        setWeather(null);
        setForecast([]);

        try {
            // Fetch current weather
            const weatherRes = await fetch(
                `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`
            );
            if (!weatherRes.ok) throw new Error('City not found');
            const data = await weatherRes.json();

            const weatherData: WeatherData = {
                city: data.location.name,
                temperature: Math.round(data.current.temp_c),
                condition: data.current.condition.text,
                humidity: data.current.humidity,
                windSpeed: data.current.wind_kph,
                icon: data.current.condition.text
            };
            setWeather(weatherData);

            // Fetch 3-day forecast
            const forecastRes = await fetch(
                `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3`
            );
            const forecastData = await forecastRes.json();

            const forecastArr: ForecastData[] = forecastData.forecast.forecastday.map((f: any) => ({
                date: new Date(f.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                temperature: Math.round(f.day.avgtemp_c),
                condition: f.day.condition.text
            }));

            setForecast(forecastArr);

        } catch (error) {
            console.error(error);
            alert('Could not fetch weather. Please check the city name.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen ${getBackground(weather?.condition)} text-studio-dark`}>
            <div className="max-w-4xl mx-auto px-gutter py-24">
                <div className="mb-12">
                    <RouterLink to="/" className="inline-flex items-center gap-2 text-studio-muted hover:text-studio-dark transition-colors mb-8">
                        <ArrowLeft className="w-4 h-4" />
                        Tillbaka
                    </RouterLink>
                    <h1 className="font-serif text-5xl lg:text-7xl mb-6">Väder-App</h1>
                    <p className="text-xl text-studio-muted max-w-2xl">
                        Få en uppdaterad väderrapport!
                    </p>
                </div>

                <Card className="mb-12 border-studio-border bg-white/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            Sök väderrapport
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-4">
                            <Input
                                placeholder="Ange stad..."
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="flex-1"
                                onKeyPress={(e) => e.key === 'Enter' && getWeather()}
                            />
                            <Button onClick={getWeather} disabled={!city || loading}>
                                <Search className="w-4 h-4 mr-2" />
                                {loading ? 'Searching...' : 'Search'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {weather && (
                    <Card className="border-studio-border bg-white/50 backdrop-blur-sm mb-12">
                        <CardContent className="p-8">
                            <div className="text-center space-y-6">
                                <div className="flex justify-center">
                                    {getWeatherIcon(weather.icon)}
                                </div>

                                <div>
                                    <h2 className="text-3xl font-serif mb-2">{weather.city}</h2>
                                    <p className="text-6xl font-light text-studio-light mb-2">{weather.temperature}°C</p>
                                    <p className="text-xl text-studio-muted">{weather.condition}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-8 pt-6 border-t border-studio-border">
                                    <div className="text-center">
                                        <p className="text-sm text-studio-muted mb-1">Humidity</p>
                                        <p className="text-2xl font-light">{weather.humidity}%</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-studio-muted mb-1">Wind Speed</p>
                                        <p className="text-2xl font-light">{weather.windSpeed} km/h</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {forecast.length > 0 && (
                    <Card className="border-studio-border bg-white/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>3-Day Forecast</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-around">
                            {forecast.map((f) => (
                                <div key={f.date} className="text-center">
                                    <p className="text-sm text-studio-muted mb-1">{f.date}</p>
                                    {getWeatherIcon(f.condition)}
                                    <p className="text-xl font-light mt-1">{f.temperature}°C</p>
                                    <p className="text-sm text-studio-muted">{f.condition}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default WeatherApp;

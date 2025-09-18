import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, Square, ArrowLeft, Volume2 } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

const BeatMaker = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [bpm, setBpm] = useState(120);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const [patterns, setPatterns] = useState({
        kick: Array(16).fill(false),
        snare: Array(16).fill(false),
        hihat: Array(16).fill(false),
        openhat: Array(16).fill(false),
    });

    const tracks = [
        { name: 'Kick', key: 'kick', color: 'bg-red-500' },
        { name: 'Snare', key: 'snare', color: 'bg-blue-500' },
        { name: 'Hi-Hat', key: 'hihat', color: 'bg-green-500' },
        { name: 'Open Hat', key: 'openhat', color: 'bg-yellow-500' },
    ];

    // Load sounds
    const sounds: Record<string, HTMLAudioElement> = {
        kick: new Audio('/samples/kick.wav'),
        snare: new Audio('/samples/snare.wav'),
        hihat: new Audio('/samples/hihat.wav'),
        openhat: new Audio('/samples/openhat.wav'),
    };

    const playSound = (trackKey: string) => {
        const sound = sounds[trackKey];
        if (sound) {
            const audioClone = sound.cloneNode() as HTMLAudioElement;
            audioClone.play();
        }
    };

    const toggleStep = (track: string, step: number) => {
        setPatterns(prev => ({
            ...prev,
            [track]: prev[track as keyof typeof prev].map((active, index) =>
                index === step ? !active : active
            )
        }));
    };

    const play = () => {
        if (isPlaying) return;

        setIsPlaying(true);
        const stepDuration = (60 / bpm / 4) * 1000; // 16th notes

        intervalRef.current = setInterval(() => {
            setCurrentStep(prev => {
                const nextStep = (prev + 1) % 16;

                // Play sounds for active steps
                tracks.forEach(track => {
                    if (patterns[track.key as keyof typeof patterns][nextStep]) {
                        playSound(track.key);
                    }
                });

                return nextStep;
            });
        }, stepDuration);
    };

    const pause = () => {
        setIsPlaying(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    const stop = () => {
        setIsPlaying(false);
        setCurrentStep(0);
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    const clearAll = () => {
        setPatterns({
            kick: Array(16).fill(false),
            snare: Array(16).fill(false),
            hihat: Array(16).fill(false),
            openhat: Array(16).fill(false),
        });
    };

    return (
        <div className="min-h-screen bg-studio-dark text-studio-light">
            <div className="max-w-6xl mx-auto px-gutter py-24">
                <div className="mb-12">
                    <RouterLink to="/" className="inline-flex items-center gap-2 text-studio-muted hover:text-studio-light transition-colors mb-8">
                        <ArrowLeft className="w-4 h-4" />
                        Tillbaka
                    </RouterLink>
                    <h1 className="font-serif text-5xl lg:text-7xl mb-6">Beat Maker</h1>
                    <p className="text-xl text-studio-muted max-w-2xl">
                        Skapa enkla beats med min webb drum sequencer                     </p>
                </div>

                {/* Transport Controls */}
                <Card className="mb-8 border-studio-border bg-studio-light/5 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-studio-light">
                            <Volume2 className="w-5 h-5" />
                            Transport Controls
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-4 items-center">
                            <Button
                                onClick={isPlaying ? pause : play}
                                variant="outline"
                                className="border-studio-accent text-studio-light hover:bg-studio-accent hover:text-studio-dark"
                            >
                                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </Button>
                            <Button
                                onClick={stop}
                                variant="outline"
                                className="border-studio-accent text-studio-light hover:bg-studio-accent hover:text-studio-dark"
                            >
                                <Square className="w-4 h-4" />
                            </Button>
                            <Button
                                onClick={clearAll}
                                variant="ghost"
                                className="text-studio-muted hover:text-studio-light"
                            >
                                Börja om
                            </Button>
                            <div className="flex items-center gap-2 ml-auto">
                                <span className="text-sm text-studio-muted">BPM:</span>
                                <input
                                    type="range"
                                    min="60"
                                    max="180"
                                    value={bpm}
                                    onChange={(e) => setBpm(Number(e.target.value))}
                                    className="w-24"
                                />
                                <span className="text-sm text-studio-light w-12">{bpm}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Pattern Sequencer */}
                <Card className="border-studio-border bg-studio-light/5 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-studio-light">Pattern Sequencer</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Step indicators */}
                        <div className="flex gap-1 mb-4 pl-20">
                            {Array(16).fill(0).map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-8 h-6 flex items-center justify-center text-xs border ${currentStep === index && isPlaying
                                        ? 'bg-studio-accent text-studio-dark border-studio-accent'
                                        : 'bg-studio-light/10 text-studio-muted border-studio-border'
                                        } ${index % 4 === 0 ? 'font-bold' : ''}`}
                                >
                                    {index + 1}
                                </div>
                            ))}
                        </div>

                        {/* Pattern grid */}
                        {tracks.map((track) => (
                            <div key={track.key} className="flex items-center gap-1">
                                <div className="w-16 text-sm text-studio-light font-medium">
                                    {track.name}
                                </div>
                                <div className={`w-3 h-3 rounded-full ${track.color} mr-1`} />
                                {patterns[track.key as keyof typeof patterns].map((active, index) => (
                                    <button
                                        key={index}
                                        onClick={() => toggleStep(track.key, index)}
                                        className={`w-8 h-8 border transition-all ${active
                                            ? `${track.color} border-transparent`
                                            : 'bg-studio-light/10 border-studio-border hover:bg-studio-light/20'
                                            } ${currentStep === index && isPlaying ? 'ring-2 ring-studio-accent' : ''}`}
                                    />
                                ))}
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="mt-8 text-center">
                    <p className="text-studio-muted text-sm">
                        Glöm inte att stoppa starta mellan ändringar!                    </p>
                </div>
            </div>
        </div>
    );
};

export default BeatMaker;

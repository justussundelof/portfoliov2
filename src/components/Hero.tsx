import { useEffect, useRef } from 'react';

const Hero = () => {
    const heroRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (heroRef.current) {
            const elements = heroRef.current.querySelectorAll('.fade-in');
            elements.forEach((el) => observer.observe(el));
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section ref={heroRef} className="min-h-screen flex items-center justify-center bg-studio-accent relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-current"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-current"></div>
            </div>

            <div className="container-studio relative z-10">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="fade-in" style={{ animationDelay: '0.1s' }}>
                        <h1 className="text-display mb-8">
                            Student inom
                            <br />
                            <span className="italic">Frontendutveckling</span>
                        </h1>
                    </div>

                    <div className="fade-in" style={{ animationDelay: '0.3s' }}>
                        <p className="text-body-large max-w-2xl mx-auto mb-12 text-studio-accent-foreground/80">
                            Kolla gärna in några av mina projekt :)
                        </p>
                    </div>

                    <div className="fade-in flex flex-col sm:flex-row gap-6 justify-center" style={{ animationDelay: '0.5s' }}>
                        {/* <button className="btn-primary">
                            View Our Work
                        </button> */}
                        {/* <button className="btn-outline">
                            Start a Project
                        </button> */}
                        <button
                            className="btn-primary"
                            onClick={() => {
                                const el = document.getElementById('selected-works');
                                if (el) {
                                    el.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                        >
                            Mina projekt
                        </button>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 fade-in" style={{ animationDelay: '0.7s' }}>
                <div className="flex flex-col items-center space-y-2">
                    <span className="text-caption text-studio-accent-foreground/60"></span>
                    {/* <div className="w-px h-12 bg-studio-accent-foreground/30"></div> */}
                </div>
            </div>
        </section>
    );
};

export default Hero;
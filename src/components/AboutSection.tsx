import { useEffect, useRef } from 'react';
import portraitPic from '../images/IMG_2396.jpg';




const AboutSection = () => {
    const sectionRef = useRef<HTMLElement>(null);

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

        if (sectionRef.current) {
            const elements = sectionRef.current.querySelectorAll('.fade-in');
            elements.forEach((el) => observer.observe(el));
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="section-padding bg-gray-50">
            <div className="container-studio">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
                    <div className="lg:col-span-5 fade-in">
                        {/*  <h2 className="text-headline mb-8">
                            Som nyfiken soon to be
                            <span className="italic"> frontendutvecklare </span>
                            tror jag på
                        </h2> */}
                        {/* <div className="lg:col-span-5 fade-in">
                            <img
                                src="/images/IMG_2396.JPG"
                                alt="Frontend utvecklare pic"
                                className="w-full h-auto rounded-2xl shadow-lg"
                            />
                        </div> */}
                        <div className="lg:col-span-5 fade-in">
                            <img
                                src={portraitPic} // <-- Vite-bundled image
                                alt="Frontend utvecklare pic"
                                className="w-full h-auto rounded-2xl shadow-lg"
                            />
                        </div>

                    </div>

                    <div className="lg:col-span-7 space-y-8">
                        <div className="fade-in" style={{ animationDelay: '0.2s' }}>
                            <p className="text-body-large leading-relaxed text-muted-foreground">
                                Som student inom frontendutveckling vill jag kombinera teknik och design för att skapa digitala upplevelser som både engagerar och är användarvänliga. Varje projekt är för mig en chans att lära, utforska och utvecklas.
                            </p>
                        </div>

                        <div className="fade-in grid sm:grid-cols-2 gap-8" style={{ animationDelay: '0.4s' }}>
                            <div>
                                <h3 className="text-subtitle mb-4">Lärande</h3>
                                <p className="text-body text-muted-foreground">
                                    Jag är nyfiken och försöker hela tiden hitta smartare sätt att lösa problem och utveckla mina färdigheter.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-subtitle mb-4">Design</h3>
                                <p className="text-body text-muted-foreground">
                                    Jag gillar att skapa gränssnitt som är tydliga, tillgängliga och estetiskt tilltalande.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-subtitle mb-4">Teknik</h3>
                                <p className="text-body text-muted-foreground">
                                    Jag lär mig moderna verktyg och ramverk, och tycker det är roligt att se hur idéer växer fram i kod.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-subtitle mb-4">Sammarbete</h3>
                                <p className="text-body text-muted-foreground">
                                    Jag trivs med att jobba tillsammans med andra och tycker att bra kommunikation gör arbetet både roligare och bättre.
                                </p>
                            </div>
                        </div>

                        <div className="fade-in pt-8" style={{ animationDelay: '0.6s' }}>

                            <div className="fade-in pt-8" style={{ animationDelay: '0.6s' }}>
                                <button
                                    className="btn-primary"
                                    onClick={() => {
                                        const el = document.getElementById('contact');
                                        if (el) {
                                            el.scrollIntoView({ behavior: 'smooth' });
                                        }
                                    }}
                                >
                                    Snacka?
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
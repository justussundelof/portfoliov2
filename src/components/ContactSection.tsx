import { useEffect, useRef } from 'react';

const ContactSection = () => {
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
        <section id="contact" ref={sectionRef} className="section-padding bg-background">
            <div className="container-studio">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="fade-in mb-12">
                        <h2 className="text-headline mb-6">
                            Låt oss skapa något
                            <span className="italic"> </span> tillsammans
                        </h2>
                        <p className="text-body-large text-muted-foreground max-w-2xl mx-auto">
                            Som student på Chas Academy söker jag nu LIA från och med 17e november. Tveka inte på att höra av er om ni vill diskutera hur jag kan bidra till erat team!
                        </p>
                    </div>

                    <div className="fade-in grid md:grid-cols-2 gap-8 mb-12" style={{ animationDelay: '0.2s' }}>
                        <div className="text-left space-y-4">
                            {/* <h3 className="text-subtitle">LIA</h3>
                            <p className="text-body text-muted-foreground">
                                Som student på Chas Academy söker jag nu LIA från och med 17e november. Tveka inte på att höra av er om ni vill diskutera hur jag kan bidra till erat team!
                            </p> */}
                            {/*  <a href="https://github.com/justussundelof" className="nav-link text-lg">
                                github.com/justussundelof
                            </a> */}
                        </div>

                        <div className="text-left space-y-4">
                            {/* <h3 className="text-subtitle">General Inquiries</h3>
                            <p className="text-body text-muted-foreground">
                                Questions about our services or want to learn more about our process?
                            </p> */}
                            {/*   <a href="https://linkedin.com/in/justus-sundelöf-62a97020b" className="nav-link text-lg">
                                LinkedIn
                            </a> */}
                        </div>
                    </div>

                    <div className="fade-in" style={{ animationDelay: '0.4s' }}>
                        <div className="fade-in" style={{ animationDelay: '0.4s' }}>
                            <a
                                href="mailto:justus@sundelof.se"
                                className="btn-primary text-lg px-12 py-6 "

                            >
                                Maila mig!
                            </a>
                        </div>
                        {/* <button className="btn-primary text-lg px-12 py-6">
                            Maila mig!
                        </button> */}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
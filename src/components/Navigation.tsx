import { useState, useEffect } from 'react';

const Navigation = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur-md border-b border-border' : 'bg-transparent'
            }`}>
            <div className="container-studio">
                <div className="flex items-center justify-between py-6">
                    {/* Logo */}
                    <div className="text-headline font-serif">
                        Justus Sundelöf
                    </div>

                    {/* Menu Button */}
                    {/* <button className="flex flex-col items-end space-y-1 group">
                        <span className="text-caption tracking-wider">Menu</span>
                        <div className="flex flex-col space-y-1">
                            <div className="w-6 h-px bg-current transition-all duration-300 group-hover:w-8"></div>
                            <div className="w-4 h-px bg-current transition-all duration-300 group-hover:w-8"></div>
                        </div>
                    </button> */}
                    {/* <div style={{ animationDelay: '0.7s' }}>
                        <a
                            href="/CV-justus-sundelof.pdf"
                            download
                            className="bg-blue-500 text-white text-lg px-6 py-3 rounded"

                        >
                            CV
                        </a>
                    </div> */}
                    <div style={{ animationDelay: '0.7s' }}>
                        <a
                            href="/CV-justus-sundelof.pdf"
                            download
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-studio-light text-studio-light bg-transparent 
               hover:bg-black hover:text-white transition-colors font-medium"
                            title="Ladda ner CV"
                        >
                            <svg
                                width="20"
                                height="20"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 16v-8M12 16l-4-4M12 16l4-4M4 20h16" />
                            </svg>
                            CV
                        </a>
                        {/* <a
                            href="/CV-justus-sundelof.pdf"
                            download
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-studio-light text-studio-light bg-transparent hover:bg-studio-light hover:text-white transition-colors font-medium"
                            title="Ladda ner CV"
                        >
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M12 16v-8M12 16l-4-4M12 16l4-4M4 20h16" />
                            </svg>
                            CV
                        </a> */}
                    </div>
                </div>
            </div>

        </nav>
    );
};

export default Navigation;
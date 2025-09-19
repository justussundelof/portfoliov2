import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Importera bilder direkt (Vite kräver det)
import urlImg from '../images/url.jpg';
import weatherImg from '../images/weather.jpg';
import recipeImg from '../images/recipe.jpg';
import beatImg from '../images/beat.jpg';

interface Project {
    id: string;
    title: string;
    client?: string;
    year?: string;
    category?: string;
    image: string;
    description: string;
    link: string;
}

const projects: Project[] = [
    {
        id: 'APP01',
        title: 'URL tool',
        client: 'TypeScript, Serverless Backend med Upstash Redis',
        year: '2024',
        category: 'TypeScript, Serverless API',
        image: urlImg,
        description: 'Gör om URLer till dina egna!',
        link: '/url-shortener',
    },
    {
        id: 'APP02',
        title: 'Väderet',
        category: 'API hantering',
        client: 'API fetching',
        image: weatherImg,
        description: 'Tydlig och enkel väderapp',
        link: '/weather-app',
    },
    {
        id: 'APP03',
        title: 'Receptsök',
        client: 'API fetching och visning av data',
        year: '2024',
        category: 'Search & Discovery',
        image: recipeImg,
        description: 'Hitta dina favoritrecept med vackra kort och detaljerade matlagningsinstruktioner.',
        link: '/recipe-finder',
    },
    {
        id: 'APP04',
        title: 'Beat Maker',
        client: 'Ljud, State Management',
        year: '2024',
        category: 'Creative Suite',
        image: beatImg,
        description: 'Simpel drum machine för att skapa beats direkt i webbläsaren.',
        link: '/beat-maker',
    },
];

const WorkSection: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

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

        const elements = sectionRef.current.querySelectorAll('.fade-in');
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <section id="selected-works" ref={sectionRef} className="section-padding bg-background">
            <div className="container-studio">
                <div className="fade-in mb-16">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                        <div>
                            <h2 className="text-headline mb-4">Projekt</h2>
                            <p className="text-body-large max-w-2xl text-muted-foreground">
                                Några av mina senaste projekt inom frontendutveckling.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-8 lg:gap-12">
                    {projects.map((project, index) => (
                        <div
                            key={project.id}
                            className="fade-in project-card group"
                            style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                        >
                            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                                <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                                    <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                                        <img src={project.image} alt={project.title} className="project-image" />
                                    </div>
                                </div>

                                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''} space-y-6`}>
                                    <Link to={project.link} className="nav-link">
                                        <h3 className="text-title">{project.title}</h3>
                                    </Link>
                                    {project.client && (
                                        <p className="text-sm text-muted-foreground">{project.client}</p>
                                    )}
                                    <p className="text-body text-muted-foreground leading-relaxed">{project.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WorkSection;

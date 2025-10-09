import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Clock, Users, ArrowLeft } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

const API_KEY = '54c2fbc0e2f54adb97e3d662a11b0abc'; // Replace with your API key
const API_URL = 'https://api.spoonacular.com/recipes/complexSearch';

interface Recipe {
    id: number;
    title: string;
    image: string;
    readyInMinutes: number;
    servings: number;
    summary?: string;
}

const RecipeFinder = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(false);

    const searchRecipes = async () => {
        if (!searchTerm) return;

        setLoading(true);
        try {
            const response = await fetch(
                `${API_URL}?query=${encodeURIComponent(searchTerm)}&number=12&apiKey=${API_KEY}&addRecipeInformation=true`
            );
            const data = await response.json();
            setRecipes(data.results || []);
        } catch (error) {
            console.error('Error fetching recipes:', error);
            setRecipes([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-studio-light text-studio-dark">
            <div className="max-w-6xl mx-auto px-gutter py-24">
                <div className="mb-12">
                    <RouterLink
                        to="/"
                        className="inline-flex items-center gap-2 text-studio-muted hover:text-studio-dark transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Tillbaka
                    </RouterLink>
                    <h1 className="font-serif text-5xl lg:text-7xl mb-6">Receptsök</h1>
                    <p className="text-xl text-studio-muted max-w-2xl">
                        Upptäck nya recept! (Engelska söktermer)                    </p>
                </div>

                <Card className="mb-12 border-studio-border bg-white/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="w-5 h-5" />
                            Sök
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-4">
                            <Input
                                placeholder="Sök på ingridiens eller rätt"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1"
                                onKeyPress={(e) => e.key === 'Enter' && searchRecipes()}
                            />
                            <Button onClick={searchRecipes} disabled={!searchTerm || loading}>
                                <Search className="w-4 h-4 mr-2" />
                                {loading ? 'Söker...' : 'Sök'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {recipes.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recipes.map((recipe) => (
                            <Card
                                key={recipe.id}
                                className="border-studio-border bg-white/50 backdrop-blur-sm hover:shadow-lg transition-shadow overflow-hidden"
                            >
                                <div className="aspect-video flex items-center justify-center">
                                    <img src={recipe.image} alt={recipe.title} className="object-cover w-full h-full" />
                                </div>
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-xl">{recipe.title}</CardTitle>
                                    <p
                                        className="text-studio-muted text-sm"
                                        dangerouslySetInnerHTML={{ __html: recipe.summary?.slice(0, 100) + '...' }}
                                    />
                                </CardHeader>
                                <CardContent className="pt-0 space-y-4">
                                    <div className="flex items-center gap-4 text-sm text-studio-muted">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {recipe.readyInMinutes} min
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            {recipe.servings} port.
                                        </div>
                                    </div>

                                    <Button variant="outline" className="w-full" asChild>
                                        <a href={`https://spoonacular.com/recipes/${recipe.title.replace(/\s/g, '-')}-${recipe.id}`} target="_blank">
                                            Visa
                                        </a>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecipeFinder;

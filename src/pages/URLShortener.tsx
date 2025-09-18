import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Link, ArrowLeft, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link as RouterLink } from 'react-router-dom';

type ShortUrl = { original: string; short: string; id: string };

const API_BASE = '/api'; // Vercel serverless API

const URLShortener = () => {
    const [url, setUrl] = useState('');
    const [shortUrls, setShortUrls] = useState<ShortUrl[]>([]);
    const { toast } = useToast();

    const generateShortUrl = async () => {
        if (!url) return;

        try {
            const res = await fetch(API_BASE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ originalUrl: url }),
            });
            const data: ShortUrl = await res.json();
            setShortUrls(prev => [...prev, data]);
            setUrl('');
            toast({ title: 'URL Skapad!', description: 'Din nya URL är skapd.' });
        } catch (err) {
            console.error(err);
            toast({ title: 'Fel', description: 'Kunde inte skapa URL' });
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: 'Kopierad!', description: 'URL kopierad.' });
    };

    return (
        <div className="min-h-screen bg-studio-light text-studio-dark">
            <div className="max-w-4xl mx-auto px-gutter py-24">
                <div className="mb-12">
                    <RouterLink to="/" className="inline-flex items-center gap-2 text-studio-muted hover:text-studio-dark transition-colors mb-8">
                        <ArrowLeft className="w-4 h-4" />
                        Tillbaka
                    </RouterLink>
                    <h1 className="font-serif text-5xl lg:text-7xl mb-6">URL Tool</h1>
                    <p className="text-xl text-studio-muted max-w-2xl">
                        Förvandla dina URLer till en mycket kortare (förutsatt att appen är deployad på en kort domän)                     </p>
                </div>

                <Card className="mb-12 border-studio-border bg-white/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Link className="w-5 h-5" />
                            Korta ner
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-4">
                            <Input
                                placeholder="Klistra in din URL här..."
                                value={url}
                                onChange={e => setUrl(e.target.value)}
                                className="flex-1"
                                onKeyPress={e => e.key === 'Enter' && generateShortUrl()}
                            />
                            <Button onClick={generateShortUrl} disabled={!url}>Skapa</Button>
                        </div>
                    </CardContent>
                </Card>

                {shortUrls.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-serif mb-6">Your Shortened URLs</h2>
                        {shortUrls.map(item => (
                            <Card key={item.id} className="border-studio-border bg-white/50 backdrop-blur-sm">
                                <CardContent className="p-6">
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm text-studio-muted mb-1">Original URL:</p>
                                            <p className="text-studio-dark break-all">{item.original}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-studio-muted mb-1">Short URL:</p>
                                            <div className="flex items-center gap-2">
                                                <a href={item.short} target="_blank" rel="noopener noreferrer" className="text-studio-light font-medium">{item.short}</a>
                                                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(item.short)} className="h-8 w-8 p-0">
                                                    <Copy className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default URLShortener;







/* import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Link, ArrowLeft, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

type ShortUrl = { original: string; short: string; id: string };

const URLShortener = () => {
    const [url, setUrl] = useState('');
    const [shortUrls, setShortUrls] = useState<ShortUrl[]>([]);
    const { toast } = useToast();
    const navigate = useNavigate();

    // Load existing short URLs from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('shortUrls');
        if (stored) {
            setShortUrls(JSON.parse(stored));
        }
    }, []);

    // Handle redirect if visiting a short URL
    useEffect(() => {
        const hash = window.location.hash.replace('#/', '');
        if (!hash) return;

        const stored = localStorage.getItem('shortUrls');
        if (!stored) return;

        const urls: ShortUrl[] = JSON.parse(stored);
        const found = urls.find(u => u.id === hash);

        if (found) {
            window.location.href = found.original; // Redirect
        } else {
            navigate('/'); // Go home if not found
        }
    }, [navigate]);

    const generateShortUrl = () => {
        if (!url) return;

        const id = Math.random().toString(36).substring(2, 8);
        const shortUrl = `${window.location.origin}/#/${id}`;
        const newShortUrl: ShortUrl = { original: url, short: shortUrl, id };

        const updatedList = [...shortUrls, newShortUrl];
        setShortUrls(updatedList);
        localStorage.setItem('shortUrls', JSON.stringify(updatedList));
        setUrl('');

        toast({
            title: 'URL Shortened!',
            description: 'Your short URL is ready to use.',
        });
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: 'Copied!',
            description: 'URL copied to clipboard.',
        });
    };

    const deleteUrl = (id: string) => {
        const updatedList = shortUrls.filter(u => u.id !== id);
        setShortUrls(updatedList);
        localStorage.setItem('shortUrls', JSON.stringify(updatedList));
        toast({
            title: 'Deleted',
            description: 'Short URL has been removed.',
        });
    };

    return (
        <div className="min-h-screen bg-studio-light text-studio-dark">
            <div className="max-w-4xl mx-auto px-gutter py-24">
                <div className="mb-12">
                    <RouterLink
                        to="/"
                        className="inline-flex items-center gap-2 text-studio-muted hover:text-studio-dark transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Portfolio
                    </RouterLink>
                    <h1 className="font-serif text-5xl lg:text-7xl mb-6">URL Shortener</h1>
                    <p className="text-xl text-studio-muted max-w-2xl">
                        Transform long URLs into clean, shareable links with our minimalist URL shortener.
                    </p>
                </div>

                <Card className="mb-12 border-studio-border bg-white/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Link className="w-5 h-5" />
                            Shorten Your URL
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-4">
                            <Input
                                placeholder="Paste your long URL here..."
                                value={url}
                                onChange={e => setUrl(e.target.value)}
                                className="flex-1"
                                onKeyPress={e => e.key === 'Enter' && generateShortUrl()}
                            />
                            <Button onClick={generateShortUrl} disabled={!url}>
                                Shorten
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {shortUrls.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-serif mb-6">Your Shortened URLs</h2>
                        {shortUrls.map(item => (
                            <Card key={item.id} className="border-studio-border bg-white/50 backdrop-blur-sm">
                                <CardContent className="p-6">
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm text-studio-muted mb-1">Original URL:</p>
                                            <p className="text-studio-dark break-all">{item.original}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-studio-muted mb-1">Short URL:</p>
                                            <div className="flex items-center gap-2">
                                                <a
                                                    href={item.short}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-studio-accent font-medium"
                                                >
                                                    {item.short}
                                                </a>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => copyToClipboard(item.short)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => deleteUrl(item.id)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default URLShortener;
 */
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Link, ArrowLeft, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link as RouterLink } from 'react-router-dom';

type ShortUrl = {
    id: string;
    original: string;
    short: string;
};

const API_SHORTEN = '/api/shorten';

const URLShortener: React.FC = () => {
    const [url, setUrl] = useState('');
    const [shortUrls, setShortUrls] = useState<ShortUrl[]>([]);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    // Load saved URLs from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem('shortUrls');
            if (stored) setShortUrls(JSON.parse(stored));
        } catch (err) {
            console.warn('Failed to load shortUrls from localStorage', err);
        }
    }, []);

    // Create short URL via serverless API
    const generateShortUrl = async () => {
        if (!url || !url.trim()) {
            toast({ title: 'Ange URL', description: 'Please paste a URL to shorten.' });
            return;
        }

        setLoading(true);

        try {
            // Normalize URL: add https:// if missing
            let normalizedUrl = url.trim();
            if (!/^https?:\/\//i.test(normalizedUrl)) {
                normalizedUrl = 'https://' + normalizedUrl;
            }

            const res = await fetch(API_SHORTEN, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: normalizedUrl }),
            });

            const text = await res.text();
            let data: any;
            try {
                data = text ? JSON.parse(text) : {};
            } catch {
                throw new Error(`Server returned non-JSON response: ${text}`);
            }

            if (!res.ok) throw new Error(data?.error || `Server responded with ${res.status}`);

            const newItem: ShortUrl = { id: data.id, original: data.url, short: data.shortUrl };

            const updatedList = [newItem, ...shortUrls];
            setShortUrls(updatedList);
            localStorage.setItem('shortUrls', JSON.stringify(updatedList));
            setUrl('');
            toast({ title: 'URL Skapad!', description: 'Din nya URL är redo att användas' });
        } catch (err: any) {
            console.error('Shorten failed:', err);
            toast({ title: 'Could not shorten URL', description: err?.message || 'Unknown error' });
        } finally {
            setLoading(false);
        }
    };

    // Copy short URL to clipboard
    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast({ title: 'Kopierad!', description: 'URL kopierad to urklipp.' });
        } catch {
            toast({ title: 'Copy failed', description: 'Could not copy to clipboard.' });
        }
    };

    // Delete a short URL locally
    const deleteUrl = (id: string) => {
        const updatedList = shortUrls.filter((u) => u.id !== id);
        setShortUrls(updatedList);
        localStorage.setItem('shortUrls', JSON.stringify(updatedList));
        toast({ title: 'Raderad', description: 'URL borttagen.' });
    };

    // Press Enter to submit
    const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            generateShortUrl();
        }
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
                        Tillbaka
                    </RouterLink>
                    <h1 className="font-serif text-5xl lg:text-7xl mb-6">URL Tool</h1>
                    <p className="text-xl text-studio-muted max-w-2xl">
                        Gör om dina URLer för att maskera eller förkorta! (förutsatt att du har en kort domän)
                    </p>
                </div>

                <Card className="mb-12 border-studio-border bg-white/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Link className="w-5 h-5" />
                            Skapa URL
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-4">
                            <Input
                                placeholder="Ange URL här..."
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="flex-1"
                                onKeyDown={handleKeyDown}
                            />
                            <Button onClick={generateShortUrl} disabled={!url || loading}>
                                {loading ? 'Skapar...' : 'Skapa'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {shortUrls.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-serif mb-6">Dina URLer</h2>
                        {shortUrls.map((item) => (
                            <Card key={item.id} className="border-studio-border bg-white/50 backdrop-blur-sm">
                                <CardContent className="p-6">
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm text-studio-muted mb-1">Original URL:</p>
                                            <p className="text-studio-dark break-all">{item.original}</p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-studio-muted mb-1">Ny URL:</p>
                                            <div className="flex items-center gap-2">
                                                <a
                                                    href={item.short}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-studio-light font-medium break-all"
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
                                                    aria-label={`Delete ${item.id}`}
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




/* import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Link, ArrowLeft, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link as RouterLink } from 'react-router-dom';

type ShortUrl = {
    id: string;
    original: string;
    short: string;
};

const API_SHORTEN = '/api/shorten';

const URLShortener: React.FC = () => {
    const [url, setUrl] = useState('');
    const [shortUrls, setShortUrls] = useState<ShortUrl[]>([]);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    // Load saved URLs from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem('shortUrls');
            if (stored) setShortUrls(JSON.parse(stored));
        } catch (err) {
            console.warn('Failed to load shortUrls from localStorage', err);
        }
    }, []);

    // Create short URL via serverless API
    const generateShortUrl = async () => {
        if (!url || !url.trim()) {
            toast({ title: 'Enter a URL', description: 'Please paste a URL to shorten.' });
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(API_SHORTEN, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: url.trim() }),
            });

            const text = await res.text();
            let data: any;
            try {
                data = text ? JSON.parse(text) : {};
            } catch {
                throw new Error(`Server returned non-JSON response: ${text}`);
            }

            if (!res.ok) throw new Error(data?.error || `Server responded with ${res.status}`);

            const newItem: ShortUrl = {
                id: data.id,
                original: data.url,
                short: data.shortUrl,
            };

            const updatedList = [newItem, ...shortUrls];
            setShortUrls(updatedList);
            localStorage.setItem('shortUrls', JSON.stringify(updatedList));
            setUrl('');
            toast({ title: 'URL Shortened!', description: 'Short URL created.' });
        } catch (err: any) {
            console.error('Shorten failed:', err);
            toast({ title: 'Could not shorten URL', description: err?.message || 'Unknown error' });
        } finally {
            setLoading(false);
        }
    };

    // Copy short URL to clipboard
    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast({ title: 'Copied!', description: 'URL copied to clipboard.' });
        } catch {
            toast({ title: 'Copy failed', description: 'Could not copy to clipboard.' });
        }
    };

    // Delete a short URL locally
    const deleteUrl = (id: string) => {
        const updatedList = shortUrls.filter((u) => u.id !== id);
        setShortUrls(updatedList);
        localStorage.setItem('shortUrls', JSON.stringify(updatedList));
        toast({ title: 'Deleted', description: 'Short URL removed locally.' });
    };

    // Press Enter to submit
    const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            generateShortUrl();
        }
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
                                onChange={(e) => setUrl(e.target.value)}
                                className="flex-1"
                                onKeyDown={handleKeyDown}
                            />
                            <Button onClick={generateShortUrl} disabled={!url || loading}>
                                {loading ? 'Shortening...' : 'Shorten'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {shortUrls.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-serif mb-6">Your Shortened URLs</h2>
                        {shortUrls.map((item) => (
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
                                                    className="text-studio-light font-medium break-all"
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
                                                    aria-label={`Delete ${item.id}`}
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




/* import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Link, ArrowLeft, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link as RouterLink } from 'react-router-dom';

type ShortUrl = {
    id: string;
    original: string;
    short: string;
};

const API_SHORTEN = '/api/shorten';

const URLShortener: React.FC = () => {
    const [url, setUrl] = useState('');
    const [shortUrls, setShortUrls] = useState<ShortUrl[]>([]);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    // Load saved URLs from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem('shortUrls');
            if (stored) setShortUrls(JSON.parse(stored));
        } catch (err) {
            console.warn('Failed to load shortUrls from localStorage', err);
        }
    }, []);

    // Create short URL via serverless API
    const generateShortUrl = async () => {
        if (!url || !url.trim()) {
            toast({ title: 'Enter a URL', description: 'Please paste a URL to shorten.' });
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(API_SHORTEN, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: url.trim() }),
            });

            const text = await res.text();
            let data: any;
            try {
                data = text ? JSON.parse(text) : {};
            } catch {
                throw new Error(`Server returned non-JSON response: ${text}`);
            }

            if (!res.ok) throw new Error(data?.error || `Server responded with ${res.status}`);

            const newItem: ShortUrl = {
                id: data.id,
                original: data.url,
                short: data.shortUrl,
            };

            const updatedList = [newItem, ...shortUrls];
            setShortUrls(updatedList);
            localStorage.setItem('shortUrls', JSON.stringify(updatedList));
            setUrl('');
            toast({ title: 'URL Shortened!', description: 'Short URL created.' });
        } catch (err: any) {
            console.error('Shorten failed:', err);
            toast({ title: 'Could not shorten URL', description: err?.message || 'Unknown error' });
        } finally {
            setLoading(false);
        }
    };

    // Copy short URL to clipboard
    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast({ title: 'Copied!', description: 'URL copied to clipboard.' });
        } catch {
            toast({ title: 'Copy failed', description: 'Could not copy to clipboard.' });
        }
    };

    // Delete a short URL locally
    const deleteUrl = (id: string) => {
        const updatedList = shortUrls.filter((u) => u.id !== id);
        setShortUrls(updatedList);
        localStorage.setItem('shortUrls', JSON.stringify(updatedList));
        toast({ title: 'Deleted', description: 'Short URL removed locally.' });
    };

    // Press Enter to submit
    const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            generateShortUrl();
        }
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
                                onChange={(e) => setUrl(e.target.value)}
                                className="flex-1"
                                onKeyDown={handleKeyDown}
                            />
                            <Button onClick={generateShortUrl} disabled={!url || loading}>
                                {loading ? 'Shortening...' : 'Shorten'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {shortUrls.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-serif mb-6">Your Shortened URLs</h2>
                        {shortUrls.map((item) => (
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
                                                    className="text-studio-light font-medium break-all"
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
                                                    aria-label={`Delete ${item.id}`}
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

import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, X, Share2, Twitter, Facebook } from 'lucide-react';
import { useLanguage } from '../../LanguageContext';
import { Link, useParams } from '@tanstack/react-router';
import { SEO, PremiumImage } from '../../design/components/Common';
import { useData } from '../../DataContext';

// --- Page Header Helper (Duplicated for isolation) ---
const PageHeader: React.FC<{ title: string; subtitle?: string; bgImage?: string }> = ({ title, subtitle, bgImage }) => (
    <div className="relative bg-slate-900 text-white py-32 md:py-48 px-4 text-center overflow-hidden">
        {bgImage && (
            <>
                <img src={bgImage} className="absolute inset-0 w-full h-full object-cover opacity-30 animate-ken-burns" alt="Background" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
            </>
        )}
        <div className="relative z-10">
            <h1 className="font-serif text-4xl md:text-6xl mb-6 animate-slide-up leading-tight">{title}</h1>
            {subtitle && <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto animate-slide-up delay-100 font-light tracking-wide">{subtitle}</p>}
        </div>
    </div>
);

export const BlogPage: React.FC = () => {
    const { t, resolveContent } = useLanguage();
    const { blogPosts } = useData();
    const params = useParams({ strict: false });
    const { category, slug } = params as any;
    const [searchParams] = useState(new URLSearchParams(window.location.search));
    const tagFilter = searchParams.get('tag');

    const getSlugFromCategory = (catId: string) => catId.toLowerCase().replace('_', '-');

    // -- Detailed Post View --
    if (slug) {
        const post = blogPosts.find(p => p.slug === slug);
        if (!post) return <div className="p-20 text-center text-slate-500">Article not found.</div>;

        const relatedPosts = blogPosts.filter(p => p.category === post.category && p.id !== post.id).slice(0, 3);

        return (
            <div className="animate-fade-in bg-stone-50 min-h-screen">
                <SEO title={resolveContent(post.title)} description={resolveContent(post.excerpt)} image={post.image} type="article" />
                
                {/* Immersive Header */}
                <div className="relative h-[60vh] md:h-[70vh]">
                    <img src={post.image} alt={resolveContent(post.title)} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white max-w-4xl mx-auto text-center">
                        <Link to="/journal" className="inline-block mb-6 text-amber-400 text-xs font-bold uppercase tracking-widest hover:text-white transition">
                            <ChevronLeft size={16} className="inline mr-2"/> {t('blog_back')}
                        </Link>
                        <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 leading-tight">{resolveContent(post.title)}</h1>
                        <div className="flex items-center justify-center space-x-4 text-xs font-bold uppercase tracking-widest text-slate-300">
                            <span>{post.date}</span>
                            <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
                            <span>{post.category.replace('_', ' ')}</span>
                            <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
                            <span>By {post.author}</span>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 py-16 -mt-10 relative z-10">
                    <div className="bg-white p-8 md:p-12 shadow-xl rounded-sm">
                        {/* Article Content */}
                        <article className="prose prose-slate prose-lg max-w-none first-letter:text-5xl first-letter:font-serif first-letter:text-amber-600 first-letter:float-left first-letter:mr-3">
                            <div dangerouslySetInnerHTML={{ __html: resolveContent(post.content) }} />
                        </article>

                        {/* Tags & Share */}
                        <div className="mt-12 pt-8 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-stone-100 text-slate-600 text-xs uppercase font-bold rounded-sm tracking-wide">#{tag}</span>
                                ))}
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="text-xs font-bold uppercase text-slate-400">Share:</span>
                                <button className="p-2 rounded-full bg-stone-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition"><Twitter size={18}/></button>
                                <button className="p-2 rounded-full bg-stone-50 text-slate-600 hover:bg-blue-50 hover:text-blue-800 transition"><Facebook size={18}/></button>
                                <button className="p-2 rounded-full bg-stone-50 text-slate-600 hover:bg-green-50 hover:text-green-600 transition"><Share2 size={18}/></button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <div className="bg-white py-16 border-t border-stone-200">
                        <div className="max-w-7xl mx-auto px-4">
                            <h3 className="font-serif text-2xl text-slate-900 mb-8 text-center">{t('blog_related')}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {relatedPosts.map(rp => (
                                    <Link key={rp.id} to={`/journal/${getSlugFromCategory(rp.category)}/${rp.slug}`} className="group block">
                                        <div className="aspect-[4/3] overflow-hidden rounded-sm mb-4 bg-stone-200">
                                            <img src={rp.image} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                                        </div>
                                        <h4 className="font-serif text-lg text-slate-900 group-hover:text-amber-600 transition mb-2">{resolveContent(rp.title)}</h4>
                                        <p className="text-xs text-slate-500 uppercase tracking-widest">{rp.date}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // -- List View --
    const filteredPosts = blogPosts.filter(post => {
        if (category && getSlugFromCategory(post.category) !== category) return false;
        if (tagFilter && !post.tags.includes(tagFilter)) return false;
        return true;
    });

    const categories = ['ALL', 'TRAVEL_TIPS', 'LOCAL_LIFE', 'GASTRONOMY', 'CULTURE'];

    return (
        <div className="animate-fade-in bg-stone-50 min-h-screen">
            <SEO title="Le Journal" description="Stories and guides from Tétouan." />
            <PageHeader title={t('blog_title')} subtitle={t('blog_subtitle')} />
            
            {/* Filters */}
            <div className="bg-white border-b border-stone-200 sticky top-20 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
                    <div className="flex justify-center space-x-8 py-4 min-w-max">
                        {categories.map(cat => (
                            <Link 
                                key={cat} 
                                to={cat === 'ALL' ? '/journal' : `/journal/${cat.toLowerCase().replace('_', '-')}`}
                                className={`text-xs font-bold uppercase tracking-widest transition pb-1 border-b-2 ${
                                    (cat === 'ALL' && !category) || (category && cat.toLowerCase().replace('_', '-') === category)
                                    ? 'text-amber-600 border-amber-600' 
                                    : 'text-slate-500 border-transparent hover:text-slate-800'
                                }`}
                            >
                                {t(`blog_cat_${cat.toLowerCase()}` as any)}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tag Filter Indicator */}
            {tagFilter && (
                <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-center">
                    <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-xs font-bold uppercase flex items-center">
                        {t('blog_filter_tag')} #{tagFilter}
                        <Link to="/journal" className="ml-2 hover:text-amber-600"><X size={14}/></Link>
                    </div>
                </div>
            )}

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {filteredPosts.map((post, i) => (
                        <article key={post.id} className="group flex flex-col h-full animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                            <Link to={`/journal/${getSlugFromCategory(post.category)}/${post.slug}`} className="block overflow-hidden rounded-sm mb-6 relative aspect-[3/2]">
                                <PremiumImage src={post.image} alt={resolveContent(post.title)} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                                <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-900 backdrop-blur-sm">
                                    {t(`blog_cat_${post.category.toLowerCase()}` as any)}
                                </div>
                            </Link>
                            <div className="flex-1 flex flex-col">
                                <div className="flex items-center text-xs text-slate-400 mb-3 uppercase tracking-widest font-bold">
                                    <span>{post.date}</span>
                                    <span className="mx-2 text-amber-500">•</span>
                                    <span>{post.author}</span>
                                </div>
                                <h3 className="font-serif text-2xl text-slate-900 mb-3 leading-tight group-hover:text-amber-600 transition">
                                    <Link to={`/journal/${getSlugFromCategory(post.category)}/${post.slug}`}>{resolveContent(post.title)}</Link>
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                                    {resolveContent(post.excerpt)}
                                </p>
                                <Link to={`/journal/${getSlugFromCategory(post.category)}/${post.slug}`} className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-900 hover:text-amber-600 transition mt-auto">
                                    {t('blog_read_more')} <ArrowRight size={14} className="ml-2 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
                {filteredPosts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-slate-400 text-lg">No articles found in this category.</p>
                        <Link to="/journal" className="text-amber-600 font-bold uppercase text-xs mt-4 inline-block hover:underline">View All</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

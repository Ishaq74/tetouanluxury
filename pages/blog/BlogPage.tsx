

// Toutes les données et fonctions nécessaires sont passées via les props depuis Astro
// t, resolveContent, blogPosts, params, etc.
type BlogPageProps = {
  t: (key: string) => string;
  resolveContent: (v: any) => string;
  blogPosts: any[];
  params: { category?: string; slug?: string };
  tagFilter?: string;
};

const BlogPage: React.FC<BlogPageProps> = ({ t, resolveContent, blogPosts, params, tagFilter }) => {
  const { category, slug } = params;
  const getSlugFromCategory = (catId: string) => catId.toLowerCase().replace('_', '-');

  // -- Detailed Post View --
  if (slug) {
    const post = blogPosts.find(p => p.slug === slug);
    if (!post) return <div className="p-20 text-center text-slate-500">Article not found.</div>;
    const relatedPosts = blogPosts.filter(p => p.category === post.category && p.id !== post.id).slice(0, 3);
    // ...le reste du composant détaillé, en utilisant les props...
    return <div />;
  }

  // -- List View --
  const filteredPosts = blogPosts.filter(post => {
    if (category && getSlugFromCategory(post.category) !== category) return false;
    if (tagFilter && !post.tags.includes(tagFilter)) return false;
    return true;
  });
  // ...le reste du composant liste, en utilisant les props...
  return <div />;
};

export default BlogPage;

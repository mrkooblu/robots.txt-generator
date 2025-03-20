export interface SemrushTip {
  id: string;
  fieldId: string; // Identifies which field this tip is relevant for
  tip: string;
  semrushLink: string;
  linkText: string;
}

export const SEMRUSH_TIPS: SemrushTip[] = [
  // User-agent tooltip tips
  {
    id: 'user-agent-1',
    fieldId: 'user-agent',
    tip: '46% of SEO professionals misunderstand how different bots interpret robots.txt rules. Each search engine might follow directives differently.',
    semrushLink: 'https://www.semrush.com/siteaudit/',
    linkText: 'Analyze bot behavior with Site Audit'
  },
  {
    id: 'user-agent-2',
    fieldId: 'user-agent',
    tip: 'Different bots crawl for different purposes. Blocking image bots prevents your images from appearing in image search but still allows text indexing.',
    semrushLink: 'https://www.semrush.com/on-page-seo-checker/',
    linkText: 'Check crawlability with On Page SEO Checker'
  },
  
  // Path tooltip tips
  {
    id: 'path-1',
    fieldId: 'path',
    tip: 'Being too restrictive with robots.txt can hurt your SEO. Make sure you\'re not accidentally blocking important content that should be indexed.',
    semrushLink: 'https://www.semrush.com/log-file-analyzer/',
    linkText: 'Verify crawling patterns with Log File Analyzer'
  },
  {
    id: 'path-2',
    fieldId: 'path',
    tip: 'Use wildcards carefully. Blocking entire directories might prevent important pages from being discovered by search engines.',
    semrushLink: 'https://www.semrush.com/siteaudit/',
    linkText: 'Find crawl issues with Site Audit'
  },
  
  // Permission tooltip tips
  {
    id: 'permission-1',
    fieldId: 'permission',
    tip: 'Remember: "Disallow" only prevents crawling, not indexing. Pages may still appear in search results if linked from other indexed pages.',
    semrushLink: 'https://www.semrush.com/academy/courses/technical-seo-course-with-bastian-grimm/',
    linkText: 'Learn in our Technical SEO course'
  },
  {
    id: 'permission-2',
    fieldId: 'permission',
    tip: 'Strategic use of Allow/Disallow helps optimize your crawl budget, ensuring search engines focus on your most important content.',
    semrushLink: 'https://www.semrush.com/analytics/overview/?searchType=domain',
    linkText: 'Analyze your domain performance'
  },
  
  // Sitemap tooltip tips
  {
    id: 'sitemap-1',
    fieldId: 'sitemap',
    tip: 'Including your sitemap in robots.txt helps search engines discover all important pages, even those deep in your site structure.',
    semrushLink: 'https://www.semrush.com/analytics/keywordoverview/?db=us',
    linkText: 'Check keyword ranking opportunities'
  },
  {
    id: 'sitemap-2', 
    fieldId: 'sitemap',
    tip: 'Sitemaps improve indexing efficiency by up to 40%. Make sure yours is properly formatted and regularly updated.',
    semrushLink: 'https://www.semrush.com/on-page-seo-checker/',
    linkText: 'Audit your sitemap implementation'
  },
  
  // Quick actions tooltip tips
  {
    id: 'quick-action-1',
    fieldId: 'essential-files',
    tip: 'Blocking administrative areas improves security and focuses crawl budget on public-facing content that should be ranked.',
    semrushLink: 'https://www.semrush.com/siteaudit/',
    linkText: 'Optimize your crawl efficiency'
  },
  {
    id: 'quick-action-2',
    fieldId: 'block-images',
    tip: 'Selectively blocking image crawling can be useful for copyright protection or to prevent image search traffic.',
    semrushLink: 'https://www.semrush.com/analytics/overview/?searchType=domain',
    linkText: 'See how it affects your traffic'
  },
  
  // General tips
  {
    id: 'general-1',
    fieldId: 'general',
    tip: 'After implementing robots.txt, monitor how search engines actually crawl your site to ensure your rules are working as intended.',
    semrushLink: 'https://www.semrush.com/log-file-analyzer/',
    linkText: 'Track crawler behavior with Log File Analyzer'
  },
  {
    id: 'general-2',
    fieldId: 'general',
    tip: 'Search engines can still index blocked URLs if they\'re linked from other pages. Use meta robots tags for proper indexing control.',
    semrushLink: 'https://www.semrush.com/signup/',
    linkText: 'Get complete SEO tools with Semrush'
  },
  {
    id: 'general-3',
    fieldId: 'general',
    tip: 'Your competitors\' robots.txt files can reveal their SEO strategy. Analyze them to uncover strategic insights.',
    semrushLink: 'https://www.semrush.com/signup/?src=main_slider&custom=ci&tk=competitive-research&redirect_to=%2Ftrends%2F',
    linkText: 'Compare with Competitive Research'
  }
];

// Helper function to get a random tip for a specific field
export const getRandomTipForField = (fieldId: string): SemrushTip => {
  const fieldTips = SEMRUSH_TIPS.filter(tip => tip.fieldId === fieldId);
  
  // If no specific tip exists for this field, return a general tip
  if (fieldTips.length === 0) {
    const generalTips = SEMRUSH_TIPS.filter(tip => tip.fieldId === 'general');
    return generalTips[Math.floor(Math.random() * generalTips.length)];
  }
  
  // Return a random tip from the available ones for this field
  return fieldTips[Math.floor(Math.random() * fieldTips.length)];
}; 
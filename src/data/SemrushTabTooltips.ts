export interface SemrushTabTip {
  id: string;
  sectionId: string; // Identifies which section this tip is relevant for
  heading: string;
  tip: string;
  semrushLink: string;
  linkText: string;
}

export const BEST_PRACTICES_TIPS: SemrushTabTip[] = [
  {
    id: 'best-practice-1',
    sectionId: 'user-agents',
    heading: 'Be Specific with User-Agents',
    tip: 'Using specific user-agents can improve crawl efficiency by 35%. Analyze how different bots are currently crawling your site with Semrush\'s Log File Analyzer.',
    semrushLink: 'https://www.semrush.com/log-file-analyzer/',
    linkText: 'Analyze bot behavior'
  },
  {
    id: 'best-practice-2',
    sectionId: 'allow-disallow',
    heading: 'Differentiate Allow and Disallow',
    tip: 'Balancing Allow and Disallow directives helps optimize your crawl budget. Find the most valuable pages to prioritize with Semrush\'s Site Audit.',
    semrushLink: 'https://www.semrush.com/siteaudit/',
    linkText: 'Optimize your crawl budget'
  },
  {
    id: 'best-practice-3',
    sectionId: 'sitemap',
    heading: 'Always Include a Sitemap',
    tip: 'A sitemap can improve indexing by up to 40%. Check your sitemap health and discover indexing issues with Semrush\'s Site Audit tool.',
    semrushLink: 'https://www.semrush.com/siteaudit/',
    linkText: 'Verify your sitemap'
  },
  {
    id: 'best-practice-4',
    sectionId: 'testing',
    heading: 'Test Before Deploying',
    tip: 'Testing prevents critical SEO failures. Get a complete SEO audit including robots.txt issues with Semrush\'s comprehensive toolset.',
    semrushLink: 'https://www.semrush.com/signup/',
    linkText: 'Get a full SEO audit'
  },
  {
    id: 'best-practice-5',
    sectionId: 'resources',
    heading: 'Don\'t Block CSS or JavaScript',
    tip: 'Blocking CSS/JS can hurt your rankings. Learn modern technical SEO best practices in Semrush\'s Technical SEO Course.',
    semrushLink: 'https://www.semrush.com/academy/courses/technical-seo-course-with-bastian-grimm/',
    linkText: 'Master technical SEO'
  }
];

export const COMMON_MISTAKES_TIPS: SemrushTabTip[] = [
  {
    id: 'mistake-1',
    sectionId: 'privacy',
    heading: 'Using robots.txt for privacy',
    tip: 'Never use robots.txt for securing sensitive content. Learn proper security practices in Semrush\'s Site Audit Course.',
    semrushLink: 'https://www.semrush.com/academy/courses/semrush-site-audit-course/',
    linkText: 'Learn security best practices'
  },
  {
    id: 'mistake-2',
    sectionId: 'blocking-site',
    heading: 'Blocking entire site unintentionally',
    tip: 'A single incorrect directive can block your entire site. Monitor your site\'s crawlability with Semrush\'s Site Audit tool.',
    semrushLink: 'https://www.semrush.com/siteaudit/',
    linkText: 'Check your site\'s crawlability'
  },
  {
    id: 'mistake-3',
    sectionId: 'leading-slash',
    heading: 'Forgetting the leading slash',
    tip: 'Syntax errors can lead to crawl issues. Verify your robots.txt implementation with Semrush\'s On-Page SEO Checker.',
    semrushLink: 'https://www.semrush.com/on-page-seo-checker/',
    linkText: 'Validate your technical SEO'
  },
  {
    id: 'mistake-4',
    sectionId: 'syntax',
    heading: 'Using incorrect syntax',
    tip: 'Even small syntax errors can cause big crawling problems. Test your robots.txt with Semrush\'s Log File Analyzer to see actual crawler behavior.',
    semrushLink: 'https://www.semrush.com/log-file-analyzer/',
    linkText: 'See real crawler behavior'
  },
  {
    id: 'mistake-5',
    sectionId: 'conflicting-rules',
    heading: 'Contradictory or conflicting rules',
    tip: 'Conflicting rules can confuse search engines. Analyze your site\'s structure and optimize crawling with Semrush\'s Site Audit.',
    semrushLink: 'https://www.semrush.com/siteaudit/',
    linkText: 'Audit your site structure'
  }
];

export const EXAMPLES_TIPS: SemrushTabTip[] = [
  {
    id: 'example-1',
    sectionId: 'ecommerce',
    heading: 'E-commerce Site',
    tip: 'Properly protecting checkout and cart pages while allowing product indexing is crucial for e-commerce sites. Research your best performing product keywords with Semrush.',
    semrushLink: 'https://www.semrush.com/analytics/keywordoverview/?db=us',
    linkText: 'Find profitable product keywords'
  },
  {
    id: 'example-2',
    sectionId: 'blog',
    heading: 'Blog or Content Site',
    tip: 'For content sites, it\'s essential to allow indexing of valuable content while preventing duplicate content issues. Optimize your content strategy with Semrush\'s Content Marketing Platform.',
    semrushLink: 'https://www.semrush.com/on-page-seo-checker/',
    linkText: 'Boost your content performance'
  },
  {
    id: 'example-3',
    sectionId: 'corporate',
    heading: 'Corporate Website',
    tip: 'Corporate sites need to balance public information with protected internal content. Compare your SEO performance against competitors with Semrush\'s Competitive Research tools.',
    semrushLink: 'https://www.semrush.com/signup/?src=main_slider&custom=ci&tk=competitive-research&redirect_to=%2Ftrends%2F',
    linkText: 'Analyze your competitors'
  }
];

// Helper function to get the appropriate tip for a specific section
export const getTipForSection = (tabType: 'best-practices' | 'mistakes' | 'examples', sectionId: string): SemrushTabTip | null => {
  let tipsArray: SemrushTabTip[] = [];
  
  // Select the appropriate array based on the tab type
  switch (tabType) {
    case 'best-practices':
      tipsArray = BEST_PRACTICES_TIPS;
      break;
    case 'mistakes':
      tipsArray = COMMON_MISTAKES_TIPS;
      break;
    case 'examples':
      tipsArray = EXAMPLES_TIPS;
      break;
  }
  
  // Find the matching tip or return null if none found
  const matchingTip = tipsArray.find(tip => tip.sectionId === sectionId);
  return matchingTip || null;
}; 
export interface Tip {
  id: string;
  text: string;
  link: string;
  linkText: string;
  category: TipCategory;
  trigger?: TipTrigger;
}

export type TipCategory = 
  | 'siteAudit'
  | 'logAnalyzer'
  | 'onPageSeo'
  | 'education'
  | 'keywords'
  | 'domain'
  | 'general'
  | 'competitive';

export type TipTrigger =
  | 'disallow'
  | 'allow'
  | 'sitemap'
  | 'general'
  | 'wordpress'
  | 'image'
  | 'bot';

export const tips: Tip[] = [
  // Site Audit Tips
  {
    id: 'site-audit-1',
    text: 'Up to 80% of websites have robots.txt configuration errors that prevent proper indexing.',
    link: 'https://www.semrush.com/siteaudit/',
    linkText: 'Verify with Site Audit',
    category: 'siteAudit',
    trigger: 'general'
  },
  {
    id: 'site-audit-2',
    text: 'Search engines might still index blocked pages if they\'re linked elsewhere.',
    link: 'https://www.semrush.com/siteaudit/',
    linkText: 'Find with Site Audit',
    category: 'siteAudit',
    trigger: 'disallow'
  },

  // Log File Analysis Tips
  {
    id: 'log-analyzer-1',
    text: 'Your robots.txt may say one thing, but search engines might behave differently.',
    link: 'https://www.semrush.com/log-file-analyzer/',
    linkText: 'See with Log File Analyzer',
    category: 'logAnalyzer',
    trigger: 'general'
  },
  {
    id: 'log-analyzer-2',
    text: 'Even with a perfect robots.txt, search engines can still waste crawl budget on unimportant pages.',
    link: 'https://www.semrush.com/log-file-analyzer/',
    linkText: 'Analyze crawler behavior',
    category: 'logAnalyzer',
    trigger: 'disallow'
  },

  // On-Page SEO Tips
  {
    id: 'on-page-1',
    text: 'After configuring robots.txt, your meta robots tags might be sending conflicting signals.',
    link: 'https://www.semrush.com/on-page-seo-checker/',
    linkText: 'Check with On Page SEO Checker',
    category: 'onPageSeo',
    trigger: 'general'
  },
  {
    id: 'on-page-2',
    text: 'Robots.txt is just one piece of your technical SEO foundation.',
    link: 'https://www.semrush.com/on-page-seo-checker/',
    linkText: 'Get a complete SEO plan',
    category: 'onPageSeo',
    trigger: 'general'
  },

  // Educational Course Tips
  {
    id: 'education-1',
    text: '46% of SEO professionals misunderstand how robots.txt affects indexing vs. crawling.',
    link: 'https://www.semrush.com/academy/courses/semrush-site-audit-course/',
    linkText: 'Master the difference',
    category: 'education',
    trigger: 'general'
  },
  {
    id: 'education-2',
    text: 'Advanced robots.txt configurations require understanding crawl budget optimization.',
    link: 'https://www.semrush.com/academy/courses/technical-seo-course-with-bastian-grimm/',
    linkText: 'Learn Technical SEO',
    category: 'education',
    trigger: 'bot'
  },

  // Keyword Research Tips
  {
    id: 'keywords-1',
    text: 'After ensuring pages are crawlable, you need to target the right keywords.',
    link: 'https://www.semrush.com/analytics/keywordoverview/?db=us',
    linkText: 'Discover high-opportunity terms',
    category: 'keywords',
    trigger: 'allow'
  },
  {
    id: 'keywords-2',
    text: 'Preventing search engines from crawling the wrong content helps focus your rankings on target keywords.',
    link: 'https://www.semrush.com/analytics/keywordoverview/?db=us',
    linkText: 'Find your best keywords',
    category: 'keywords',
    trigger: 'disallow'
  },

  // Domain Analysis Tips
  {
    id: 'domain-1',
    text: 'Your robots.txt is part of your overall domain health.',
    link: 'https://www.semrush.com/analytics/overview/?searchType=domain',
    linkText: 'See domain overview',
    category: 'domain',
    trigger: 'general'
  },
  {
    id: 'domain-2',
    text: 'After implementing robots.txt, you should monitor changes in your site\'s visibility.',
    link: 'https://www.semrush.com/analytics/overview/?searchType=domain',
    linkText: 'Track progress',
    category: 'domain',
    trigger: 'general'
  },

  // General Semrush Tips
  {
    id: 'general-1',
    text: '94% of SEO professionals use more than just robots.txt to improve site performance.',
    link: 'https://www.semrush.com/academy/courses/getting-started-with-semrush/',
    linkText: 'Explore essential SEO tools',
    category: 'general',
    trigger: 'general'
  },
  {
    id: 'general-2',
    text: 'A properly configured robots.txt file is just the beginning of your SEO journey.',
    link: 'https://www.semrush.com/signup/',
    linkText: 'Get a free Semrush account',
    category: 'general',
    trigger: 'general'
  },

  // Competitive Research Tips
  {
    id: 'competitive-1',
    text: 'Your competitors\' robots.txt files can reveal their SEO strategy.',
    link: 'https://www.semrush.com/signup/?src=main_slider&custom=ci&tk=competitive-research&redirect_to=%2Ftrends%2F',
    linkText: 'Compare with Competitive Research',
    category: 'competitive',
    trigger: 'general'
  },
  {
    id: 'competitive-2',
    text: 'Understanding how competitors manage search engine access can uncover their content strategy.',
    link: 'https://www.semrush.com/signup/?src=main_slider&custom=ci&tk=competitive-research&redirect_to=%2Ftrends%2F',
    linkText: 'Analyze competitor approach',
    category: 'competitive',
    trigger: 'general'
  }
];

export const getTipsByTrigger = (trigger: TipTrigger): Tip[] => {
  return tips.filter(tip => tip.trigger === trigger);
};

export const getRandomTip = (category?: TipCategory, trigger?: TipTrigger): Tip => {
  let filteredTips = tips;
  
  if (category) {
    filteredTips = filteredTips.filter(tip => tip.category === category);
  }
  
  if (trigger) {
    filteredTips = filteredTips.filter(tip => tip.trigger === trigger);
  }
  
  // If no tips match the criteria, return a random general tip
  if (filteredTips.length === 0) {
    filteredTips = tips.filter(tip => tip.trigger === 'general');
  }
  
  const randomIndex = Math.floor(Math.random() * filteredTips.length);
  return filteredTips[randomIndex];
};

export const getRandomTips = (count: number = 3): Tip[] => {
  const shuffledTips = [...tips].sort(() => 0.5 - Math.random());
  return shuffledTips.slice(0, count);
}; 
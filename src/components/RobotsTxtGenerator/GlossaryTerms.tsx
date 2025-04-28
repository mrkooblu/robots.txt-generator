'use client';

import React from 'react';
import styled from 'styled-components';
import Tooltip from '../common/Tooltip';

export type GlossaryTerm = {
  term: string;
  definition: string;
  example?: string;
  moreInfo?: string;
};

// Dictionary of all technical terms and their definitions
export const glossaryTerms: Record<string, GlossaryTerm> = {
  'user-agent': {
    term: 'User-agent',
    definition: 'Identifies which web crawler or bot the rules apply to. Can target specific crawlers or all crawlers using *.',
    example: 'User-agent: Googlebot',
    moreInfo: 'Different search engines have different web crawlers with unique User-agent names.'
  },
  'allow': {
    term: 'Allow',
    definition: 'Explicitly permits crawling of specific URLs, even if they\'re within a disallowed path.',
    example: 'Allow: /public-folder/allowed-page.html',
    moreInfo: 'Allow directives take precedence over Disallow when both apply to the same URL.'
  },
  'disallow': {
    term: 'Disallow',
    definition: 'Prevents crawling of specific URLs or directories.',
    example: 'Disallow: /private/',
    moreInfo: 'Note that Disallow does not prevent indexing if other pages link to the content.'
  },
  'sitemap': {
    term: 'Sitemap',
    definition: 'Specifies the location of an XML sitemap file that lists pages on your site to help search engines discover them.',
    example: 'Sitemap: https://www.example.com/sitemap.xml',
    moreInfo: 'XML sitemaps can significantly improve crawling efficiency for search engines.'
  },
  'crawl-delay': {
    term: 'Crawl-delay',
    definition: 'Specifies a time delay (in seconds) between crawler requests to reduce server load.',
    example: 'Crawl-delay: 10',
    moreInfo: 'Not all search engines support this directive. Google uses Search Console settings instead.'
  },
  'wildcards': {
    term: 'Wildcards',
    definition: 'Special characters (*, $) used in path patterns to match multiple URLs with similar patterns.',
    example: 'Disallow: /*.pdf$',
    moreInfo: '* matches any sequence of characters, and $ matches the end of the URL.'
  },
  'robots-meta-tag': {
    term: 'Robots Meta Tag',
    definition: 'HTML tag used to control indexing and crawling at the page level, offering more precise control than robots.txt.',
    example: '<meta name="robots" content="noindex, nofollow">',
    moreInfo: 'Useful for pages that should be accessible but not indexed.'
  },
  'noindex': {
    term: 'Noindex',
    definition: 'A directive used in meta robots tags to prevent a page from appearing in search results.',
    example: '<meta name="robots" content="noindex">',
    moreInfo: 'Cannot be used in robots.txt directly; requires meta tags or HTTP headers.'
  },
  'nofollow': {
    term: 'Nofollow',
    definition: 'A directive that tells search engines not to follow links on a page.',
    example: '<meta name="robots" content="nofollow">',
    moreInfo: 'Can be used in both meta tags and as an attribute on individual links.'
  },
  'canonical': {
    term: 'Canonical URL',
    definition: 'Specifies the preferred version of a page when multiple similar or duplicate pages exist.',
    example: '<link rel="canonical" href="https://www.example.com/preferred-page">',
    moreInfo: 'Helps prevent duplicate content issues in search engine rankings.'
  },
  'crawl-budget': {
    term: 'Crawl Budget',
    definition: 'The number of pages a search engine will crawl on your site within a given timeframe.',
    example: 'N/A - This is a concept rather than a directive',
    moreInfo: 'Limited resources make proper robots.txt configuration important for large sites.'
  },
  'indexing': {
    term: 'Indexing',
    definition: 'The process of adding web pages into a search engine\'s database for use in search results.',
    example: 'N/A - This is a concept rather than a directive',
    moreInfo: 'Controlled through robots.txt, meta robots tags, and other directives.'
  },
  'web-crawler': {
    term: 'Web Crawler',
    definition: 'A bot that systematically browses the web to discover and index content for search engines.',
    example: 'Googlebot, Bingbot, etc.',
    moreInfo: 'Also known as spiders, bots, or crawlers. Each search engine has its own crawler(s).'
  },
  'regex': {
    term: 'Regular Expression',
    definition: 'Pattern matching syntax used in robots.txt path specifications on some search engines.',
    example: 'Disallow: /pattern-*-matching/',
    moreInfo: 'Support varies between search engines, with Google supporting limited pattern matching.'
  }
};

interface GlossaryTermTooltipProps {
  term: string;
  children: React.ReactNode;
}

const TermHighlight = styled.span`
  border-bottom: 1px dotted #3B82F6;
  cursor: help;
  color: #2563EB;
  transition: color 0.2s;
  
  &:hover {
    color: #1D4ED8;
  }
`;

export const GlossaryTermTooltip: React.FC<GlossaryTermTooltipProps> = ({ term, children }) => {
  const lowercaseTerm = term.toLowerCase();
  const termInfo = glossaryTerms[lowercaseTerm];
  
  if (!termInfo) {
    return <>{children}</>;
  }
  
  // Format the tooltip content with the definition and example
  let content = termInfo.definition;
  
  if (termInfo.example) {
    content += `\n\nExample: ${termInfo.example}`;
  }
  
  if (termInfo.moreInfo) {
    content += `\n\n${termInfo.moreInfo}`;
  }
  
  return (
    <Tooltip content={content} position="top" maxWidth="300px">
      <TermHighlight>{children}</TermHighlight>
    </Tooltip>
  );
};

export default GlossaryTermTooltip; 
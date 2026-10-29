import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const DEFAULT_TITLE = 'KHAN - khaneletrics.in | Web Dev, Electrician, Tour & Travel';
const DEFAULT_DESC = 'KHAN is a multi-service platform offering professional web development, trusted electrician services, and memorable tour & travel experiences in Badnapur, Jalna, and Maharashtra.';
const DOMAIN = 'https://khaneletrics.in';

const SEOHead = ({
  title,
  description,
  keywords,
  ogImage = `${DOMAIN}/logo.png`,
  ogType = 'website'
}) => {
  const location = useLocation();

  useEffect(() => {
    // 1. Update Document Title
    const finalTitle = title ? `${title} | KHAN` : DEFAULT_TITLE;
    document.title = finalTitle;

    // 2. Helper to set or update meta tag
    const setMetaTag = (attribute, attributeValue, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attribute}="${attributeValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attribute, attributeValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 3. Update Standard & SEO Meta
    const finalDesc = description || DEFAULT_DESC;
    setMetaTag('name', 'description', finalDesc);
    if (keywords) setMetaTag('name', 'keywords', keywords);

    // 4. Update Open Graph Metadata
    const currentCanonicalUrl = `${DOMAIN}${location.pathname}`;
    setMetaTag('property', 'og:title', finalTitle);
    setMetaTag('property', 'og:description', finalDesc);
    setMetaTag('property', 'og:url', currentCanonicalUrl);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:site_name', 'KHAN Electrics & Multi-Service');
    setMetaTag('property', 'og:image', ogImage);

    // 5. Update Twitter Card Metadata
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', finalTitle);
    setMetaTag('name', 'twitter:description', finalDesc);
    setMetaTag('name', 'twitter:image', ogImage);

    // 6. Update Canonical Link tag
    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', currentCanonicalUrl);

  }, [title, description, keywords, ogImage, ogType, location.pathname]);

  return null;
};

export default SEOHead;

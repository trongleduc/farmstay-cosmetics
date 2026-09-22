import type { MetadataRoute } from 'next';

import { site } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Khu vực quản trị không cần lập chỉ mục.
      disallow: ['/admin', '/admin/'],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}

// const fs = require('fs');
// // Function to generate the XML sitemap
// export function generateSitemap(data:{
//     slug: string,
//     videoId: string,
//     title: string,
//     description: string,
//     tags: any[]
// }[]
// ) {

//     // Start building the XML response
//     let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
//     xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" `;
//     xml += `xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n`;

//     data.forEach((item:any) => {
//         xml += `  <url>\n`;
//         xml += `    <loc>https://your-site.com/${encodeURIComponent(item.slug)}</loc>\n`;

//         // Video information
//         xml += `    <video:video>\n`;
//         xml += `      <video:content_loc>https://www.youtube.com/watch?v=/${item.videoId}</video:content_loc>\n`;
//         xml += `      <video:thumbnail_loc>${encodeURIComponent(`https://img.youtube.com/vi/${item?.videoId}/hqdefault.jpg`)}</video:thumbnail_loc>\n`;
//         xml += `      <video:title>${encodeURIComponent(item.title)}</video:title>\n`;

//         // Optional description if available
//         if (item.description) {
//             xml += `      <video:description>${encodeURIComponent(item?.description)}</video:description>\n`;
//         }

//         // Add tags if available
//         if (item.tags && item.tags.length > 0) {
//             item.tags.forEach((tag:any) => {
//                 xml += `      <video:tag>${encodeURIComponent(tag.name)}</video:tag>\n`;
//             });
//         }

//         xml += `    </video:video>\n`;
//         xml += `  </url>\n`;
//     });

//     xml += `</urlset>`;

//     // Save the XML to a file
//     fs.writeFile('sitemap.xml', xml, (err:any) => {
//         if (err) {
//             console.error('Error writing to file:', err);
//         } else {
//             console.log('Sitemap has been saved as sitemap.xml');
//         }
//     });
// }

const fs = require('fs');

// Function to generate the XML sitemap
export function generateSitemap(
  data: {
    slug: string;
    videoId: string;
    title: string;
    description: string;
    tags: any[];
    videoDetails: {
      channelId: string;
      keywords: string[];
      duration?: number; // If you have video duration in seconds
      viewCount?: number; // View count if available
    };
    createdAt: string; // Publication date
    updatedAt: string; // Last updated date
  }[],
) {
  // Start building the XML response
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" `;
  xml += `xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n`;

  data.forEach((item: any) => {
    xml += `  <url>\n`;
    // Use postmee.ai domain for video slugs
    // http://localhost:4000/creator/UCjHz5SVHeMT0AViCYZvsGDA/your-brain-whos-in-control-or-full-documentary-or-nova-or-pbs-yq6vood73ma
    xml += `    <loc>https://postmee.ai/creator/${item?.videoDetails?.channelId}/${encodeURIComponent(item.slug)}</loc>\n`;

    // Blog Information
    xml += `    <title>${encodeURIComponent(item.title)}</title>\n`;
    xml += `    <description>${encodeURIComponent(item.description)}</description>\n`;
    xml += `    <lastmod>${new Date(item.updatedAt).toISOString()}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;

    //     <article:article>
    //     <article:title>${encodeURIComponent(item.title)}</article:title>
    //     <article:published_time>${new Date(item.createdAt).toISOString()}</article:published_time>
    //     <article:author>John Doe</article:author>
    //   </article:article>
    // Artical DEtails
    xml += `    <article:article>\n`;
    xml += `      <article:title>${encodeURIComponent(item.title)}</article:title>\n`;
    xml += `      <article:published_time>${new Date(item.createdAt).toISOString()}</article:published_time>\n`;
    xml += `      <article:author>John Doe</article:author>\n`;
    xml += `    </article:article>\n`;

    // <author>John Doe</author> add author name
    xml += `    <author>PostMee.ai</author>\n`;

    // Video information
    xml += `    <video:video>\n`;
    xml += `      <video:content_loc>https://www.youtube.com/watch?v=${item.videoId}</video:content_loc>\n`;
    xml += `      <video:thumbnail_loc>https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg</video:thumbnail_loc>\n`;
    xml += `      <video:title>${encodeURIComponent(item.title)}</video:title>\n`;
    // <video:rating>4.5</video:rating> <!-- Rating out of 5 -->
    xml += `      <video:rating>4.5</video:rating>\n`;

    // Optional description if available
    if (item.description) {
      xml += `      <video:description>${encodeURIComponent(item.description)}</video:description>\n`;
    }

    // Add tags if available
    if (item.tags && item.tags.length > 0) {
      item.tags.forEach((tag: any) => {
        xml += `      <video:tag>${encodeURIComponent(tag.name)}</video:tag>\n`;
      });
    }

    // Add keywords from videoDetails
    if (item.videoDetails.keywords && item.videoDetails.keywords.length > 0) {
      item.videoDetails.keywords.forEach((keyword: string) => {
        xml += `      <video:tag>${encodeURIComponent(keyword)}</video:tag>\n`;
      });
    }

    // Add video duration if available
    if (item.videoDetails.duration) {
      xml += `      <video:duration>${item.videoDetails.duration}</video:duration>\n`;
    }

    // Add publication date
    if (item.createdAt) {
      xml += `      <video:publication_date>${new Date(item.createdAt).toISOString()}</video:publication_date>\n`;
    }

    // Add updated date if available
    if (item.updatedAt) {
      xml += `      <video:updated_at>${new Date(item.updatedAt).toISOString()}</video:updated_at>\n`;
    }

    // Add view count if available
    if (item.videoDetails.viewCount) {
      xml += `      <video:view_count>${item.videoDetails.viewCount}</video:view_count>\n`;
    }

    // Add uploader (channelId in this case)
    if (item.videoDetails.channelId) {
      xml += `      <video:uploader>${item.videoDetails.channelId}</video:uploader>\n`;
    }

    // Assume all YouTube videos are family-friendly by default
    xml += `      <video:family_friendly>yes</video:family_friendly>\n`;

    // Indicate that it's hosted on YouTube, so no subscription is required
    xml += `      <video:requires_subscription>no</video:requires_subscription>\n`;

    xml += `    </video:video>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>`;

  // Save the XML to a file
  fs.writeFile(`sitemap${new Date()}.xml`, xml, (err: any) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log('Sitemap has been saved as sitemap.xml');
    }
  });
  return xml;
}

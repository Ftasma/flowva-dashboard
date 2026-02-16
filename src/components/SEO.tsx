import { Helmet } from "react-helmet-async";

type SEOProps = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  robots?: string;
};

export default function SEO({
  title = "Flowva – Discover, Manage & Share Top Tools",
  description = "Discover the best tools, earn exclusive rewards, and grow with a thriving community. Join Flowva today!",
  image = "https://flowvahub.com/og-image.png",
  url = "https://flowvahub.com",
  type = "website",
  robots = "index, follow",
}: SEOProps) {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
}

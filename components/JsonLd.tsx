export default function JsonLd({ data }: { data: object }) {
  // Escaping "<" stops content from closing the script tag early.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}

/** Small line icons for the Sacred Activities list. */
const paths: Record<string, React.ReactNode> = {
  lotus: (
    <path d="M12 21c5 0 8-3 8-6-2 0-3 .6-4 1.5C17 13 15 11 12 8c-3 3-5 5-4 8.5C7 15.6 6 15 4 15c0 3 3 6 8 6Zm0 0c0-4 0-7 0-13" />
  ),
  heart: (
    <path d="M12 20s-7-4.35-7-9a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 4.65-7 9-7 9Z" />
  ),
  leaf: (
    <path d="M5 19c0-8 5-13 14-14 1 9-4 15-14 14Zm0 0c3-4 6-6 10-8" />
  ),
  hands: (
    <path d="M4 12l4-4v6M20 12l-4-4v6M8 14c0 3 2 5 4 5s4-2 4-5" />
  ),
  book: (
    <path d="M4 5c3-1 5-1 8 0v14c-3-1-5-1-8 0V5Zm8 0c3-1 5-1 8 0v14c-3-1-5-1-8 0" />
  ),
  bowl: (
    <path d="M4 11h16c0 4-3.5 7-8 7s-8-3-8-7Zm8-6c1.5 1 1.5 2.5 0 4" />
  ),
};

export default function ActivityIcon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {paths[name] ?? paths.lotus}
    </svg>
  );
}

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
export function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

// Node's fetch (unlike the browser's) can't resolve relative URLs, so
// server-side fetches (e.g. in getServerSideProps) need an absolute origin.
// Build it from the incoming request rather than hardcoding a domain.
export function getServerBaseUrl(req?: { headers: { host?: string; "x-forwarded-proto"?: string } }) {
    const protocol = req?.headers["x-forwarded-proto"] ?? "http";
    return `${protocol}://${req?.headers.host ?? "localhost:3000"}`;
}

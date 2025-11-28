export function urlWithHttps(url: string) {
  return url.replace(
    /^(?:(.*:)?\/\/)?(.*)/i,
    (match, schemma, nonSchemmaUrl) =>
      schemma ? match : `https://${nonSchemmaUrl}`,
  );
}

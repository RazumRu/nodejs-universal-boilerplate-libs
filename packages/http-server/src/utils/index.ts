export const getVersion = (v?: string) =>
  `${v ? `v${v}` : ``}`
    .replace(/\/$/, '')
    .replace(/^\//, '')
    .replace(/\/{1,}/g, '/');

// Display title of a PAGE block, with the shared untitled fallback.
export function pageTitleOf(props: Record<string, unknown> | undefined): string {
  return props && typeof props.title === "string" && props.title ? props.title : "無題のページ";
}

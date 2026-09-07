/** Ambient module declarations the shared @docusaurus/tsconfig does not ship. */

declare module '*.module.css' {
  const classes: {readonly [key: string]: string};
  export default classes;
}

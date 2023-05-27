/**
 * como sera o formato do parametro query
 * /tasks/:id
 */
export function buildRoutePath(path) {
  const routeParametersRegex = /:([a-zA-Z]+)/g;

  const pathWithParameters = path.replaceAll(
    routeParametersRegex,
    "(?<$1>[a-z0-9-_]+)"
  );

  // Vai ficar assim /tasks/(?<$1>[a-z0-9\-_]+)
  // Para validar esse tipo de caminho -> /tasks/a548efc8-8b1c-414c-89c0-e14414b8e30d

  const pathRegex = new RegExp(`^${pathWithParameters}(?<query>\\?(.*))?$`);

  return pathRegex;
}

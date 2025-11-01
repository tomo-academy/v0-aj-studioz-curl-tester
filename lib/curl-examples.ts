export const CURL_EXAMPLES = [
  {
    id: "get-request",
    name: "Simple GET Request",
    curl: 'curl -X GET "https://api.github.com/users/github" -H "Accept: application/json"',
    category: "Basic",
  },
  {
    id: "post-json",
    name: "POST with JSON Body",
    curl: 'curl -X POST "https://jsonplaceholder.typicode.com/posts" -H "Content-Type: application/json" -d \'{"title":"Hello","body":"World","userId":1}\'',
    category: "POST",
  },
  {
    id: "bearer-token",
    name: "Bearer Token Auth",
    curl: 'curl -X GET "https://api.github.com/user" -H "Authorization: Bearer YOUR_TOKEN" -H "Accept: application/vnd.github.v3+json"',
    category: "Auth",
  },
  {
    id: "post-form",
    name: "POST Form Data",
    curl: 'curl -X POST "https://example.com/form" -H "Content-Type: application/x-www-form-urlencoded" -d "name=John&email=john@example.com"',
    category: "POST",
  },
  {
    id: "put-request",
    name: "PUT Request",
    curl: 'curl -X PUT "https://jsonplaceholder.typicode.com/posts/1" -H "Content-Type: application/json" -d \'{"title":"Updated","body":"Content"}\'',
    category: "REST",
  },
  {
    id: "delete-request",
    name: "DELETE Request",
    curl: 'curl -X DELETE "https://jsonplaceholder.typicode.com/posts/1" -H "Accept: application/json"',
    category: "REST",
  },
  {
    id: "query-params",
    name: "Query Parameters",
    curl: 'curl -X GET "https://api.github.com/search/repositories?q=language:javascript&sort=stars&order=desc" -H "Accept: application/json"',
    category: "Params",
  },
  {
    id: "multiple-headers",
    name: "Multiple Headers",
    curl: 'curl -X POST "https://api.example.com/endpoint" -H "Authorization: Bearer token123" -H "Content-Type: application/json" -H "X-Custom-Header: value" -d \'{"data":"example"}\'',
    category: "Headers",
  },
]

export function getExamplesByCategory(category?: string) {
  if (!category) return CURL_EXAMPLES
  return CURL_EXAMPLES.filter((ex) => ex.category === category)
}

export function getCategories() {
  return [...new Set(CURL_EXAMPLES.map((ex) => ex.category))]
}

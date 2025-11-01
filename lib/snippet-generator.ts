interface RequestData {
  method: string
  url: string
  headers: Record<string, string>
  body?: string
}

export function generateSnippet(language: string, request: RequestData | null | undefined): string {
  if (!request) {
    return "Error: Invalid request data"
  }

  switch (language) {
    case "javascript":
      return generateJavaScript(request)
    case "python":
      return generatePython(request)
    case "java":
      return generateJava(request)
    case "csharp":
      return generateCSharp(request)
    case "go":
      return generateGo(request)
    case "ruby":
      return generateRuby(request)
    case "php":
      return generatePHP(request)
    case "http":
      return generateHTTP(request)
    case "curl":
    default:
      return generateCURL(request)
  }
}

function generateCURL(request: RequestData): string {
  if (!request.method || !request.url) {
    return ""
  }

  let curl = `curl -X ${request.method} "${request.url}"`

  if (request.headers && typeof request.headers === "object") {
    Object.entries(request.headers).forEach(([key, value]) => {
      if (key && value) {
        curl += ` \\\n  -H "${key}: ${value}"`
      }
    })
  }

  if (request.body) {
    curl += ` \\\n  -d '${request.body}'`
  }

  return curl
}

function generateHTTP(request: RequestData): string {
  if (!request.method || !request.url) {
    return ""
  }

  const url = new URL(request.url)
  let http = `${request.method} ${url.pathname}${url.search} HTTP/1.1\r\nHost: ${url.host}`

  if (request.headers && typeof request.headers === "object") {
    Object.entries(request.headers).forEach(([key, value]) => {
      if (key && value) {
        http += `\r\n${key}: ${value}`
      }
    })
  }

  if (request.body) {
    http += `\r\nContent-Length: ${request.body.length}\r\n\r\n${request.body}`
  } else {
    http += "\r\n"
  }

  return http
}

function generateJavaScript(request: RequestData): string {
  const hasBody = request.body && (request.method === "POST" || request.method === "PUT" || request.method === "PATCH")

  return `const options = {
  method: '${request.method}',
  headers: {
${Object.entries(request.headers)
  .map(([key, value]) => `    '${key}': '${value}'`)
  .join(",\n")}
  }${hasBody ? `,\n  body: JSON.stringify(${request.body})` : ""}
};

fetch('${request.url}', options)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`
}

function generatePython(request: RequestData): string {
  const hasBody = request.body && (request.method === "POST" || request.method === "PUT" || request.method === "PATCH")

  return `import requests

url = '${request.url}'
headers = {
${Object.entries(request.headers)
  .map(([key, value]) => `    '${key}': '${value}'`)
  .join(",\n")}
}${hasBody ? `\ndata = ${request.body}` : ""}

response = requests.${request.method.toLowerCase()}(url, headers=headers${hasBody ? ", json=data" : ""})
print(response.json())`
}

function generateJava(request: RequestData): string {
  const hasBody = request.body && (request.method === "POST" || request.method === "PUT" || request.method === "PATCH")

  return `import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;

HttpClient client = HttpClient.newHttpClient();

HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()
    .uri(new URI("${request.url}"))
    .method("${request.method}", ${hasBody ? `HttpRequest.BodyPublishers.ofString("${request.body}")` : "HttpRequest.BodyPublishers.noBody()"});

${Object.entries(request.headers)
  .map(([key, value]) => `requestBuilder.header("${key}", "${value}");`)
  .join("\n")}

HttpRequest request = requestBuilder.build();

HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`
}

function generateCSharp(request: RequestData): string {
  const hasBody = request.body && (request.method === "POST" || request.method === "PUT" || request.method === "PATCH")

  return `using System;
using System.Net.Http;
using System.Threading.Tasks;

class Program {
    static async Task Main() {
        using (HttpClient client = new HttpClient()) {
${Object.entries(request.headers)
  .map(([key, value]) => `            client.DefaultRequestHeaders.Add("${key}", "${value}");`)
  .join("\n")}

            var request = new HttpRequestMessage(
                new HttpMethod("${request.method}"),
                "${request.url}"
            );
${hasBody ? `            request.Content = new StringContent("${request.body}", null, "application/json");` : ""}

            var response = await client.SendAsync(request);
            var content = await response.Content.ReadAsStringAsync();
            Console.WriteLine(content);
        }
    }
}`
}

function generateGo(request: RequestData): string {
  const hasBody = request.body && (request.method === "POST" || request.method === "PUT" || request.method === "PATCH")

  return `package main

import (
    "fmt"
    "io"
    "net/http"
    "strings"
)

func main() {
${hasBody ? `    payload := strings.NewReader("${request.body}")` : ""}
    req, _ := http.NewRequest("${request.method}", "${request.url}", ${hasBody ? "payload" : "nil"})
    
${Object.entries(request.headers)
  .map(([key, value]) => `    req.Header.Add("${key}", "${value}")`)
  .join("\n")}

    res, _ := http.DefaultClient.Do(req)
    defer res.Body.Close()
    
    body, _ := io.ReadAll(res.Body)
    fmt.Println(string(body))
}`
}

function generateRuby(request: RequestData): string {
  const hasBody = request.body && (request.method === "POST" || request.method === "PUT" || request.method === "PATCH")

  return `require 'net/http'
require 'uri'
require 'json'

uri = URI('${request.url}')
http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = uri.scheme == 'https'

request = Net::HTTP::${request.method.capitalize}.new(uri.path)
${Object.entries(request.headers)
  .map(([key, value]) => `request['${key}'] = '${value}'`)
  .join("\n")}
${hasBody ? `request.body = '${request.body}'` : ""}

response = http.request(request)
puts response.body`
}

function generatePHP(request: RequestData): string {
  const hasBody = request.body && (request.method === "POST" || request.method === "PUT" || request.method === "PATCH")

  return `<?php

$ch = curl_init();

curl_setopt_array($ch, array(
    CURLOPT_URL => '${request.url}',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST => '${request.method}',
    CURLOPT_HTTPHEADER => array(
${Object.entries(request.headers)
  .map(([key, value]) => `        '${key}: ${value}'`)
  .join(",\n")}
    )${hasBody ? `,\n    CURLOPT_POSTFIELDS => '${request.body}'` : ""}
));

$response = curl_exec($ch);
echo $response;

curl_close($ch);
?>`
}

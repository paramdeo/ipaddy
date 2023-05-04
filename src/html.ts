export const templateHTML = (userIPAddress: string) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IP Addy</title>
  </head>
  <style>
  html, body {
    font-family: "Fira Mono", "Cascadia Code", "Source Code Pro", SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
    margin: 0;
    padding: 0 0.75rem 0 0.75rem;
    background-color: #0a0a0a;
    color: #4af626;
  }
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 100vh;
  }
  </style>  
  <body>
    <div class="container">
      <div>
        <p>${userIPAddress}</p>
      </div>
    </div> 
  </body>
  </html>`
}

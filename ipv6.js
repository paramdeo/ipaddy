addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
  })
  async function handleRequest(request) {
    let response = fetch(request)
    if ( request.headers.get('CF-Connecting-IP').includes(':') ) {
      response.body = request.headers.get('CF-Connecting-IP') + "\n"
    } else {
      response.body = "You do not have an IPv6 address...\n"
    }
    response = new Response(response.body, response)
    response.headers.set('Content-Type', 'text/plain; charset=utf-8')
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET')
    response.headers.set('X-NFO', 'Find out more at https://use.ipaddy.net')
    return response
  }

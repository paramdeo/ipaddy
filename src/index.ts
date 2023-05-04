import { Hono } from 'hono'
import { z } from 'zod'

import { templateHTML } from './html'
import { commandLineUserAgents } from './user-agents'

const ip = z.string().ip()
const agent = z.string()
const geo = z.string()
const ipv4 = z.string().ip({ version: "v4" })
const ipv6 = z.string().ip({ version: "v6" })

const cloudFlareHeaders = {
  connectingIP: "CF-Connecting-IP",
  userAgent: "User-Agent",
  geoLocation: "CF-IPCountry"
}

// Extracting this function since each request will have
// to get the User-Agent header: 'c.req.header(cloudFlareHeaders.userAgent)'
const getUserAgent = (callback: unknown) => {
  // A callback needs to be used since 'c.req.header' is scoped within Hono's context
  let userAgent = agent.parse(callback)
  return userAgent
}

const getSanitizedUserAgent = (userAgent: string) => {
  // xh/0.15.0 => xh
  // Wget/1.21.1-dirty => wget
  let sanitizedUserAgent = userAgent.toLowerCase().slice(0, userAgent.indexOf('/'))
  return sanitizedUserAgent
}

const app = new Hono({ strict: false })

app.get('/', (c) => {
  let userIPAddress = ip.parse(c.req.header(cloudFlareHeaders.connectingIP))

  let userAgent = getUserAgent(c.req.header(cloudFlareHeaders.userAgent))
  if ( commandLineUserAgents.has(getSanitizedUserAgent(userAgent)) || commandLineUserAgents.has(userAgent.toLowerCase()) ) {
    // Return text/plain for CLI user agents
    return c.text(userIPAddress)
  }

  // Return text/html for other user agents
  c.header("Content-Type", "text/html")
  return c.html(templateHTML(userIPAddress))
})

app.onError((err: any, c) => {
  // Very graceful, much clarity...
  return c.redirect('/', 302)
})

app.notFound((c) => {
  // Return list of valid paths
  c.header("Content-Type", "text/html")
  return c.html(templateHTML('Hold up! Valid paths are:\n\n/v4\n/v6\n/geo\n/agent'), 404)
})

app.get('/v4', (c) => {
  let userIPv4Address = ipv4.parse(c.req.header(cloudFlareHeaders.connectingIP))

  let userAgent = getUserAgent(c.req.header(cloudFlareHeaders.userAgent))
  if ( commandLineUserAgents.has(getSanitizedUserAgent(userAgent)) || commandLineUserAgents.has(userAgent.toLowerCase()) ) {
    return c.text(userAgent)
  }

  c.header("Content-Type", "text/html")
  return c.html(templateHTML(userIPv4Address))
})

app.get('/v6', (c) => {
  let userIPv6Address = ipv6.parse(c.req.header(cloudFlareHeaders.connectingIP))

  let userAgent = getUserAgent(c.req.header(cloudFlareHeaders.userAgent))
  if ( commandLineUserAgents.has(getSanitizedUserAgent(userAgent)) || commandLineUserAgents.has(userAgent.toLowerCase()) ) {
    return c.text(userAgent)
  }

  c.header("Content-Type", "text/html")
  return c.html(templateHTML(userIPv6Address))
})

app.get('/agent', (c) => {
  let userAgent = getUserAgent(c.req.header(cloudFlareHeaders.userAgent))

  if ( commandLineUserAgents.has(getSanitizedUserAgent(userAgent)) || commandLineUserAgents.has(userAgent.toLowerCase()) ) {
    return c.text(userAgent)
  }
  
  c.header("Content-Type", "text/html")
  return c.html(templateHTML(userAgent))
})

app.get('/geo', (c) => {
  let userGeoLocation = geo.parse(c.req.header(cloudFlareHeaders.geoLocation))
  
  let userAgent = getUserAgent(c.req.header(cloudFlareHeaders.userAgent))
  if ( commandLineUserAgents.has(getSanitizedUserAgent(userAgent)) || commandLineUserAgents.has(userAgent.toLowerCase()) ) {
    return c.text(userGeoLocation)
  }

  c.header("Content-Type", "text/html")
  return c.html(templateHTML(userGeoLocation))
})

export default app

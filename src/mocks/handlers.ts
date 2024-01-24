import { http, HttpResponse } from 'msw'
 
export const handlers = [
    http.get('/api/test', () => {
        console.log("request test msw")
        // And respond with a "text/plain" response
        // with a "Hello world!" text response body.
        return HttpResponse.json('Hello world!')
      }),
]
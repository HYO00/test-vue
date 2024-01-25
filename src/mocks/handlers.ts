import { http, HttpResponse } from 'msw'
import list from "./node.ts"
 
export const handlers = [
    http.get('/api/test', () => {
        console.log("request test msw")
        // And respond with a "text/plain" response
        // with a "Hello world!" text response body.
        return HttpResponse.json(list)
    }),

]
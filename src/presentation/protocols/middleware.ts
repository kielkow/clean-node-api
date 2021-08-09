import { HttpResponse } from './http'

export interface Middleware<T = any> {
  handle: (equest: T) => Promise<HttpResponse>
}

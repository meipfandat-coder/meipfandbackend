export class APIResponse {
  constructor(public status: number = 200, public message: string='data fetched successfully', public data: any = {}) {
  }
}

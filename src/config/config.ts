interface ConfigProps{
    DB_URL: string,
    PORT:number,
    V1_URL:string,
    RefreshTokenSecret:string,
    AccessTokenSecret:string,
    VerifyTokenSecret:string,
    ForgotTokenSecret:string,
    StripeSecret:string,
}

export const config:ConfigProps={
    DB_URL: process.env.DB_URL ?? '',
    V1_URL: process.env.V1_URL ?? '',
    PORT: Number(process.env.PORT) ?? 8000,
    RefreshTokenSecret:process.env.RefreshTokenSecret ?? '',
    AccessTokenSecret:process.env.AccessTokenSecret ?? '',
    VerifyTokenSecret:process.env.VerifyTokenSecret ?? '',
    ForgotTokenSecret:process.env.ForgotTokenSecret ?? '',
    StripeSecret:process.env.StripeSecret ?? '',
}
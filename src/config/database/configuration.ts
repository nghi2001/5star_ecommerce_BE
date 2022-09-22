export default () => ({
    DB_PORT: parseInt(process.env.PORT ?? '3000') || 3000,
    DB_HOSR: process.env.DB_HOST || 'localhost',
    DB_USER: process.env.DB_USERNAME || '',
    DB_PASS: process.env.DB_PASSWPRD || ''
})
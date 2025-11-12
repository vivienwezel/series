export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event)
    const body = await readBody(event)

    // Use the redirect_to from the request body, or default to the base URL
    const redirectTo = body?.redirect_to || 'http://localhost:3000/auth/callback'

    const url = 'https://api.themoviedb.org/4/auth/request_token'
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${config.apiSecretReadOnly}`
        },
        body: JSON.stringify({redirect_to: redirectTo})
    }

    try {
        const response = await fetch(url, options)
        const data = await response.json()

        if (data.success && data.request_token) {
            // Return the request token and the authorization URL
            return {
                success: true,
                request_token: data.request_token,
                auth_url: `https://www.themoviedb.org/auth/access?request_token=${data.request_token}`
            }
        } else {
            return {
                success: false,
                error: data.status_message || 'Failed to create request token'
            }
        }
    } catch (err) {
        console.error('Error creating request token:', err)
        return {
            success: false,
            error: 'Failed to create request token'
        }
    }
})
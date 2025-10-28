export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event)
    const body = await readBody(event)
    
    if (!body?.request_token) {
        return {
            success: false,
            error: 'Request token is required'
        }
    }
    
    const url = 'https://api.themoviedb.org/4/auth/access_token'
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${config.apiSecret}`
        },
        body: JSON.stringify({ request_token: body.request_token })
    }

    try {
        const response = await fetch(url, options)
        const data = await response.json()
        
        if (data.success && data.access_token) {
            // Return the access token and account details
            return {
                success: true,
                access_token: data.access_token,
                account_id: data.account_id
            }
        } else {
            return {
                success: false,
                error: data.status_message || 'Failed to create access token'
            }
        }
    } catch (err) {
        console.error('Error creating access token:', err)
        return {
            success: false,
            error: 'Failed to create access token'
        }
    }
})

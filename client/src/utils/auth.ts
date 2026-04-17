export async function triggerAuth() {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                redirectPath: window.location.pathname
            }),
            credentials: 'include'
        });

        const data = await response.json();

        if (data.url) {
            window.location.href = data.url;
        }
    } catch (error) {
        console.error('Authentication error:', error);
    }
}

export async function triggerAuth() {
    try {
        const redirectPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                redirectPath
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

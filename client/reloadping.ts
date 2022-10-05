async function initReloadPing() {
    session = await ping();

    setInterval(async () => {
        const res = await ping();
        if (res != session) {
            location.reload();
        }
    }, 1000);
}

async function ping() {
    return await (await fetch("/api/v3/app/reload/ping")).text();
}

let session = "";

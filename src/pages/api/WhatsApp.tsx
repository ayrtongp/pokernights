const server = process.env.NEXT_PUBLIC_APIWA_SERVER
const key = process.env.NEXT_PUBLIC_APIWA_KEY


export async function sendMessage(to: string, text: string) {
    const url = `${server}/${key}/message/text`
    console.log(url)
    const body = { to, text }
    const method = 'POST'
    const headers = { 'Content-Type': 'application/json', }
    const options = { method, headers, body: JSON.stringify(body), }


    const sendMessage = await fetch(url, options)
    const result = await sendMessage.json()
    return result
}



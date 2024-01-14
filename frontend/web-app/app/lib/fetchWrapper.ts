import { getTokenWorkaround } from "@/app/actions/authActions"

const baseUrl = process.env.API_URL

async function get(url: string) {
  const resquestOptions = {
    method: "GET",
    headers: await getHeaders(),
  }

  const response = await fetch(baseUrl + url, resquestOptions)

  return await handleResponse(response)
}

async function post(url: string, body: {}) {
  const resquestOptions = {
    method: "POST",
    headers: await getHeaders(),
    body: JSON.stringify(body),
  }

  const response = await fetch(baseUrl + url, resquestOptions)

  return await handleResponse(response)
}

async function put(url: string, body: {}) {
  const resquestOptions = {
    method: "PUT",
    headers: await getHeaders(),
    body: JSON.stringify(body),
  }

  const response = await fetch(baseUrl + url, resquestOptions)

  return await handleResponse(response)
}

async function del(url: string) {
  const resquestOptions = {
    method: "DELETE",
    headers: await getHeaders(),
  }

  const response = await fetch(baseUrl + url, resquestOptions)

  return await handleResponse(response)
}

async function getHeaders() {
  const token = await getTokenWorkaround()
  const headers = { "Content-type": "application/json" } as any

  if (token) {
    headers.Authorization = "Bearer " + token.access_token
  }

  return headers
}

async function handleResponse(response: Response) {
  const text = await response.text()
  // const data = text && JSON.parse(text)
  let data

  try {
    data = JSON.parse(text)
  } catch (error) {
    data = text
  }

  if (response.ok) {
    return data || response.statusText
  } else {
    const error = {
      status: response.status,
      message: typeof data === "string" ? data : response.statusText,
    }

    return { error }
  }
}

export const fetchWrapper = {
  get,
  post,
  put,
  del,
}

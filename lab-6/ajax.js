class Ajax {
  constructor(options = {}) {
    this.defaultOptions = {
      baseURL: options.baseURL || "",
      timeout: options.timeout || 5000,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    };
  }

  async request(method, url, data = null, options = {}) {
    const finalOptions = {
      ...this.defaultOptions,
      ...options,
      headers: {
        ...this.defaultOptions.headers,
        ...(options.headers || {})
      }
    };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), finalOptions.timeout);

    const fetchOptions = {
      method,
      headers: finalOptions.headers,
      signal: controller.signal
    };

    if (data !== null) {
      fetchOptions.body = JSON.stringify(data);
    }

    const fullURL = finalOptions.baseURL + url;

    let res;

    try {
      res = await fetch(fullURL, fetchOptions);
    } catch (err) {
      clearTimeout(timer);
      if (err.name === "AbortError") {
        throw new Error(`Timeout: request aborted after ${finalOptions.timeout} ms`);
      }
      throw new Error("Network error: " + err.message);
    }

    clearTimeout(timer);

    if (!res.ok) {
      let message = `HTTP error ${res.status}`;
      try {
        const errData = await res.json();
        message += ": " + JSON.stringify(errData);
      } catch (_) {}
      throw new Error(message);
    }

    try {
      return await res.json();
    } catch (err) {
      throw new Error("Invalid JSON response");
    }
  }

  async get(url, options) {
    return this.request("GET", url, null, options);
  }

  async post(url, data, options) {
    return this.request("POST", url, data, options);
  }

  async put(url, data, options) {
    return this.request("PUT", url, data, options);
  }

  async delete(url, options) {
    return this.request("DELETE", url, null, options);
  }
}
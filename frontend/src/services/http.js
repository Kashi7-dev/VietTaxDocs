// Lớp gọi API dùng chung. Mọi request tới backend đều đi qua hàm request() ở đây.
// Địa chỉ gốc lấy từ biến môi trường VITE_API_BASE_URL, mặc định "/api".
const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(status, message, detail = null) {
    super(message);
    this.name = "ApiError";
    this.status = status; // mã HTTP, 0 nếu không kết nối được tới server
    this.detail = detail; // thông báo gốc từ backend (tiếng Anh), dùng để gỡ lỗi
  }
}

let getToken = () => null;
let onUnauthorized = () => {};

// main.js gọi hàm này một lần để nối với store đăng nhập
// (http.js không tự import store để tránh phụ thuộc vòng).
export function configureHttp({ tokenProvider, unauthorizedHandler }) {
  getToken = tokenProvider;
  onUnauthorized = unauthorizedHandler;
}

// Thông báo tiếng Việt thân thiện theo mã lỗi.
function defaultMessage(status) {
  if (status === 400) return "Dữ liệu gửi lên không hợp lệ.";
  if (status === 401) return "Phiên đăng nhập không hợp lệ hoặc đã hết hạn.";
  if (status === 404) return "Không tìm thấy dữ liệu yêu cầu.";
  if (status === 409) return "Dữ liệu đã tồn tại.";
  if (status >= 500) return "Máy chủ đang gặp sự cố, vui lòng thử lại sau.";
  return `Đã xảy ra lỗi (${status}).`;
}

// path: đường dẫn sau /api, ví dụ "/documents"
// options: { method, query (object), body (object), auth (true = gửi kèm token) }
export async function request(path, { method = "GET", query, body, auth = false } = {}) {
  const url = new URL(`${BASE_URL}${path}`, window.location.origin);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, value);
      }
    }
  }

  const headers = {};
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  const token = getToken();
  if (auth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, "Không kết nối được tới máy chủ. Vui lòng kiểm tra mạng và thử lại.");
  }

  let data = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    // Token hết hạn: báo cho store đăng xuất (chỉ với request có gửi token).
    if (response.status === 401 && auth) {
      onUnauthorized();
    }
    throw new ApiError(
      response.status,
      defaultMessage(response.status),
      data && data.message ? data.message : null,
    );
  }

  return data;
}
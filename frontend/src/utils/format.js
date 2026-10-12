export const DOCUMENT_TYPE_LABELS = {
  luat: "Luật",
  nghi_dinh: "Nghị định",
  thong_tu: "Thông tư",
  cong_van: "Công văn",
  quyet_dinh: "Quyết định",
};

export const STATUS_LABELS = {
  con_hieu_luc: "Còn hiệu lực",
  het_hieu_luc: "Hết hiệu lực",
  sap_hieu_luc: "Sắp có hiệu lực",
};

export const PERIOD_LABELS = {
  monthly: "Theo tháng",
  yearly: "Theo năm",
};

// API trả cột DATE dạng "2025-03-01" -> hiển thị "01/03/2025".
export function formatDate(value) {
  if (!value) return "—";
  const [year, month, day] = String(value).slice(0, 10).split("-");
  if (!year || !month || !day) return "—";
  return `${day}/${month}/${year}`;
}

// API trả thời điểm dạng ISO (có múi giờ) -> hiển thị theo giờ máy người dùng.
export function formatDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(date);
}

const vndFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

export function formatVnd(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  return vndFormatter.format(value);
}

export function formatPercent(value) {
  return `${Number(value).toLocaleString("vi-VN", { maximumFractionDigits: 2 })}%`;
}

// Chỉ cho phép liên kết http(s). Dữ liệu từ nguồn bên ngoài có thể chứa địa chỉ nguy hiểm
// (ví dụ "javascript:..."), nên không bao giờ gắn thẳng vào href mà không kiểm tra.
export function safeUrl(value) {
  return typeof value === "string" && /^https?:\/\//i.test(value) ? value : null;
}
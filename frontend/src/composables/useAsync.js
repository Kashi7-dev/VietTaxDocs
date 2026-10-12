import { ref } from "vue";

// Quản lý trạng thái của một thao tác bất đồng bộ (gọi API):
// data (kết quả), error (lỗi), loading (đang chạy) và hàm run() để thực hiện.
//
// Nếu run() được gọi liên tiếp (ví dụ gõ tìm kiếm nhanh), chỉ kết quả của lần gọi
// MỚI NHẤT được ghi nhận, kết quả muộn của lần gọi cũ bị bỏ qua.
export function useAsync(asyncFn) {
  const data = ref(null);
  const error = ref(null);
  const loading = ref(false);
  let latestCall = 0;

  async function run(...args) {
    const callId = ++latestCall;
    loading.value = true;
    error.value = null;

    try {
      const result = await asyncFn(...args);
      if (callId === latestCall) data.value = result;
      return result;
    } catch (err) {
      if (callId === latestCall) error.value = err;
      return undefined;
    } finally {
      if (callId === latestCall) loading.value = false;
    }
  }

  return { data, error, loading, run };
}
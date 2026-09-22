type FrameTraceProps = {
  /**
   * Bán kính bo góc của khung, tính bằng pixel.
   * Phải khớp với class bo góc của phần tử cha (rounded-2xl = 16).
   */
  radius?: number;
};

/**
 * Đường viền chạy quanh khung khi hover hoặc khi focus vào bên trong khung.
 * Dùng thay cho hiệu ứng phóng to ảnh.
 *
 * Đặt bên trong một phần tử có class `frame-trace`. Nét vẽ là một hình chữ nhật
 * SVG bo góc nên chạy đúng theo viền cong của thẻ; `pathLength={1}` chuẩn hóa
 * chu vi về 1 để khung lớn hay nhỏ đều chạy hết vòng trong cùng thời gian.
 */
export function FrameTrace({ radius = 16 }: FrameTraceProps) {
  return (
    <svg className="frame-trace__line" aria-hidden="true" focusable="false">
      <rect
        className="frame-trace__rect"
        x="0"
        y="0"
        width="100%"
        height="100%"
        rx={radius}
        ry={radius}
        pathLength={1}
      />
    </svg>
  );
}

import { Fragment } from 'react';

/**
 * Tách các cụm chữ số ra khỏi phần chữ.
 * Nhóm bắt (dấu ngoặc) khiến `split` trả về xen kẽ: chỉ số chẵn là chữ,
 * chỉ số lẻ là cụm số.
 */
const DIGIT_RUN = /(\d+(?:[.,]\d+)*)/;

/**
 * Hiển thị một đoạn chữ sao cho mọi chữ số đều dùng font chữ chung (Montserrat),
 * kể cả khi đoạn chữ đó nằm trong tiêu đề dùng font serif.
 *
 * Dùng cho các tiêu đề có lẫn số trong tên sản phẩm, ví dụ
 * “Black Snail & Peptide 9 Perfect Emulsion 120ml”.
 */
export function Numerals({ children }: { children: string }) {
  return (
    <>
      {children.split(DIGIT_RUN).map((part, index) =>
        index % 2 === 1 ? (
          <span key={index} className="font-sans">
            {part}
          </span>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}

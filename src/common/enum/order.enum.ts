export enum ORDER_STATUS {
    UN_PAID = 0,
    NO_PROCESS = 1,           // Đã thanh toán
    PROCESS = 2,         // Chưa thanh toán
    DELIVERING = 3,     // Đang giao hàng
    SUCCESS = 4,        // Thành công
    FAILED = 5,         // Đơn hàng thát bại
}
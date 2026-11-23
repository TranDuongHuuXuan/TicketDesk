# User Stories — TicketDesk (Week 02)

> Các story là đề xuất để thảo luận, chưa được stakeholder xác nhận. Ưu tiên là MoSCoW sơ bộ. Story được giữ độc lập tương đối, có giá trị người dùng và có thể kiểm thử; các chi tiết về danh tính, quy trình và dữ liệu vẫn là câu hỏi mở.

## Epic A — Tiếp nhận và theo dõi yêu cầu

### US-01 — Gửi ticket
**As a** người cần hỗ trợ, **I want** gửi yêu cầu với mô tả vấn đề, **so that** nhóm hỗ trợ có thể tiếp nhận và xử lý.

- **Ưu tiên:** Must
- **INVEST:** Giá trị rõ; có thể ước lượng/kiểm thử sau khi xác định trường bắt buộc; có thể chia trường thông tin mà không phụ thuộc story khác.
- **Cần xác nhận:** Thông tin liên hệ, chủ đề, tệp đính kèm, kênh gửi.

### US-02 — Nhận mã tham chiếu
**As a** người gửi ticket, **I want** nhận mã tham chiếu sau khi gửi thành công, **so that** tôi có thể nhận biết yêu cầu của mình.

- **Ưu tiên:** Should
- **INVEST:** Giá trị độc lập; kiểm thử được bằng việc gửi hợp lệ và nhận mã; cách phân phối mã cần thống nhất.

### US-03 — Xem trạng thái ticket của tôi
**As a** người gửi, **I want** xem trạng thái ticket của mình, **so that** tôi biết yêu cầu đang được xử lý đến đâu.

- **Ưu tiên:** Must
- **Cần xác nhận:** Cách nhận diện/đăng nhập và quyền xem.

### US-04 — Bổ sung thông tin
**As a** người gửi, **I want** bổ sung thông tin cho ticket đang mở, **so that** nhóm hỗ trợ có đủ dữ kiện để xử lý.

- **Ưu tiên:** Should
- **Cần xác nhận:** Có cho phép người gửi sửa nội dung cũ hay chỉ thêm trao đổi?

## Epic B — Xử lý ticket

### US-05 — Xem hàng đợi xử lý
**As a** nhân viên hỗ trợ, **I want** xem các ticket cần xử lý, **so that** tôi có thể chọn yêu cầu phù hợp để giải quyết.

- **Ưu tiên:** Must
- **Cần xác nhận:** Hàng đợi cá nhân hay dùng chung; thứ tự mặc định.

### US-06 — Cập nhật trạng thái
**As a** nhân viên hỗ trợ, **I want** cập nhật trạng thái ticket, **so that** tiến độ phản ánh đúng quy trình.

- **Ưu tiên:** Must
- **Cần xác nhận:** Tên trạng thái, quy tắc chuyển trạng thái, quyền đóng/mở lại.

### US-07 — Trao đổi trên ticket
**As a** nhân viên hỗ trợ, **I want** ghi phản hồi gắn với ticket, **so that** người gửi nhận được hướng xử lý.

- **Ưu tiên:** Must
- **Cần xác nhận:** Trao đổi nội bộ, công khai hay cả hai; thông báo kèm theo.

### US-08 — Phân loại ticket
**As a** nhân viên hỗ trợ, **I want** gắn chủ đề/danh mục cho ticket, **so that** yêu cầu được xử lý và thống kê nhất quán.

- **Ưu tiên:** Should
- **Cần xác nhận:** Bộ danh mục và người duy trì.

### US-09 — Phân công ticket
**As a** quản lý hỗ trợ, **I want** gán ticket cho nhân viên hoặc nhóm, **so that** trách nhiệm xử lý được rõ ràng.

- **Ưu tiên:** Should
- **Cần xác nhận:** Phân công thủ công hay tự động; trường hợp chuyển người xử lý.

## Epic C — Phối hợp và quan sát

### US-10 — Nhận thông báo cập nhật
**As a** người liên quan đến ticket, **I want** nhận thông báo khi có cập nhật quan trọng, **so that** tôi không bỏ lỡ phản hồi hoặc thay đổi trạng thái.

- **Ưu tiên:** Should
- **Cần xác nhận:** Kênh, sự kiện, tùy chọn tắt/mở thông báo.

### US-11 — Tìm và lọc ticket
**As a** nhân viên hỗ trợ, **I want** tìm/lọc ticket theo tiêu chí phù hợp, **so that** tôi nhanh chóng tìm được yêu cầu cần xử lý.

- **Ưu tiên:** Could
- **Cần xác nhận:** Trường tìm kiếm, quyền xem, khối lượng dữ liệu.

### US-12 — Xem tổng quan hoạt động
**As a** quản lý hỗ trợ, **I want** xem số lượng ticket theo trạng thái và khoảng thời gian, **so that** tôi theo dõi khối lượng và tiến độ chung.

- **Ưu tiên:** Could
- **Cần xác nhận:** Chỉ số, phạm vi thời gian và quyền truy cập.

## Ghi chú INVEST

INVEST được dùng như checklist để rà soát: Independent, Negotiable, Valuable, Estimable, Small, Testable. Các story trên chưa được xác nhận đủ điều kiện triển khai; cần phân rã/ước lượng sau khi có câu trả lời nghiệp vụ. Tên vai trò người dùng có thể thay đổi theo kết quả xác định stakeholder.

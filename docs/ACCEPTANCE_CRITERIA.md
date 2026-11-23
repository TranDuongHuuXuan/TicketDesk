# Acceptance Criteria — TicketDesk (Week 02)

> Tiêu chí dưới đây là ví dụ nghiệm thu cho các story đề xuất, chưa phải tiêu chí đã được mentor/khách hàng phê duyệt. Các thuật ngữ như “hợp lệ”, “trạng thái hợp lệ” cần được định nghĩa cùng stakeholder.

## US-01 — Gửi ticket

- **Given** người gửi đang ở biểu mẫu tạo ticket và đã nhập các trường bắt buộc theo quy định đã thống nhất, **When** người gửi gửi yêu cầu, **Then** hệ thống ghi nhận ticket và hiển thị kết quả gửi thành công cùng mã tham chiếu.
- **Given** người gửi bỏ trống một trường bắt buộc, **When** người gửi gửi yêu cầu, **Then** hệ thống chỉ rõ trường cần bổ sung và không tạo ticket thiếu dữ liệu.

## US-02 — Nhận mã tham chiếu

- **Given** ticket được tạo thành công, **When** hệ thống hoàn tất tiếp nhận, **Then** người gửi nhận được mã tham chiếu gắn với ticket đó.

## US-03 — Xem trạng thái ticket của tôi

- **Given** người gửi cung cấp thông tin nhận diện hợp lệ cho một ticket thuộc phạm vi được phép xem, **When** người gửi yêu cầu xem ticket, **Then** hệ thống hiển thị trạng thái hiện tại và thông tin được phép công khai.
- **Given** ticket không thuộc phạm vi được phép xem, **When** người gửi yêu cầu xem ticket, **Then** hệ thống không tiết lộ nội dung ticket.

## US-04 — Bổ sung thông tin

- **Given** ticket đang ở trạng thái cho phép bổ sung, **When** người gửi gửi thêm thông tin hợp lệ, **Then** nội dung bổ sung được gắn vào đúng ticket và có thể nhận biết là cập nhật mới.
- **Given** ticket không cho phép bổ sung, **When** người gửi thử gửi thêm thông tin, **Then** hệ thống thông báo ticket không nhận cập nhật và không ghi nhận nội dung đó.

## US-05 — Xem hàng đợi xử lý

- **Given** nhân viên hỗ trợ được phép truy cập, **When** nhân viên mở danh sách ticket cần xử lý, **Then** hệ thống hiển thị các ticket thuộc phạm vi của nhân viên cùng trạng thái hiện tại.
- **Given** không có ticket phù hợp, **When** nhân viên mở hàng đợi, **Then** hệ thống hiển thị trạng thái danh sách trống dễ hiểu.

## US-06 — Cập nhật trạng thái

- **Given** nhân viên có quyền cập nhật một ticket và chọn chuyển trạng thái được phép, **When** nhân viên lưu thay đổi, **Then** trạng thái mới được hiển thị trên ticket.
- **Given** chuyển trạng thái không được phép theo quy trình đã thống nhất, **When** nhân viên thử lưu, **Then** hệ thống từ chối thay đổi và giải thích cần làm gì tiếp theo.

## US-07 — Trao đổi trên ticket

- **Given** nhân viên có quyền phản hồi ticket và nhập nội dung hợp lệ, **When** nhân viên gửi phản hồi, **Then** phản hồi gắn đúng ticket và hiển thị cho đúng nhóm người xem theo loại trao đổi.
- **Given** nội dung phản hồi rỗng, **When** nhân viên gửi, **Then** hệ thống không tạo phản hồi rỗng và chỉ rõ vấn đề.

## US-08 — Phân loại ticket

- **Given** nhân viên có quyền phân loại ticket và danh mục còn hiệu lực, **When** nhân viên chọn một danh mục, **Then** ticket hiển thị danh mục đã chọn.
- **Given** danh mục không còn hợp lệ, **When** nhân viên lưu phân loại, **Then** hệ thống yêu cầu chọn danh mục hợp lệ.

## US-09 — Phân công ticket

- **Given** quản lý có quyền phân công và người/nhóm được chọn còn hoạt động, **When** quản lý gán ticket, **Then** ticket hiển thị người/nhóm chịu trách nhiệm.
- **Given** người/nhóm được chọn không đủ điều kiện nhận ticket, **When** quản lý lưu phân công, **Then** hệ thống từ chối và nêu lý do.

## US-10 — Nhận thông báo cập nhật

- **Given** một sự kiện đã được xác định là cần thông báo và người nhận đủ điều kiện nhận, **When** sự kiện xảy ra, **Then** người nhận được thông báo qua kênh đã thống nhất với liên kết hoặc mã tham chiếu phù hợp.
- **Given** người nhận đã tắt loại thông báo tùy chọn, **When** sự kiện tùy chọn xảy ra, **Then** không gửi loại thông báo đó.

## US-11 — Tìm và lọc ticket

- **Given** nhân viên nhập tiêu chí tìm kiếm/lọc hợp lệ, **When** yêu cầu được thực hiện, **Then** chỉ các ticket vừa khớp tiêu chí vừa thuộc phạm vi xem được hiển thị.
- **Given** không có kết quả phù hợp, **When** tìm kiếm hoàn tất, **Then** hệ thống hiển thị thông báo không có kết quả.

## US-12 — Xem tổng quan hoạt động

- **Given** quản lý có quyền xem báo cáo và chọn khoảng thời gian hợp lệ, **When** mở tổng quan, **Then** hệ thống hiển thị số ticket theo trạng thái trong phạm vi thời gian đó.
- **Given** khoảng thời gian không hợp lệ, **When** quản lý yêu cầu tổng quan, **Then** hệ thống chỉ rõ điều kiện thời gian cần sửa.

## Điều kiện nghiệm thu xuyên suốt cần chốt

- Danh tính và quyền của người gửi, nhân viên, quản lý.
- Tập trạng thái và quy tắc chuyển trạng thái.
- Trường bắt buộc, quy tắc dữ liệu hợp lệ và nội dung có thể hiển thị.
- Hành vi khi lỗi, thời gian phản hồi, khả năng tiếp cận và trình duyệt/thiết bị mục tiêu.

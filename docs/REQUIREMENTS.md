# Requirements — TicketDesk (Week 02)

> **Trạng thái:** Baseline đề xuất để thảo luận. Repo hiện chưa có mô tả nghiệp vụ ngoài tên dự án; không có yêu cầu nào trong tài liệu này được xem là đã được khách hàng/mentor xác nhận.

## 1. Mục tiêu và phạm vi dự kiến

Giả thuyết cần kiểm chứng: TicketDesk giúp một nhóm tiếp nhận yêu cầu hỗ trợ dưới dạng ticket, theo dõi tiến độ xử lý và trao đổi với người gửi. Đối tượng phục vụ (nội bộ hay khách hàng bên ngoài), quy trình hiện tại và tiêu chí thành công còn mở.

**Trong phạm vi phân tích tuần 02:** stakeholder, phạm vi nghiệp vụ, yêu cầu chức năng/phi chức năng, user stories, tiêu chí nghiệm thu, ưu tiên MoSCoW và MVP đề xuất.

**Ngoài phạm vi triển khai tuần 02:** code frontend/backend, database/schema/migration, REST API, xác thực/phân quyền thực thi, ERD hoàn chỉnh và triển khai hệ thống.

## 2. Quy ước trạng thái

- **Giả định:** đề xuất hợp lý để phỏng vấn, chưa có bằng chứng xác nhận.
- **Câu hỏi mở:** cần stakeholder có thẩm quyền trả lời.
- **Xác nhận:** chỉ dùng khi có câu trả lời/bằng chứng và ghi nguồn. Hiện chưa có mục nào đạt trạng thái này.

## 3. Yêu cầu chức năng sơ bộ

| ID | Yêu cầu | Ưu tiên đề xuất | Trạng thái / câu hỏi |
|---|---|---|---|
| FR-01 | Người gửi có thể tạo ticket với nội dung và thông tin liên hệ cần thiết. | Must | Giả định. Trường bắt buộc và kênh gửi cần xác nhận. |
| FR-02 | Người gửi có thể xem danh sách và trạng thái các ticket thuộc phạm vi của mình. | Must | Giả định. Cách nhận diện người gửi chưa rõ. |
| FR-03 | Nhân viên hỗ trợ có thể xem danh sách ticket cần xử lý. | Must | Giả định. Phạm vi truy cập chưa xác nhận. |
| FR-04 | Nhân viên hỗ trợ có thể cập nhật trạng thái ticket theo quy trình đã thống nhất. | Must | Giả định. Tập trạng thái và chuyển trạng thái mở. |
| FR-05 | Nhân viên hỗ trợ có thể trao đổi/cập nhật nội dung xử lý gắn với ticket. | Must | Giả định. Trao đổi công khai hay nội bộ cần xác nhận. |
| FR-06 | Nhân viên hỗ trợ có thể phân loại ticket bằng danh mục/chủ đề. | Should | Giả định. Danh mục do ai quản lý cần xác nhận. |
| FR-07 | Ticket có thể được gán cho nhân viên hoặc nhóm xử lý. | Should | Giả định. Quy tắc phân công tự động/thủ công mở. |
| FR-08 | Hệ thống thông báo cho bên liên quan khi có sự kiện quan trọng. | Should | Giả định. Sự kiện, kênh và tùy chọn thông báo mở. |
| FR-09 | Người dùng có thể tìm kiếm/lọc ticket theo các tiêu chí phù hợp với vai trò. | Could | Giả định. Tiêu chí và khối lượng dữ liệu mở. |
| FR-10 | Quản lý có thể xem tổng quan ticket theo trạng thái và thời gian. | Could | Giả định. Chỉ số và quyền truy cập mở. |

## 4. Yêu cầu phi chức năng sơ bộ

Các ngưỡng dưới đây chưa được cam kết; cần stakeholder kỹ thuật/nghiệp vụ xác nhận trước khi đưa thành tiêu chí nghiệm thu cuối cùng.

| ID | Thuộc tính | Đề xuất cần xác nhận |
|---|---|---|
| NFR-01 | Bảo mật và riêng tư | Chỉ người có quyền phù hợp được xem nội dung ticket; cần xác định dữ liệu nhạy cảm và thời hạn lưu. |
| NFR-02 | Hiệu năng | Xác định thời gian tải/chờ chấp nhận được cho thao tác phổ biến và tải dự kiến. |
| NFR-03 | Tính sẵn sàng | Xác định giờ phục vụ, mức gián đoạn chấp nhận được và cách xử lý sự cố. |
| NFR-04 | Khả dụng | Giao diện và thông báo lỗi cần dễ hiểu; xác minh thiết bị, trình duyệt và ngôn ngữ mục tiêu. |
| NFR-05 | Khả năng tiếp cận | Xác định tiêu chuẩn tiếp cận cần đáp ứng và nhu cầu người dùng cụ thể. |
| NFR-06 | Khả năng kiểm toán | Xác định có cần lưu lịch sử thay đổi ticket, người thực hiện và thời điểm hay không. |
| NFR-07 | Khả năng mở rộng | Ước lượng số người dùng, ticket và tệp đính kèm trong giai đoạn dự kiến. |

## 5. Ràng buộc và phụ thuộc

- Tên dự án là TicketDesk, đơn vị thực tập là Rainscales theo thông tin trong báo cáo Week 02.
- Chưa có thông tin sản phẩm, người dùng, quy trình, chính sách dữ liệu hoặc hệ thống tích hợp trong README.
- Các quyết định công nghệ, kiến trúc, mô hình dữ liệu và triển khai để dành cho tuần/phạm vi phù hợp; tài liệu này không chốt chúng.

## 6. Câu hỏi mở ưu tiên

1. Người dùng mục tiêu là ai và người có quyền chốt yêu cầu là ai?
2. TicketDesk thay thế hay bổ sung quy trình/công cụ nào?
3. Trường dữ liệu tối thiểu, trạng thái, quy tắc phân công và điều kiện đóng ticket là gì?
4. Ticket có trao đổi nội bộ, tệp đính kèm, SLA hoặc thông báo không?
5. MVP có giới hạn số người dùng/nhóm/kênh tiếp nhận nào?
6. Dữ liệu nào nhạy cảm; yêu cầu lưu trữ, quyền truy cập, hiệu năng và sẵn sàng cụ thể ra sao?
7. Ai nghiệm thu, theo tiêu chí nào, và cần bằng chứng nào?

## 7. Lịch sử xác nhận

Chưa ghi nhận phỏng vấn hoặc phê duyệt. Mỗi lần xác nhận cần ghi ngày, người xác nhận, quyết định và bằng chứng.

Thiết kế Cơ sở dữ liệu TicketDesk — Tuần 03, Ngày 01
Trạng thái: Thiết kế logic được đề xuất; chưa được phê duyệt thành lược đồ vật lý. Không bao gồm model Django, migration hay thay đổi cơ sở dữ liệu nào.

1. Bằng chứng và phạm vi
Các đầu vào đã xem xét: năm tài liệu Tuần 02 trong thư mục docs/, tài liệu PROJECT_REVIEW.md của Tuần 03, cấu hình dự án được cung cấp và model accounts hiện tại. Tuần 02 nêu rõ các yêu cầu nghiệp vụ và các bên liên quan của nó là sơ bộ và chưa được xác nhận. Cấu hình dự án được cung cấp sau đó xác nhận PostgreSQL, JWT, bốn vai trò, bốn trạng thái ticket, bình luận chỉ công khai và không có tệp đính kèm trong MVP. Model người dùng tùy chỉnh hiện tại của backend kế thừa 
AbstractUser
 của Django.

Đề xuất MVP của Tuần 02 bao gồm tạo ticket, xem ticket, cập nhật trạng thái và phản hồi của agent (US-01, US-03, US-05, US-06, US-07). Việc gán ticket, danh mục, thông báo, tìm kiếm nâng cao, báo cáo và tệp đính kèm bị loại khỏi ERD cốt lõi này. Mã tham chiếu (US-02) là có điều kiện và không được đưa vào phạm vi cam kết.

2. Các quyết định thiết kế và giả định
Đầu vào dự án đã được xác nhận
PostgreSQL là cơ sở dữ liệu mục tiêu.

Vai trò: Requester, Support Agent, Manager, Admin.

Giá trị trạng thái: NEW, IN_PROGRESS, RESOLVED, CLOSED.

Bình luận chỉ công khai; tệp đính kèm bị loại khỏi MVP.

Phạm vi dự án là MVP.

Các quyết định/giả định đề xuất cần xem xét
Một người dùng có một vai trò được lưu trên dòng người dùng. Nhiều vai trò đồng thời sẽ yêu cầu bảng trung gian vai trò và hiện chưa được quy định.

Requester phải có tài khoản; tickets.requester_id xác định chủ sở hữu. Điều này phù hợp với vai trò Requester đã xác thực và việc xem ticket theo phạm vi người dùng, nhưng các yêu cầu từ bên ngoài/khách vẫn là một câu hỏi mở.

Ticket cần có mô tả vì US-01 nêu rõ một mô tả vấn đề. Tiêu đề/chủ đề riêng, mức độ ưu tiên, danh mục, ảnh chụp thông tin liên hệ và mã tham chiếu bị lược bỏ vì tính cần thiết/ngữ nghĩa của chúng chưa được xác nhận.

Bản ghi ticket và bình luận được giữ lại thay vì xóa cứng. Sử dụng hành vi xóa khóa ngoại hạn chế (restrictive) và vô hiệu hóa tài khoản (is_active) để tránh âm thầm xóa bản ghi nghiệp vụ. Chính sách lưu trữ chưa được giải quyết.

email được biểu diễn trên người dùng và không được sao chép vào từng ticket. Serializer đăng ký hiện tại yêu cầu email, nhưng tính duy nhất của email chưa được thiết lập.

Định danh SQL được hiển thị dạng snake_case. Khóa identity BIGINT phù hợp với mặc định BigAutoField của Django.

3. Các thực thể cốt lõi và thuộc tính
3.1 users — tài khoản và vai trò
Đại diện cho một người đã được xác thực, vai trò nghiệp vụ của họ và các cờ tài khoản cốt lõi của Django. Cột mật khẩu chỉ chứa hash mật khẩu đã mã hóa của Django, không bao giờ chứa văn bản thuần.

Thuộc tính	Kiểu PostgreSQL	Null	Khóa / mặc định	Lý do
id	BIGINT	Không	PK, identity	Khóa thay thế ổn định được dùng bởi quan hệ ticket/comment.
username	VARCHAR(150)	Không	Unique	Định danh đăng nhập của AbstractUser Django.
password	VARCHAR(128)	Không	—	Hash mật khẩu đã mã hóa của Django.
email	VARCHAR(254)	Không*	—	Đăng ký hiện tại yêu cầu email. Không áp đặt Unique khi chưa có quy tắc nghiệp vụ.
role	VARCHAR(20)	Không	REQUESTER	Một vai trò nghiệp vụ được phê duyệt cho mỗi tài khoản; các mã được phép liệt kê bên dưới.
is_active	BOOLEAN	Không	TRUE	Hỗ trợ vô hiệu hóa tài khoản mà không xóa các bản ghi do tài khoản đó tạo.
is_staff	BOOLEAN	Không	FALSE	Cờ truy cập trang admin Django; khác với vai trò nghiệp vụ ADMIN.
is_superuser	BOOLEAN	Không	FALSE	Cờ bỏ qua quyền của Django; nên cấp hạn chế và không được ngụ ý bởi vai trò ADMIN.
last_login	TIMESTAMPTZ	Có	NULL	Siêu dữ liệu tài khoản Django; hữu ích cho vận hành tài khoản, không phải hành vi ticket.
date_joined	TIMESTAMPTZ	Không	CURRENT_TIMESTAMP	Thời điểm tạo tài khoản.
AbstractUser cũng bao gồm first_name và last_name; chúng có thể vẫn khả dụng trong triển khai, nhưng không có câu chuyện nào của Tuần 02 hiện yêu cầu chúng. Các quan hệ nhiều-nhiều groups và user_permissions của Django tạo ra các bảng do framework quản lý khi migration auth của Django chạy; các bảng hạ tầng đó được cố ý không mở rộng trong ERD miền này. Chúng tách biệt với bốn vai trò nghiệp vụ.

Mã role được phép: 
REQUESTER
, 
SUPPORT_AGENT
, MANAGER, ADMIN. Cơ sở dữ liệu nên thực thi tập hữu hạn này bằng ràng buộc CHECK (hoặc enum PostgreSQL nếu được chọn có chủ đích sau này). Khai báo choices của Django một mình có thể không thực thi cùng ràng buộc ở tầng cơ sở dữ liệu.

* NOT NULL theo yêu cầu của serializer đăng ký hiện tại. Cần xác nhận liệu người dùng do admin tạo hoặc hiện có có thể bỏ qua email trước khi chốt.

3.2 tickets — yêu cầu hỗ trợ
Thuộc tính	Kiểu PostgreSQL	Null	Khóa / mặc định	Lý do
id	BIGINT	Không	PK, identity	Định danh nội bộ ổn định. Không có hành vi mã tham chiếu công khai nào được xác nhận.
requester_id	BIGINT	Không	FK → users.id	Chủ sở hữu yêu cầu; hỗ trợ truy cập danh sách/chi tiết theo phạm vi requester.
description	TEXT	Không	—	Ghi lại mô tả vấn đề trong US-01. Kiểm tra độ dài/định dạng vẫn còn mở.
status	VARCHAR(20)	Không	NEW	Trạng thái hiện tại cho truy vấn danh sách/lọc hiệu quả.
created_at	TIMESTAMPTZ	Không	CURRENT_TIMESTAMP	Thời điểm tạo và thứ tự thời gian ổn định.
updated_at	TIMESTAMPTZ	Không	CURRENT_TIMESTAMP	Thời điểm thay đổi ticket gần nhất; chính sách cập nhật phải được triển khai nhất quán.
Mã status được phép: NEW, IN_PROGRESS, RESOLVED, CLOSED. Thực thi bằng ràng buộc CHECK cơ sở dữ liệu hoặc enum PostgreSQL được chọn có chủ đích. Các tên này là quyết định dự án được cung cấp; chuyển đổi trạng thái hợp lệ và vai trò nào được phép thực hiện vẫn chưa được giải quyết.

Không có assigned_to_id trong ERD MVP cốt lõi: việc gán là FR-07/US-09 ở mức ưu tiên Should và không nằm trong phạm vi MVP đề xuất. Nếu việc gán được xác nhận cho MVP, có thể thêm FK nullable tới Support Agent được gán; ngữ nghĩa một agent so với một nhóm trước tiên phải được quyết định.

3.3 comments — hội thoại ticket công khai
Thuộc tính	Kiểu PostgreSQL	Null	Khóa / mặc định	Lý do
id	BIGINT	Không	PK, identity	Định danh bình luận ổn định.
ticket_id	BIGINT	Không	FK → tickets.id	Liên kết một tin nhắn công khai với đúng một ticket.
author_id	BIGINT	Không	FK → users.id	Xác định ai đã viết tin nhắn.
body	TEXT	Không	—	Lưu nội dung bình luận. Quy tắc bình luận rỗng/độ dài vẫn còn mở.
created_at	TIMESTAMPTZ	Không	CURRENT_TIM
ESTAMP
Thứ tự hội thoại và bối cảnh kiểm toán.
Cố ý không có cột hiển thị/loại: tất cả bình luận đều công khai theo quyết định được cung cấp. Việc phân quyền vẫn cần hạn chế ai có thể đọc/viết bình luận của mỗi ticket. Hành vi chỉnh sửa/xóa chưa được quy định; đề xuất coi bình luận là bản ghi chỉ thêm (append-only).

4. Thực thể tùy chọn: lịch sử trạng thái
NFR-06 của Tuần 02 hỏi liệu có cần lịch sử kiểm toán hay không; điều này chưa được xác nhận. Do đó ticket_status_history là tùy chọn và xuất hiện trong DBML với ghi chú rõ ràng. Chỉ thêm nó sau khi xác nhận yêu cầu kiểm toán.

Thuộc tính	Kiểu PostgreSQL	Null	Khóa / mặc định	Lý do
id	BIGINT	Không	PK, identity	Xác định một bản ghi chuyển đổi.
ticket_id	BIGINT	Không	FK → tickets.id	Nhóm lịch sử theo ticket.
changed_by_id	BIGINT	Có	FK → users.id	Tác nhân gây ra chuyển đổi; chỉ nullable nếu cho phép chuyển đổi do hệ thống khởi tạo.
from_status	VARCHAR(20)	Có	NULL cho trạng thái ban đầu	Trạng thái trước đó; không có khi tạo ticket.
to_status	V
ARCHAR(20)
Không	—	Trạng thái mới; bị ràng buộc bởi từ vựng trạng thái được phê duyệt.
changed_at	TIMESTAMPTZ	Không	CURRENT_TIMESTAMP	Thời điểm chuyển đổi.
Nếu bảng lịch sử này được chấp nhận, giữ tickets.status là trường trạng thái hiện tại cho các truy vấn hàng đợi đơn giản và ghi cập nhật ticket cùng dòng lịch sử một cách nguyên tử trong một giao dịch. Điều này trùng lặp về mặt khái niệm với to_status mới nhất, vì vậy bất biến tickets.status = latest history.to_status phải được duy trì. Nếu không yêu cầu kiểm toán, hãy bỏ bảng và tránh gánh nặng nhất quán này.

5. Quan hệ, bản số và tính tùy chọn
Quan hệ	Bản số	Tính tùy chọn	Lý do tồn tại
User → tickets với vai trò requester	Một-nhiều	Một người dùng có thể sở hữu không hoặc nhiều ticket; mỗi ticket có đúng một requester	Câu chuyện người dùng US-01 tạo ticket; US-03 giới hạn việc xem theo requester.
Ticket → comments	Một-nhiều	Một ticket có thể có không hoặc nhiều bình luận; mỗi bình luận thuộc về đúng một ticket	US-07 yêu cầu hội thoại gắn với ticket.
User → comments với vai trò tác giả	Một-nhiều	Một người dùng có thể viết không hoặc nhiều bình luận; mỗi bình luận có đúng một tác giả	Hỗ trợ ghi nhận tác giả và phân quyền/kiểm toán.
Ticket → status history (tùy chọn)	Một-nhiều	Một ticket có thể có không hoặc nhiều chuyển đổi; mỗi dòng lịch sử thuộc về một ticket	Chỉ nếu NFR-06 kiểm toán/lịch sử được xác nhận.
User → status history actor (tùy chọn)	Một-nhiều	Một người dùng có thể gây ra không hoặc nhiều chuyển đổi; tác nhân có thể null chỉ với hành động hệ thống được phê duyệt	Gán thay đổi trạng thái cho tác nhân của nó.
Một-một: không có quan hệ nào được yêu cầu bởi các câu chuyện MVP hiện tại. Một bảng profile riêng sẽ thêm quan hệ 1:1 mà không có trường/lifecycle dành riêng cho hồ sơ nào được xác nhận, vì vậy nó bị lược bỏ.

Nhiều-nhiều: không có quan hệ nào được yêu cầu bởi MVP cốt lõi. Một vai trò vô hướng trên mỗi người dùng nắm bắt giả định một vai trò hiện tại. Các quan hệ nhóm/quyền do framework Django quản lý là hạ tầng, không phải yêu cầu miền TicketDesk. Thẻ/danh mục và gán ticket cho nhóm bị loại trừ hoặc chưa được giải quyết; chỉ thêm bảng trung gian nếu các yêu cầu đó vào phạm vi.

6. Phân tích quyền sở hữu và vai trò
tickets.requester_id là quan hệ sở hữu dữ liệu. Bản thân nó không cấp quyền truy cập; phân quyền API phải thực thi rằng Requester chỉ có thể thấy các ticket được phép.

comments.author_id ghi lại quyền tác giả. Hiển thị bình luận là công khai, nhưng người dùng vẫn cần quyền xem ticket cha.

Phạm vi hàng đợi của Support Agent, khả năng hiển thị của Manager và năng lực của Admin chưa được quy định đầy đủ. Không suy luận rằng mọi Support Agent/Manager đều có thể thấy mọi ticket.

Vai trò nghiệp vụ ADMIN không giống với is_staff hay is_superuser của Django. Việc gán vai trò không được tự động cấp quyền superuser Django.

Nếu người dùng có thể có nhiều vai trò nghiệp vụ, hãy thay users.role bằng roles cộng với user_roles; điều này không được biện minh bởi các yêu cầu hiện tại.

Token JWT là thông tin xác thực, không phải thực thể cơ sở dữ liệu. Lưu người dùng và hash mật khẩu; không thêm bảng token trừ khi yêu cầu thu hồi/blacklist token.

7. Chuẩn hóa qua 3NF
1NF: Mỗi cột giữ một giá trị. Vai trò/trạng thái là mã đơn; bình luận là các dòng riêng biệt thay vì danh sách lặp lại trên ticket; không có tệp đính kèm hay mảng thẻ được nhúng.

2NF: Tất cả bảng cốt lõi dùng khóa chính một cột, vì vậy mỗi trường không khóa phụ thuộc vào toàn bộ khóa. Không cần bảng khóa tổ hợp cho MVP.

3NF: Trường định danh/liên hệ của người dùng chỉ nằm trên 
users
; trường ticket phụ thuộc vào ID ticket; nội dung/tác giả/thời gian bình luận phụ thuộc vào ID bình luận. Email người dùng không được sao chép lên dòng ticket hoặc comment. Nhãn vai trò/trạng thái không được lặp lại dưới dạng văn bản mô tả trong các dòng phụ thuộc.

Bảng lịch sử tùy chọn ghi lại sự kiện thay vì lặp lại chi tiết hồ sơ ticket hoặc người dùng. Các giá trị from_status/to_status của nó cố ý nắm bắt sự kiện lịch sử, không phải thuộc tính người dùng/ticket hiện tại bị trùng lặp.

8. Chỉ mục và ràng buộc được đề xuất
Chỉ mục duy nhất trên users.username (yêu cầu của AbstractUser Django); không đặt email là duy nhất cho đến khi được xác nhận.

Ràng buộc CHECK cho users.role, tickets.status được phép và các giá trị trạng thái lịch sử tùy chọn.

Chỉ mục tickets(requester_id, created_at DESC) cho danh sách ticket của requester.

Chỉ mục tickets(status, updated_at DESC) cho hàng đợi hỗ trợ/lọc trạng thái.

Chỉ mục comments(ticket_id, created_at) cho hiển thị hội thoại ticket.

Chỉ mục lịch sử tùy chọn (ticket_id, changed_at).

Sử dụng ngữ nghĩa xóa FK hạn chế (restrictive) cho người dùng/ticket có bản ghi nghiệp vụ; vô hiệu hóa người dùng thay vì xóa lan truyền ticket/comment. Xác nhận chính sách lưu trữ và xóa.

Tránh thêm chỉ mục cho mọi cột; xác thực các chỉ mục bổ sung dựa trên truy vấn thực tế và khối lượng dữ liệu.

9. Câu hỏi mở trước khi phê duyệt lược đồ vật lý
Requester có luôn là người dùng đã đăng ký, hay người chưa xác thực/bên ngoài có thể gửi ticket?

Những trường ticket nào là bắt buộc ngoài mô tả? Có cần tiêu đề/chủ đề không? Có cần mã tham chiếu không?

Email có bắt buộc cho tất cả tài khoản và có phải duy nhất không?

Một người dùng có thể có nhiều vai trò hay đúng một vai trò?

Các chuyển đổi trạng thái hợp lệ là gì, ai được phép thực hiện từng chuyển đổi, và ticket có thể được mở lại không?

Lịch sử trạng thái/kiểm toán có được yêu cầu cho MVP không? Có thể có thay đổi do hệ thống khởi tạo không?

Việc gán có được đưa vào bây giờ không, và nó nhắm tới một cá nhân hay một nhóm?

Bình luận có thể được chỉnh sửa/xóa không? Requester có thể bình luận sau khi ticket được giải quyết/đóng không?

Các yêu cầu về lưu trữ, xóa tài khoản và xóa dữ liệu cá nhân là gì?

Có nên sử dụng nhóm/quyền auth của Django ngoài trường vai trò nghiệp vụ không?

10. Đánh đổi thiết kế
Chuỗi vai trò/trạng thái đơn giản cộng CHECK so với bảng tra cứu/enum: các tập cố định gọn gàng và rõ ràng cho MVP này. Ràng buộc CHECK giữ giá trị cơ sở dữ liệu hợp lệ trong khi vẫn dễ tiến hóa hơn kiểu enum PostgreSQL. Nếu vai trò trở thành dữ liệu do admin quản lý, hãy nâng chúng thành bảng tham chiếu.

Trạng thái hiện tại cộng lịch sử sự kiện tùy chọn: đọc trạng thái hiện tại nhanh so với nghĩa vụ nhất quán. Không trả chi phí lịch sử trừ khi kiểm toán được xác nhận.

FK sở hữu của Requester so với sao chép dữ liệu liên hệ: quan hệ tài khoản được chuẩn hóa tránh dữ liệu định danh bị trùng lặp. Nếu cần requester khách hoặc ảnh chụp liên hệ lịch sử, hãy mô hình hóa điều đó rõ ràng sau khi làm rõ.

Loại trừ gán một agent: giữ ERD MVP phù hợp với phạm vi đề xuất. Thêm FK người dùng nullable sau này đơn giản hơn so với mô hình hóa nhóm và lịch sử gán quá sớm.

Loại trừ hạ tầng auth Django khỏi ERD miền: Django sẽ tạo các bảng auth của riêng nó; hiển thị chúng trong ERD nghiệp vụ này sẽ che khuất các quan hệ miền của TicketDesk. Các cờ tài khoản ảnh hưởng đến hành vi người dùng Django vẫn được liệt kê.
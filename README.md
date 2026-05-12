# 🏦 Financial Analyzer Pro

> Nền tảng phân tích tài chính doanh nghiệp toàn diện dành cho SME Việt Nam

[![Node.js Version](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

## 📌 Giới thiệu

Financial Analyzer Pro là một nền tảng tài chính toàn diện giúp doanh nghiệp vừa và nhỏ (SME) tại Việt Nam:
- **Đánh giá sức khỏe tài chính** với các chỉ số ROE, ROA, D/E, ICR,...
- **So sánh các gói vay ngân hàng** thông minh dựa trên hồ sơ doanh nghiệp
- **Nhận tư vấn AI** 24/7 về rủi ro, dòng tiền, vay vốn và lợi nhuận
- **Cập nhật dữ liệu vĩ mô** (GDP, lạm phát, tỷ giá, lãi suất điều hành) theo thời gian thực

---

## 📖 Mục lục

1. [Hướng dẫn sử dụng cho Khách hàng](#-hướng-dẫn-sử-dụng-cho-khách-hàng)
   - [Flow sử dụng cơ bản](#flow-sử-dụng-cơ-bản)
   - [Hướng dẫn từng TAB](#hướng-dẫn-từng-tab)
2. [Hướng dẫn cho Developer](#-hướng-dẫn-cho-developer)
   - [Cài đặt và chạy local](#cài-đặt-và-chạy-local)
   - [Cấu trúc dự án](#cấu-trúc-dự-án)
   - [Thêm gói vay ngân hàng mới](#thêm-gói-vay-ngân-hàng-mới)
   - [Cập nhật dữ liệu vĩ mô](#cập-nhật-dữ-liệu-vĩ-mô)
   - [Deploy lên Render](#deploy-lên-render)
3. [Troubleshooting](#-troubleshooting)

---

# 👤 Hướng dẫn sử dụng cho Khách hàng

## Flow sử dụng cơ bản

```mermaid
flowchart TD
    A[Truy cập website] --> B[Nhập thông tin doanh nghiệp]
    B --> C[Hệ thống tự động tính toán<br>ROE, ROA, D/E, ICR,...]
    C --> D{Chọn TAB quan tâm}
    
    D --> E[TAB Risk Assessment<br>Xem đánh giá rủi ro]
    D --> F[TAB Bank Compare<br>So sánh gói vay ngân hàng]
    D --> G[TAB Dashboard<br>Xem tổng quan sức khỏe]
    D --> H[TAB AI Consultant<br>Hỏi đáp với AI]
    D --> I[TAB Deep Risk<br>Phân tích rủi ro 7 nhóm]

    F --> J[Điền số tiền & thời hạn vay]
    J --> K[Hệ thống gợi ý gói vay phù hợp nhất]

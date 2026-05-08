const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Import các web scraper (đã có sẵn)
const vietcombankScraper = require('./scrapers/vietcombank');
const bidvScraper = require('./scrapers/bidv');
const mbbankScraper = require('./scrapers/mbbank');
const techcombankScraper = require('./scrapers/techcombank');
const vpbankScraper = require('./scrapers/vpbank');
const sacombankScraper = require('./scrapers/sacombank');

// ==================== DATABASE ====================
const DB_PATH = path.join(__dirname, '../database/loans.json');

// Đảm bảo thư mục database tồn tại
if (!fs.existsSync(path.dirname(DB_PATH))) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

// Dữ liệu mặc định (giống hệt file localhost của bạn)
const DEFAULT_LOANS = [
    { id: 1, name: "Vietcombank", packageName: "Cho vay SXKD", interestRate: 4.6, processingFee: 0.5, maxTerm: 12, minLoan: 50000000, maxLoan: 30000000000, maxLTV: 100, minIncome: 8000000, pros: "Lãi suất chỉ từ 4,6%/năm", cons: "Chỉ vay ngắn hạn", requirements: "Phương án SXKD khả thi", loanTypes: ["collateral"], source: "Vietcombank" },
    { id: 2, name: "BIDV", packageName: "Vay vốn lưu động", interestRate: 7.0, processingFee: 0.3, maxTerm: 12, minLoan: 30000000, maxLoan: 10000000000, maxLTV: 100, minIncome: 7000000, pros: "Giải ngân nhanh", cons: "Lãi suất thay đổi", requirements: "Giấy tờ chứng minh SXKD", loanTypes: ["collateral"], source: "BIDV" },
    { id: 3, name: "MB Bank", packageName: "MISA Lending", interestRate: 6.0, processingFee: 0.5, maxTerm: 120, minLoan: 100000000, maxLoan: 10000000000, maxLTV: 80, minIncome: 10000000, pros: "Gói vay số hóa", cons: "Yêu cầu hồ sơ số", requirements: "Kết nối MISA", loanTypes: ["collateral"], source: "MB Bank" },
    { id: 4, name: "Techcombank", packageName: "Vay SME", interestRate: 5.99, processingFee: 0.8, maxTerm: 120, minLoan: 100000000, maxLoan: 8000000000, maxLTV: 80, minIncome: 10000000, pros: "Lãi suất thấp", cons: "Phí xử lý cao", requirements: "BCTC 2 năm", loanTypes: ["collateral"], source: "Techcombank" },
    { id: 5, name: "VPBank", packageName: "Vay doanh nghiệp", interestRate: 6.9, processingFee: 0.6, maxTerm: 120, minLoan: 50000000, maxLoan: 6000000000, maxLTV: 75, minIncome: 8000000, pros: "Thủ tục nhanh", cons: "Phí xử lý", requirements: "Hoạt động có lãi", loanTypes: ["collateral"], source: "VPBank" },
    { id: 6, name: "Sacombank", packageName: "Vay SXKD", interestRate: 7.49, processingFee: 0.4, maxTerm: 120, minLoan: 50000000, maxLoan: 5000000000, maxLTV: 75, minIncome: 8000000, pros: "Thủ tục đơn giản", cons: "Lãi suất sau ưu đãi cao", requirements: "CMND, ĐKKD", loanTypes: ["collateral"], source: "Sacombank" }
];

// Khởi tạo database nếu chưa có
function initDatabase() {
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_LOANS, null, 2));
    }
}

// Đọc database
function readDatabase() {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch {
        return DEFAULT_LOANS;
    }
}

// Ghi database
function writeDatabase(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// ==================== API GIỐNG HỆT FILE LOCALHOST ====================
app.get('/api/loans', (req, res) => {
    const loans = readDatabase();
    res.json(loans);
});

app.get('/api/loans/:id', (req, res) => {
    const loans = readDatabase();
    const loan = loans.find(l => l.id == req.params.id);
    loan ? res.json(loan) : res.status(404).json({ error: 'Không tìm thấy' });
});

app.put('/api/loans/:id', (req, res) => {
    const loans = readDatabase();
    const index = loans.findIndex(l => l.id == req.params.id);
    if (index !== -1) {
        loans[index] = { ...loans[index], ...req.body };
        writeDatabase(loans);
        res.json(loans[index]);
    } else {
        res.status(404).json({ error: 'Không tìm thấy' });
    }
});

// ==================== API REFRESH - CHẠY WEB SCRAPER THẬT ====================
app.post('/api/loans/refresh', async (req, res) => {
    const scrapers = [
        { name: "Vietcombank", scraper: vietcombankScraper },
        { name: "BIDV", scraper: bidvScraper },
        { name: "MB Bank", scraper: mbbankScraper },
        { name: "Techcombank", scraper: techcombankScraper },
        { name: "VPBank", scraper: vpbankScraper },
        { name: "Sacombank", scraper: sacombankScraper }
    ];
    
    const allLoans = [];
    let idCounter = 1;
    const results = [];
    
    for (const bank of scrapers) {
        try {
            console.log(`🔄 Đang scrape ${bank.name}...`);
            const loans = await bank.scraper.scrape();
            
            for (const loan of loans) {
                allLoans.push({
                    id: idCounter++,
                    name: bank.name,
                    packageName: loan.packageName,
                    interestRate: loan.interestRate,
                    processingFee: 0.5,
                    maxTerm: loan.maxTerm,
                    minLoan: loan.minLoan,
                    maxLoan: loan.maxLoan,
                    maxLTV: 80,
                    minIncome: 8000000,
                    pros: loan.pros,
                    cons: loan.cons,
                    requirements: loan.requirements,
                    source: `${bank.name} - Web Scraping ${new Date().toLocaleString()}`,
                    loanTypes: ["collateral"]
                });
            }
            
            results.push({ bank: bank.name, status: 'success', count: loans.length });
            console.log(`✅ ${bank.name}: ${loans.length} gói vay`);
            
        } catch (error) {
            console.error(`❌ ${bank.name} thất bại:`, error.message);
            results.push({ bank: bank.name, status: 'error', error: error.message });
        }
    }
    
    if (allLoans.length > 0) {
        writeDatabase(allLoans);
    }
    
    res.json({ 
        success: true, 
        results, 
        totalLoans: allLoans.length,
        message: 'Đã cập nhật dữ liệu từ web scraper!'
    });
});

// API RESET về dữ liệu mặc định
app.post('/api/loans/reset', (req, res) => {
    writeDatabase(DEFAULT_LOANS);
    res.json({ success: true, message: 'Đã reset về dữ liệu mặc định' });
});

// Khởi tạo database
initDatabase();

// Chạy server
app.listen(PORT, () => {
    console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
    console.log(`📊 API: http://localhost:${PORT}/api/loans`);
    console.log(`🔄 Refresh: http://localhost:${PORT}/api/loans/refresh`);
});

const levels = {
    1: [
        { equipment: "เมาส์", description: "ใช้งานสำหรับควบคุมตัวชี้บนหน้าจอ" },
        { equipment: "คีย์บอร์ด", description: "ใช้งานสำหรับพิมพ์ข้อความหรือคำสั่ง" },
        { equipment: "เครื่องพิมพ์", description: "ใช้พิมพ์ข้อมูลจากคอมพิวเตอร์ออกมาเป็นเอกสาร" },
        { equipment: "ลำโพง", description: "ใช้งานสำหรับเล่นเสียงจากคอมพิวเตอร์" },
        { equipment: "ไมโครโฟน", description: "ใช้สำหรับบันทึกเสียง" }
    ],
    2: [
        { equipment: "จอภาพ", description: "แสดงผลข้อมูลในรูปแบบกราฟิกหรือข้อความ" },
        { equipment: "ฮาร์ดดิสก์", description: "ใช้สำหรับเก็บข้อมูลระยะยาว" },
        { equipment: "แฟลชไดรฟ์", description: "อุปกรณ์จัดเก็บข้อมูลเคลื่อนที่" },
        { equipment: "เครื่องพิมพ์", description: "พิมพ์ข้อมูลจากคอมพิวเตอร์ออกมาเป็นเอกสาร" },
        { equipment: "เว็บแคม", description: "ใช้งานสำหรับถ่ายภาพหรือวิดีโอ" }
    ],
    3: [
        { equipment: "การ์ดกราฟิก", description: "ประมวลผลภาพกราฟิกในคอมพิวเตอร์" },
        { equipment: "แรม", description: "หน่วยความจำที่ใช้ในการประมวลผลข้อมูลชั่วคราว" },
        { equipment: "ซีพียู", description: "หน่วยประมวลผลกลางของคอมพิวเตอร์" },
        { equipment: "เมนบอร์ด", description: "แผงวงจรหลักของคอมพิวเตอร์ที่เชื่อมต่อส่วนประกอบต่าง ๆ" },
        { equipment: "พาวเวอร์ซัพพลาย", description: "อุปกรณ์จ่ายไฟให้กับคอมพิวเตอร์" }
    ]
};

// ตัวแปรสถานะ
let currentLevel = 1;
let shuffledEquipment = [];
let shuffledDescriptions = [];
let score = 0;
let matchedPairs = 0;
let playedPairs = 0;  // จำนวนคู่ที่ผู้เล่นได้เล่นไป

// อ้างอิง DOM
const equipmentList = document.getElementById("equipment-list");
const descriptionList = document.getElementById("description-list");
const scoreElement = document.getElementById("score");
const levelNumberElement = document.getElementById("level-number");

// เริ่มเกม
function startGame() {
    score = 0;
    matchedPairs = 0;
    playedPairs = 0;
    updateScore();
    loadLevel(currentLevel);
}

// โหลดข้อมูลสำหรับ level
function loadLevel(level) {
    if (levels[level]) {
        const levelData = levels[level];
        shuffledEquipment = shuffleArray(levelData.map(item => item.equipment));
        shuffledDescriptions = shuffleArray(levelData.map(item => item.description));

        // แสดงรายการ
        displayList(equipmentList, shuffledEquipment, "equipment");
        displayList(descriptionList, shuffledDescriptions, "description");

        // อัพเดทข้อมูล level
        levelNumberElement.textContent = `Level ${level}`;
    } else {
        // ถ้าผู้เล่นผ่านทั้งหมดแล้ว แสดงว่าเกมจบ
        showFinalMessage();
    }
}

// สุ่มรายการ
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// แสดงรายการ
function displayList(container, items, type) {
    container.innerHTML = ""; // ล้างรายการเก่า
    items.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        li.dataset.type = type;
        li.dataset.value = item;

        // เพิ่มคลิกอีเวนต์
        li.addEventListener("click", () => handleItemClick(li));
        container.appendChild(li);
    });
}

// การจับคู่
let selectedEquipment = null;
let selectedDescription = null;

function handleItemClick(item) {
    if (item.dataset.type === "equipment") {
        selectedEquipment = item;
    } else if (item.dataset.type === "description") {
        selectedDescription = item;
    }

    // ถ้าทั้งคู่ถูกเลือก
    if (selectedEquipment && selectedDescription) {
        playedPairs++;  // เพิ่มจำนวนคู่ที่ผู้เล่นได้เล่นไป
        checkMatch();
    }
}

// ตรวจสอบการจับคู่
function checkMatch() {
    const equipment = selectedEquipment.dataset.value;
    const description = selectedDescription.dataset.value;

    const correct = levels[currentLevel].find(
        item => item.equipment === equipment && item.description === description
    );

    if (correct) {
        score++;
        matchedPairs++;  // เพิ่มจำนวนคู่ที่จับคู่ถูกต้อง
        updateScore();
        selectedEquipment.style.background = "#c3e6cb";
        selectedDescription.style.background = "#c3e6cb";

        // ลบรายการที่จับคู่ถูกต้องออกจากรายการ
        selectedEquipment.remove();
        selectedDescription.remove();
    } else {
        selectedEquipment.style.background = "#f5c6cb";
        selectedDescription.style.background = "#f5c6cb";
    }

    // รีเซ็ตตัวเลือก
    selectedEquipment = null;
    selectedDescription = null;

    // เช็คว่าผู้เล่นเล่นครบทุกข้อใน level นี้แล้วหรือยัง
    if (playedPairs === levels[currentLevel].length) {
        setTimeout(() => {
            // ถ้าผู้เล่นเล่นครบทุกข้อใน level ปัจจุบันแล้ว จะไป level ถัดไป
            currentLevel++; // ไปยัง level ถัดไป
            playedPairs = 0; // รีเซ็ตจำนวนคู่ที่ผู้เล่นได้เล่นใน level ถัดไป
            loadLevel(currentLevel); // โหลด level ถัดไป
        }, 1000);
    }
}

// อัปเดตคะแนน
function updateScore() {
    scoreElement.textContent = score;
}

// แสดงข้อความสุดท้ายเมื่อเกมจบ
function showFinalMessage() {
    let message;
    if (score === 100) {
        message = "ยอดเยี่ยมมาก! คุณทำคะแนนได้สูงสุด!";
    } else if (score >= 80) {
        message = "ดีมาก! คุณทำได้ดี!";
    } else if (score >= 60) {
        message = "ดี! แต่ยังมีพื้นที่สำหรับการพัฒนา!";
    } else {
        message = "พยายามต่อไป! คุณสามารถทำได้!";
    }

    alert(`${message}\nคะแนนรวมของคุณคือ: ${score}`);
}

// เริ่มเกมเมื่อโหลดหน้า
startGame();

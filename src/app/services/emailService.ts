// src/app/services/emailService.ts

interface EmailParams {
  email: string;
  name: string;
  date: Date; // 포맷된 날짜
  time: string; // 포맷된 시간
  state?: string; // 상태 (확정/재신청 필요)
  delayReason?: string; // 재신청 사유
}

const sendEmailRequest = async (to: string, subject: string, html: string) => {
  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to,
        subject,
        html,
      }),
    });

    if (response.ok) {
      console.log("Email sent successfully!");
      return true;
    } else {
      const errorData = await response.json();
      console.error("Failed to send email:", errorData.message);
      return false;
    }
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

export const sendEmail = async ({ email, name, date, time }: EmailParams) => {
  const emailSubject = `${name}님의 면담 일정을 확인해주세요.`;
  const emailHTML = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #4CAF50;">${name}님의 면담 일정을 확인해주세요.</h2>
      <ul style="background-color: #f9f9f9; padding: 10px; border-radius: 5px;">
        <li><strong>날짜:</strong> ${date}</li>
        <li><strong>시간:</strong> ${time}</li>
        <li><strong>일정 확인:</strong> <a href="http://localhost:3000/admin" style="color: #007BFF; text-decoration: none;">일정 관리 페이지로 이동</a></li>
      </ul>
      <hr />
      <footer style="font-size: 0.9em; color: #666;">
        <p>본 메일은 자동 발송된 메일입니다.</p>
      </footer>
    </div>
  `;

  return sendEmailRequest(email, emailSubject, emailHTML);
};

export const reApplyEmail = async ({ email, name, date, time, delayReason }: EmailParams) => {
  const emailSubject = `[김병정 교수님] ${name}님! 면담 재신청이 필요합니다.`;
  const emailHTML = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #FF5733;">${name}님의 면담 재신청이 필요합니다.</h2>
      <ul style="background-color: #f9f9f9; padding: 10px; border-radius: 5px;">
        <li><strong>날짜:</strong> ${date}</li>
        <li><strong>시간:</strong> ${time}</li>
        <li><strong>재신청 필요 사유:</strong> ${delayReason || "사유가 제공되지 않았습니다."}</li>
        <li><strong>면담 신청 확인:</strong> <a href="http://localhost:3000/" style="color: #007BFF; text-decoration: none;">면담 신청 페이지로 이동</a></li>
      </ul>
      <hr />
      <footer style="font-size: 0.9em; color: #666;">
        <p>본 메일은 자동 발송된 메일입니다.</p>
      </footer>
    </div>
  `;

  return sendEmailRequest(email, emailSubject, emailHTML);
};

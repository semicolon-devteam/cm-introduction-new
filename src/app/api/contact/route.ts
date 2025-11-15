import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // API Key 확인 로그
    console.log("[Contact API] RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);
    console.log("[Contact API] API Key prefix:", process.env.RESEND_API_KEY?.substring(0, 6));

    const { name, email, phone, company, message } = await request.json();

    // 입력 검증
    if (!name || !email || !phone || !company || !message) {
      return NextResponse.json({ error: "모든 필드를 입력해주세요." }, { status: 400 });
    }

    // Resend 무료 플랜: 본인 이메일로만 발송 가능
    // 프로덕션: 도메인 인증 후 to 주소를 roki@semi-colon.space로 변경
    const recipientEmail =
      process.env.NODE_ENV === "production"
        ? "reus7042@gmail.com" // 임시: 무료 플랜 제한
        : "reus7042@gmail.com";

    console.log("[Contact API] Sending email to:", recipientEmail);
    console.log("[Contact API] From:", name, company);

    // 이메일 전송
    const { data, error } = await resend.emails.send({
      from: "Semicolon Contact <onboarding@resend.dev>", // Resend 기본 발신자 (나중에 도메인 설정 시 변경)
      to: recipientEmail,
      subject: `[문의] ${company} - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #068FFF; border-bottom: 2px solid #068FFF; padding-bottom: 10px;">
            새로운 문의가 접수되었습니다
          </h2>

          <div style="margin: 20px 0;">
            <p style="margin: 10px 0;">
              <strong style="color: #1D242B;">성함:</strong> ${name}
            </p>
            <p style="margin: 10px 0;">
              <strong style="color: #1D242B;">이메일:</strong>
              <a href="mailto:${email}" style="color: #068FFF;">${email}</a>
            </p>
            <p style="margin: 10px 0;">
              <strong style="color: #1D242B;">연락처:</strong> ${phone}
            </p>
            <p style="margin: 10px 0;">
              <strong style="color: #1D242B;">회사/조직명:</strong> ${company}
            </p>
          </div>

          <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-left: 4px solid #068FFF;">
            <p style="margin: 0 0 10px 0;">
              <strong style="color: #1D242B;">문의 내용:</strong>
            </p>
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E0E0E1; color: #666; font-size: 12px;">
            <p>이 이메일은 Semicolon 팀 소개 사이트의 문의 폼을 통해 자동으로 발송되었습니다.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("[Contact API] Resend API Error:", error);
      return NextResponse.json({ error: "이메일 전송에 실패했습니다." }, { status: 500 });
    }

    console.log("[Contact API] Email sent successfully! ID:", data?.id);
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}

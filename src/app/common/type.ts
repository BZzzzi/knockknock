export type RequestBody = {
  name: string;
  student_signature: number;
  email: string;
  subject: string;
  meeting_detail: string;
  duration_10minutes_over: boolean;
  date: Date;
  day: string;
  start_time: string;
  end_time: string;
  state: string;
  delay_reason: string;
};

export interface EmailRequest {
  to: string;
  subject: string;
  text: string;
}

export interface EmailResponse {
  message: string;
}

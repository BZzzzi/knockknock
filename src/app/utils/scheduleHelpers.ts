import { supabase } from "../utils/supabaseClient";

// 데이터 저장 및 업데이트 함수
export const saveScheduleData = async (
  id: string,
  name: string,
  student_signature: number,
  email: string,
  subject: string,
  meeting_detail: string,
  duration_10minutes_over: boolean,
  date: Date,
  day: string,
  start_time: string,
  end_time: string,
  state: string,
  delay_reason: string | null
): Promise<string | null> => {
  try {
    if (id) {
      // 기존 데이터 업데이트 로직
      const { data: existingData, error: fetchError } = await supabase
        .from("userTable")
        .select("id")
        .eq("id", id);

      if (fetchError) {
        console.error("Error checking existing data:", fetchError.message);
        throw fetchError;
      }

      if (existingData && existingData.length > 0) {
        console.log("Existing Data Found:", existingData);

        const { error: updateError } = await supabase
          .from("userTable")
          .update({
            name,
            student_signature,
            email,
            subject,
            meeting_detail,
            duration_10minutes_over,
            date,
            day,
            start_time,
            end_time,
            state,
            ...(delay_reason ? { delay_reason } : {}), // delay_reason이 있으면 업데이트
          })
          .eq("id", id);

        if (updateError) {
          console.error("Error updating data:", updateError.message);
          throw updateError;
        }

        return existingData[0].id; // 기존 UUID 반환
      }
    }

    // 새 데이터 삽입 로직
    const { data, error: insertError } = await supabase
      .from("userTable")
      .insert([
        {
          name,
          student_signature,
          email,
          subject,
          meeting_detail,
          duration_10minutes_over,
          day,
          date,
          start_time,
          end_time,
          state,
          ...(delay_reason ? { delay_reason } : {}), // delay_reason이 있으면 업데이트
        },
      ])
      .select("id")
      .single();

    if (insertError) {
      console.error("Insert Error:", insertError.message);
      throw insertError;
    }

    return data?.id || null; // 삽입된 데이터의 ID 반환
  } catch (err) {
    console.error("Error saving or updating schedule:", err);
    return null;
  }
};

// 어드민 데이터 저장 및 업데이트 함수
export const saveScheduleDataAdmin = async (
  id: string,
  date: Date,
  start_time: string,
  end_time: string,
  pf_schedule: string,
  pf_detail_reason: string
): Promise<string | null> => {
  try {
    if (id) {
      // 기존 데이터 업데이트 로직
      const { data: existingData, error: fetchError } = await supabase
        .from("adminTable")
        .select("id")
        .eq("id", id);

      if (fetchError) {
        console.error("Error checking existing data:", fetchError.message);
        throw fetchError;
      }

      if (existingData && existingData.length > 0) {
        console.log("Existing Data Found:", existingData);

        const { error: updateError } = await supabase
          .from("userTable")
          .update({
            date,
            start_time,
            end_time,
            pf_schedule,
            pf_detail_reason,
          })
          .eq("id", id);

        if (updateError) {
          console.error("Error updating data:", updateError.message);
          throw updateError;
        }

        return existingData[0].id; // 기존 UUID 반환
      }
    }

    // 새 데이터 삽입 로직
    const { data, error: insertError } = await supabase
      .from("userTable")
      .insert([
        {
          date,
          start_time,
          end_time,
          pf_schedule,
          pf_detail_reason,
        },
      ])
      .select("id")
      .single();

    if (insertError) {
      console.error("Insert Error:", insertError.message);
      throw insertError;
    }

    return data?.id || null; // 삽입된 데이터의 ID 반환
  } catch (err) {
    console.error("Error saving or updating schedule:", err);
    return null;
  }
};

// 데이터 삭제 함수
export const deleteScheduleData = async (id: string): Promise<boolean> => {
  try {
    const { error: deleteError } = await supabase.from("userTable").delete().eq("id", id);

    if (deleteError) {
      console.error("Error deleting data:", deleteError.message);
      throw deleteError;
    }

    console.log("Data deleted successfully:", id);
    return true; // 삭제 성공
  } catch (err) {
    console.error("Error deleting schedule:", err);
    return false; // 삭제 실패
  }
};

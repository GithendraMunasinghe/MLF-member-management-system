import { useState } from "react";
import {
  buildMemberPayload,
  createMemberFormData,
} from "../utils/memberPayload";

export default function useMemberDraft(
  token: string | null,
  formData: any,
  formType: "type1" | "type2"
) {
  const [draftId, setDraftId] = useState<string | null>(null);

  const saveDraft = async () => {
    try {
      const payload = buildMemberPayload(
        formData,
        formType
      );

      const formDataToSend = createMemberFormData(
        payload,
        "draft",
        formData.photo
      );

      if (!draftId) {
        const res = await fetch(
          "http://localhost:5000/api/members",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formDataToSend,
          }
        );

        const data = await res.json();

        if (res.ok) {
          setDraftId(data.member._id);
        }
      } else {
        await fetch(
          `http://localhost:5000/api/members/${draftId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formDataToSend,
          }
        );
      }
    } catch (err) {
      console.error("Draft save failed", err);
    }
  };

  return {
    draftId,
    setDraftId,
    saveDraft,
  };
}
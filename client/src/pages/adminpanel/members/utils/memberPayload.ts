export const buildMemberPayload = (
  formData: any,
  formType: "type1" | "type2"
) => {
  return {
    organizationId: formData.organizationId,
    organizationType: formData.organizationType,
    formType,

    eventId: formData.eventId,
    categories: formData.categories || [],
    categoryTitles: formData.categoryTitles || [],

    coordinatorId: formData.coordinatorId,

    regNo: formData.regNo,
    batchNumber: formType === "type2" ? formData.batchNumber : undefined,
    registeredYear:
      formType === "type2" ? formData.registeredYear : undefined,

    personalInfo: {
      ...formData.personalInfo,
      dateOfBirth: formData.personalInfo.dateOfBirth || null,
    },

    contact: {
      mobilePhone: formData.contact.mobilePhone,
      whatsappNumber: formData.contact.whatsappNumber,
      email: formType === "type2" ? formData.contact.email : undefined,
    },

    address: {
      ...formData.address,
      policeDivision:
        formType === "type2" ? formData.address.policeDivision : undefined,
    },

    business:
      formType === "type2"
        ? {
            ...formData.business,
            numberOfBranches: formData.business.numberOfBranches
              ? Number(formData.business.numberOfBranches)
              : undefined,
            grade: formData.business.grade
              ? Number(formData.business.grade)
              : undefined,
          }
        : undefined,

    professional: formType === "type1" ? formData.professional : undefined,
  };
};

export const createMemberFormData = (
  payload: any,
  status: "draft" | "completed",
  photo?: File | null
) => {
  const formDataToSend = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === "object") {
        formDataToSend.append(key, JSON.stringify(value));
      } else {
        formDataToSend.append(key, value as string);
      }
    }
  });

  formDataToSend.append("status", status);

  if (photo) {
    formDataToSend.append("photo", photo);
  }

  return formDataToSend;
};
export const validateMemberStep = (
  step: number,
  formData: any
): string => {
  if (step === 1) {
    if (!formData.organizationId) return "Please select an organization.";
    if (!formData.eventId) return "Please select an event.";
    if (!formData.coordinatorId) return "Please select a coordinator.";
    if (!formData.regNo.trim()) return "Please enter registration number.";
  }

  if (step === 2) {
    if (!formData.personalInfo.fullName.trim()) {
      return "Please enter full name.";
    }

    const hasAnyIdentity =
      formData.personalInfo.nicNumber.trim() ||
      formData.personalInfo.passportNumber.trim() ||
      formData.personalInfo.drivingLicense.trim();

    if (!hasAnyIdentity) {
      return "Please enter at least one identity number: NIC, Passport Number, or Driving License.";
    }

    if (!formData.personalInfo.gender) return "Please select gender.";
    if (!formData.personalInfo.maritalStatus) {
      return "Please select marital status.";
    }
  }

  if (step === 3) {
    if (!formData.contact.mobilePhone.trim()) {
      return "Please enter mobile phone number.";
    }

    if (!formData.contact.whatsappNumber.trim()) {
      return "Please enter WhatsApp number.";
    }
  }

  if (step === 4) {
    if (!formData.address.permanentAddress.trim()) {
      return "Please enter permanent address.";
    }

    if (!formData.address.province) return "Please select province.";
    if (!formData.address.district) return "Please select district.";
  }

  return "";
};
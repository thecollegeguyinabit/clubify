
import React from "react";
import AuthProtected from "@/components/layout/AuthProtected";
import ClubLayout from "@/components/layout/ClubLayout";

const Club = () => {
  return (
    <AuthProtected>
      <ClubLayout />
    </AuthProtected>
  );
};

export default Club;


import React from "react";
import Header from "@/components/Header";
import ClubForm from "@/components/clubs/ClubForm";
import AuthProtected from "@/components/layout/AuthProtected";

const CreateClub = () => {
  return (
    <AuthProtected>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="container py-12 flex-1 flex items-center justify-center animate-slide-in">
          <ClubForm />
        </main>
      </div>
    </AuthProtected>
  );
};

export default CreateClub;

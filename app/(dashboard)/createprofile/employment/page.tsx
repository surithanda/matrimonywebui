import FormSection from "./_components/FormSection";

const EmploymentPage = () => {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 py-8">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-semibold mb-6 px-6">Employment Details</h1>
        <FormSection />
      </div>
    </div>
  );
};

export default EmploymentPage;

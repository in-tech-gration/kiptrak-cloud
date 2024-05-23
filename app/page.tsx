import SignUpUserSteps from "@/components/tutorial/SignUpUserSteps";
import TutHeader from "@/components/Header";
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";

export default async function Index() {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <Header />

      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">
        <TutHeader />
        <main className="flex-1 flex flex-col gap-6">
          <h2 className="font-bold text-4xl mb-4">Next steps</h2>
          <SignUpUserSteps />
        </main>
      </div>

      <Footer />
    </div>
  );
}

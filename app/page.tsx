import WaitlistForm from "@/components/WaitlistForm";

export default function Home() {
  return (
    <main className="container mx-auto py-20">
      <h1 className="text-4xl font-bold text-center mb-8">
        Join AudioAlpha Waitlist
      </h1>
      <div className="max-w-md mx-auto">
        <WaitlistForm />
      </div>
    </main>
  );
}

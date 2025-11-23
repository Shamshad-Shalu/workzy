import Header from '@/layouts/user/Header';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card rounded-lg border border-border shadow p-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">Welcome, !</h2>

          <p className="text-muted-foreground">
            This is your home page. You can add your content here.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function CancelPage() {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout Cancelled</h1>
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Your checkout process was cancelled.</strong>
          <span className="block sm:inline"> No charges were made to your account.</span>
        </div>
        <div className="mt-8">
          <a href="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Return to Home
          </a>
        </div>
      </div>
    );
  }
  
  
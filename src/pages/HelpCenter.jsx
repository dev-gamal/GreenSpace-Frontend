export default function HelpCenter() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Help Center</h1>
      <p className="text-gray-600 mb-8">How can we help you today?</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-3">For Landowners</h2>
          <ul className="space-y-3 text-gray-600">
            <li><a href="#" className="hover:text-green-700">How do I list my garden?</a></li>
            <li><a href="#" className="hover:text-green-700">Managing reservation requests</a></li>
            <li><a href="#" className="hover:text-green-700">Safety guidelines for sharing</a></li>
            <li><a href="#" className="hover:text-green-700">Editing your garden details</a></li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-3">For Gardeners</h2>
          <ul className="space-y-3 text-gray-600">
            <li><a href="#" className="hover:text-green-700">How to reserve a garden</a></li>
            <li><a href="#" className="hover:text-green-700">Connecting with landowners</a></li>
            <li><a href="#" className="hover:text-green-700">Using the community market</a></li>
            <li><a href="#" className="hover:text-green-700">Gardening best practices</a></li>
          </ul>
        </div>
      </div>

      <div className="mt-12 bg-green-50 p-8 rounded-3xl text-center">
        <h2 className="text-xl font-bold text-green-900 mb-2">Still need help?</h2>
        <p className="text-green-700 mb-6">Our support team is always ready to assist you.</p>
        <button className="bg-green-700 text-white px-6 py-2 rounded-full font-medium hover:bg-green-800 transition-colors">
          Contact Support
        </button>
      </div>
    </div>
  );
}
